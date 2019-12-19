const express = require('express');
// import OrdersModel from './../../models/orders'
// import SectionsModels from './../../models/sections/index'

const SectionsModel = require('./../../models/sections/index');
const bodyParser = require('body-parser');

const router = express.Router();
const jsonParser = bodyParser.json();
const Sequelize = require('sequelize');
const moment = require('moment');

router.get('/getAll', async (req, res, next) => {
  try {
    const result = await SectionsModel.findAll();
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.put('/update', async (req, res, next) => {
  try {
    const section_id = req.body.section_id;
    const result = await SectionsModel.update(req.body, {
      where: {
        section_id
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
    const result = await SectionsModel.create(req.body);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.delete('/delete/:id', async (req, res, next) => {

  try {
    const section_id = req.params.id;
    const result = await SectionsModel.destroy({
      where: {
        section_id
      }
    });
    res.status(200).json({
      error: false,
      message: 'Setor deletado com sucesso!',
      result
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: 'Setor deletado com sucesso!',
      error
    });
  }
});

// router.get('/get/:idSubCat', async (req, res, next) => {
//   try {
//     const category_id = req.params.idSubCat;

//     SubCategoriesModel.findAll({
//       where: {
//         category_id,
//         status: 1
//       }
//     })
//       .then(data => {
//         return res.status(200).send(data);
//       })
//       .catch(errData => {
//         return res.status(500).send(errData);
//       })
//   } catch (err) {
//     res.logger.log('error', err);
//     return res.status(500).send(err);
//   }
// });



module.exports = router;