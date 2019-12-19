const express = require('express');

const FoodsModel = require('./../../models/foods');

const uploaderCloud = require('../images/clouduploader');

const router = express.Router();

router.post('/create', async (req, res, next) => {
  try {
    const result = await FoodsModel.create(req.body);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.put('/update', async (req, res, next) => {
  try {
    const id_food = req.body.id_food;
    const result = await FoodsModel.update(req.body, {
      where: {
        id_food
      }
    });


    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/findByCategory/:id', async (req, res, next) => {
  try {
    const category_id = req.params.id;
    const result = await FoodsModel.findAll({
      where: {
        category_id,
        status: 1
      }
    });

    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/findBySubCategory/:id', async (req, res, next) => {
  try {
    const sub_category_id = req.params.id;
    const result = await FoodsModel.findAll({
      where: {
        sub_category_id,
        status: 1
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
    const id_food = req.params.id;
    const result = await FoodsModel.destroy({
      where: {
        id_food
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
    const result = await FoodsModel.findAll({

      order: [
        ['category_id', 'ASC'],
        ['sub_category_id', 'ASC']
      ]

    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.post('/uploadImage', async (req, res) => {

  return uploaderCloud.uploadCloud(req, res, 1);

});

module.exports = router;