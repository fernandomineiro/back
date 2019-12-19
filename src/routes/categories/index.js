const express = require('express');
const CategoriesModel = require('./../../models/categories');
const bodyParser = require('body-parser');

const router = express.Router();
const jsonParser = bodyParser.json();
const Sequelize = require('sequelize');
const moment = require('moment');

router.get('/getAll', async (req, res, next) => {
  try {
    const result = await CategoriesModel.findAll();
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.put('/update', async (req, res, next) => {
  try {
    const category_id = req.body.category_id;
    const result = await CategoriesModel.update(req.body, {
      where: {
        category_id
      }
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    const result = await CategoriesModel.create(req.body);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.delete('/delete/:id', async (req, res, next) => {

  try {
    const category_id = req.params.id;
    const result = await CategoriesModel.destroy({
      where: {
        category_id
      }
    });
    res.status(200).json({
      error: false,
      message: 'Categoria Deletada com Sucesso',
      result
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: 'Categoria Deletada com Sucesso',
      error
    });
  }
});

module.exports = router;