import express from 'express'

import AreaController from "../controllers/AreaController.js";
import CityController from "../controllers/CityController.js";


const router = express.Router()

router.get('/delivery/np/areas', async (req, res) => {
	console.log('delivery areas')
	const DbAreas = await AreaController.find()
    const areasDescriptions = []
    for (const area of DbAreas) {
        areasDescriptions.push(area.DescriptionRu)
    }
    res.send(areasDescriptions)
})

router.get('/delivery/np/cities', async (req, res) => {
	console.log(req.query)
    //console.log(req)
	if (JSON.stringify(req.query).localeCompare('{}')) {	
		console.log('no query')
	} else {

	}

    const areaWithCities = await AreaController.getOneWithCities(req.query)
    //console.log(areaWithCities)
    const citiesDescriptions = []
    for (const city of areaWithCities.Cities) {
        citiesDescriptions.push(city.DescriptionRu)
    }
    //console.log(citiesDescriptions)
    res.send(citiesDescriptions)

    //.then((r) => res.send(r))
})

export {router as default}
