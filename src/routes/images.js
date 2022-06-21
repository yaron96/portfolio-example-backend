const express = require('express')
const router = express.Router()

const Image = require('../models/image-model')

router.get('/images', (req, res) => {
    Image.find({}, 'title url priority', (err, images) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.send({images: images})
        }
    }).sort({_id: -1})
})


router.post('/images', (req, res) => {
    const image = new Image({
        title: req.body.title,
        url: req.body.url,
        priority: req.body.priority
    })

    image.save((err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.send({
                success: true,
                message: `Image with title_${data._id} saved successfully!`
            })
        }
    })
})

module.exports = router