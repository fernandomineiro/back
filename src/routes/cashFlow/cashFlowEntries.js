const express = require('express');
const cashFlowEntriesModel = require('../../models/cashFlow/cashFlowEntries');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const path = require('path');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

router.post('/create', async (req, res, next) => {
    try {
        const result = await cashFlowEntriesModel.create(req.body);
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.put('/update', async (req, res, next) => {
    try {
        const cash_flow_entry_id = req.body.cash_flow_entry_id;
        const result = await cashFlowEntriesModel.update(req.body, {
            where: {
                cash_flow_entry_id
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
        const cash_flow_entry_id = req.params.id;
        const result = await cashFlowEntriesModel.destroy({
            where: {
                cash_flow_entry_id
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
        const result = await cashFlowEntriesModel.findAll();
        return res.status(200).send(result);
    } catch (err) {
        console.log(err)
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.post('/entry_filtered', async (req, res, next) => {
    try {
        const dateStart = req.body.date_start;
        const dateEnd = req.body.date_end;
        console.log('data start->', dateStart);
        console.log('data end ->', dateEnd);

        const where = {
            date_create: {
                [Op.between]: [dateStart, dateEnd],
            }
        };

        const result = await cashFlowEntriesModel.findAll({
            where,
            logging: console.log
        });


        return res.status(200).send(result);

    } catch (err) {
        console.log(err)
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

module.exports = router;