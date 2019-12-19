const express = require('express');
const EntryStockModel = require('../../models/stock/entry_stocks')
const ProvidersModel = require('../../models/providers');

const bodyParser = require('body-parser');



const router = express.Router();
const jsonParser = bodyParser.json();
const path = require('path');

router.post('/create', async (req, res, next) => {
    try {
        const result = await EntryStockModel.create(req.body);
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.put('/update', async (req, res, next) => {
    try {
        const entry_stock_id = req.body.entry_stock_id;
        const result = await EntryStockModel.update(req.body, {
            where: {
                entry_stock_id
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
        const entry_stock_id = req.params.id;
        const result = await EntryStockModel.destroy({
            where: {
                entry_stock_id
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
        const result = await EntryStockModel.findAll();
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

        EntryStockModel.belongsTo(ProvidersModel, {
            foreignKey: 'provider_id'
        });


        const result = await EntryStockModel.findAll({
            where: {
                food_id
            },
            include: [{
                model: ProvidersModel,
                required: false, // false: left join, true: inner join,          
            }],
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