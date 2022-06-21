import fetch from 'node-fetch'

const url = 'https://api.novaposhta.ua/v2.0/json/'

const np = {}

np.getAreas = async () => {
    try {
        const response = await fetch(url,
            {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    "apiKey": "799a83d244fca0fd206deac90e65cfff",
                    "modelName": "Address",
                    "calledMethod": "getAreas",
                    "methodProperties": {}
                })
            }).then(res => res.json())
        return response.data
    } catch (e) {
        console.log(e)
    }
}

np.getCities = async () => {
    try {
        const response = await fetch(url,
            {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    "apiKey": "799a83d244fca0fd206deac90e65cfff",
                    "modelName": "Address",
                    "calledMethod": "getCities",
                    "methodProperties": {}
                })
            }).then(res => res.json())
        return response.data
    } catch (e) {
        console.log(e)
    }
}

export {np as default}
