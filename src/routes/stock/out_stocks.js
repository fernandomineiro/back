
const express = require('express');


const OutStocksModel = require ('../../models/stock/out_stocks')

const bodyParser = require('body-parser');



const router = express.Router();
const jsonParser = bodyParser.json();
const path = require('path');

router.post('/create', async (req, res, next) => {
    try {
        const result = await OutStocksModel.create(req.body);
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.put('/update', async (req, res, next) => {
    try {
        const out_stock_id = req.body.out_stock_id;
        const result = await OutStocksModel.update(req.body, {
            where: {
                out_stock_id
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
        const out_stock_id = req.params.id;
        const result = await OutStocksModel.destroy({
            where: {
                out_stock_id
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
        const result = await OutStocksModel.findAll();
        return res.status(200).send(result);
    } catch (err) {
        console.log(err)
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.get('/getByFood/:id', async (req, res, next) => {
    try {
        const food_id = req.params.id;       


        const result = await OutStocksModel.findAll({
            where: {
                food_id
            },
        });
        let total;
        total = result.reduce(function (a, b) {
            return a + b['qtd'];
        }, 0);
        return res.status(200).send({
            error: false,
            data: result,
            total: total
        });
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});


module.exports = router;