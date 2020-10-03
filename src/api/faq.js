const express = require('express')

const router = express.Router();

const monk = require('monk');
const joi = require('joi');
const Joi = require('joi');
const db = monk(process.env.MONGO_URI)
const faqs = db.get('faqs')

const schema = joi.object({
    question: Joi.string().trim().required(),
    answer: Joi.string().trim().required(),
    video_uri: Joi.string().uri()
})
router.get('/', async (req, res, next) => {
    try {
        const items = await faqs.find({});
        res.json(items);

    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const value = await schema.validateAsync(req.body);
        const inserted = await faqs.insert(value)
        res.json(inserted);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const item = await faqs.findOne({
            _id: id
        });
        if (!item) return next();
        res.json(item);

    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const item = await faqs.findOne({
            _id: id
        });
        if (!item) return next();

        const value = await schema.validateAsync(req.body);
        const updated = await faqs.update({
            _id: id
        },{
            $set: value
        })
        res.json(updated);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        await faqs.remove({
            _id: id
        });
        res.json({
            message: "Success"
        });

    } catch (error) {
        next(error);
    }
});
module.exports = router;