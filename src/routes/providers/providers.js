const express = require('express');

const ProvidersModal = require('./../../models/providers')

const bodyParser = require('body-parser');

const uploaderCloud = require('../images/clouduploader');

const router = express.Router();
const jsonParser = bodyParser.json();
const path = require('path');

router.post('/create', async (req, res, next) => {
    try {
        const result = await ProvidersModal.create(req.body);
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.put('/update', async (req, res, next) => {
    try {
        const provider_id = req.body.provider_id;
        const result = await ProvidersModal.update(req.body, {
            where: {
                provider_id
            }
        });

        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.delete('/delete/:id', async (req, res, next) => {
    try {
        const provider_id = req.params.id;
        const result = await ProvidersModal.destroy({
            where: {
                provider_id
            }
        });
        return res.sendStatus(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.get('/getAll', async (req, res, next) => {
    try {
        const result = await ProvidersModal.findAll();
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});


module.exports = router;