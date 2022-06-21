import express from 'express'

import Data from '../models/data-model.js'

const router = express.Router()


router.get('/data', (req, res) => {
	console.log('router /data')
	Data.find({}, 'name price about images', (err, data) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.send({data: data})
        }
    }).sort({_id: -1})
})


// router.post('/images', (req, res) => {
//     const image = new Image({
//         title: req.body.title,
//         url: req.body.url,
//         priority: req.body.priority
//     })
//
//     image.save((err, data) => {
//         if (err) {
//             console.log(err)
//         } else {
//             res.send({
//                 success: true,
//                 message: `Image with title_${data._id} saved successfully!`
//             })
//         }
//     })
// })

export {router as default}
