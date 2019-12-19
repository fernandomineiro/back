const express = require('express');
const cashFlowOutsModel = require('../../models/cashFlow/cashFlowOuts');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const path = require('path');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
var moment_time_zone = require('moment-timezone');

router.post('/create', async (req, res, next) => {
    try {
        const result = await cashFlowOutsModel.create(req.body);
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.put('/update', async (req, res, next) => {
    try {
        const cash_flow_out_id = req.body.cash_flow_out_id;
        const result = await cashFlowOutsModel.update(req.body, {
            where: {
                cash_flow_out_id
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
        const cash_flow_out_id = req.params.id;
        const result = await cashFlowOutsModel.destroy({
            where: {
                cash_flow_out_id
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
        const result = await cashFlowOutsModel.findAll();
        return res.status(200).send(result);
    } catch (err) {
        console.log(err)
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.post('/out_filtered', async (req, res, next) => {
    try {
        const dateStart = req.body.date_start;
        const dateEnd = req.body.date_end;
        console.log('start', dateStart);
        console.log('end', dateEnd);

        const where = {
            date_create: {
                [Op.between]: [dateStart, dateEnd],
            }
        };


        const result = await cashFlowOutsModel.findAll({
            where,
            logging: console.log
        });

        
        // result.map(
            // row => {
                // var value = moment(row.date_create);
                // var datetime0 = moment(value);
                // // var time = moment.duration("02:00:00");
                // // var datetime1 = moment(value);
                // // datetime1.subtract(time);
                // let dateNew;
                // dateNew = datetime0.format("DD/MM/YYYY HH:mm:SS");
                // console.log('nnn', dateNew);
                // result.nova_data = dateNew;

                // console.log('row.date', row.date_create);
                // console.log('date1', datetime1.format("DD/MM/YYYY HH:mm:SS"));

            // }
        // );

        return res.status(200).send(result);

    } catch (err) {
        console.log(err)
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});





module.exports = router;