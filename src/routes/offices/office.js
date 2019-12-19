const express = require('express');

// const OfficeModel = require('./../../models/foods');
const OfficeModel = require('./../../models/offices/offices');

const bodyParser = require('body-parser');

const uploaderCloud = require('../images/clouduploader');

const router = express.Router();
const jsonParser = bodyParser.json();
const path = require('path');

router.post('/create', async (req, res, next) => {
    try {
        const result = await OfficeModel.create(req.body);
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.put('/update', async (req, res, next) => {
    try {
        const office_id = req.body.office_id;
        const result = await OfficeModel.update(req.body, {
            where: {
                office_id
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
        const office_id = req.params.id;
        const result = await OfficeModel.destroy({
            where: {
                office_id
            }
        });
        res.status(200).json({
            error: false,
            message: 'Cargo deletado com sucesso!',
            result
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: 'Cargo deletado com sucesso!',
            error
        });
    }
});

router.get('/getAll', async (req, res, next) => {
    try {
        const result = await OfficeModel.findAll();
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});


module.exports = router;