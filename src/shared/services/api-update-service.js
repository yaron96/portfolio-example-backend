import np from './api/novaPoshta.js'

import AreaController from "../../controllers/AreaController.js";
import CityController from "../../controllers/CityController.js";

import UpdateController from "../../controllers/UpdateController.js";

const apiUpdateService = {}

apiUpdateService.syncData = {
    checker: async () => {
        console.log('checker')
        console.log('now: ' + new Date())
        /*
        Check last update date and update
        */
        const latestUpdate = await UpdateController.find()
            .then(res => res && res.date)
        console.log('latest update : ' + latestUpdate)
        let today = new Date()

        if (latestUpdate) {
            if (
                latestUpdate.getFullYear() < today.getFullYear()
                ||
                latestUpdate.getMonth() < today.getMonth()
                ||
                latestUpdate.getDate() < today.getDate()
            ) {
                await apiUpdateService.syncData.all()
                await UpdateController.findOneAndUpdate({date: new Date()})
            }
        } else {
            await apiUpdateService.syncData.all()
            await UpdateController.create({date: new Date()})
        }

        //TODO - config file with time for update

        /*
        setTimeout to 00:00:00 next day for update
        */
        today.setDate(today.getDate() + 1)
        today.setHours(0)
        today.setMinutes(0)
        today.setMilliseconds(0)
        setTimeout(apiUpdateService.syncData.checker, today.getTime() - Date.now())
    },
    all: async () => {
        try {
            await apiUpdateService.syncData.areas()
            console.log('areas done')
            await apiUpdateService.syncData.cities()
            console.log('cities done')
            await apiUpdateService.syncData.relationships()
            console.log('relationships done')
        } catch (e) {
            console.log(e)
        }
    },
    areas: async () => {
        try {
            const api_Areas = await np.getAreas()
            const db_Areas = await AreaController.find()

            const props = await AreaController.schemaTree()
                .then(res => {
                    const unusedProps = ['Cities', '_id', '__v', 'id']
                    return res.filter(prop => !unusedProps.includes(prop))
                })

            await Promise.all(api_Areas.map(async (api_area) => {
                const db_area = db_Areas.find(area => area.Ref === api_area.Ref)
                if (!db_area) {
                    return await AreaController.create(api_area)
                }
                await Promise.all(props.map(async (prop) => {
                    if (db_area[prop] !== api_area[prop]) {
                        await AreaController.findOneAndUpdate(
                            {Ref: db_area.Ref},
                            {[prop]: api_area[prop]})
                    }
                }))
            }))
            //check and delete area in DBc if API already delete it
            await Promise.all(db_Areas.map(async (area) => {
                if (!api_Areas.find((item) => item.Ref === area.Ref))
                    await AreaController.findOneAndDelete({Ref: area.Ref})
            }))
        } catch (e) {
            console.log('areas')
            console.log(e)
        }

    },
    cities: async () => {
        try {
            /*
            get cities from API
            */
            let API_cities = await np.getCities()
            await Promise.all(API_cities.map(async (cityInAPI) => {
                let cityInDB = await CityController.findOne({Ref: cityInAPI.Ref})
                // delete extra prop to avoid mistakes with DB schema
                cityInAPI.AreaRef = cityInAPI.Area
                delete cityInAPI.Area
                // transform days props to week array
                cityInAPI.DeliveryDays = [
                    Boolean(Number(cityInAPI.Delivery1)), Boolean(Number(cityInAPI.Delivery2)),
                    Boolean(Number(cityInAPI.Delivery3)), Boolean(Number(cityInAPI.Delivery4)),
                    Boolean(Number(cityInAPI.Delivery5)), Boolean(Number(cityInAPI.Delivery6)),
                    Boolean(Number(cityInAPI.Delivery7)),
                ]
                /*
                if DB has obj. with such id
                check for something changed and update
                */
                if (cityInDB) {
                    let cityProps = await CityController.schemaTree()
                    const unusableProps = ['Area', '_id', 'id', '__v']
                    cityProps = cityProps.filter((value) => !unusableProps.includes(value))
                    await Promise.all(cityProps.map(async (prop) => {
                        if (cityInDB[prop] !== cityInAPI[prop]
                            && Array.isArray(cityInDB[prop])
                            && Array.isArray(cityInAPI[prop])
                            && cityInDB[prop].length === cityInAPI[prop].length
                            && !arraysCompare(cityInDB[prop], cityInAPI[prop])
                        ) await CityController.findOneAndUpdate({Ref: cityInDB.Ref}, {[prop]: cityInAPI[prop]})
                    }))
                } else await CityController.create(cityInAPI)
            }))

            /* check and delete city in DB if API already delete it */
            const citiesInDB = await CityController.find({})
            await Promise.all(citiesInDB.map(async (city) => {
                if (!API_cities.find((item) => item.Ref === city.Ref))
                    await CityController.findOneAndDelete({Ref: city.Ref})

            }))

            function arraysCompare(arr1, arr2) {
                let i = arr1.length
                while (i--) {
                    if (arr1[i] !== arr2[i]) return false
                }
                return true
            }
        } catch (e) {
            console.log('cities')
            console.log(e)
        }
    },
    relationships: async () => {
        try {
            const areas = await AreaController.find({})
            await Promise.all(areas.map(async (area) => {
                const cities = await CityController.find({AreaRef: area.Ref})
                await AreaController.findOneAndUpdate({Ref: area.Ref}, {Cities: cities})
                await Promise.all(cities.map(async (city) => {
                    await CityController.findOneAndUpdate({Ref: city.Ref}, {Area: area})
                }))
            }))
        } catch (e) {
            console.log('relationships')
            console.log(e)
        }
    }
}

apiUpdateService.run = async () => {
    await apiUpdateService.syncData.checker()
}

export {apiUpdateService as default}
