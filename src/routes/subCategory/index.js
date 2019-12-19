const express = require('express');
const SubCategoriesModel = require('./../../models/subcategorias/subCategory');
const CategoriesModel = require('./../../models/categories');
const bodyParser = require('body-parser');

const router = express.Router();
const jsonParser = bodyParser.json();
const Sequelize = require('sequelize');
const moment = require('moment');

router.get('/getAll', async (req, res, next) => {
  try {
    SubCategoriesModel.belongsTo(CategoriesModel, {
      foreignKey: 'category_id'
    });

    const result = await SubCategoriesModel.findAll(
      {
        include: [
          {
            model: CategoriesModel,
            required: false
          }

        ]
      }
    );
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/get/:idSubCat', async (req, res, next) => {
  try {
    const category_id = req.params.idSubCat;

    SubCategoriesModel.findAll({
      where: {
        category_id,
        status: 1
      }
    })
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(errData => {
        return res.status(500).send(errData);
      })
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.put('/update', async (req, res, next) => {
  try {
    const sub_category_id = req.body.sub_category_id;
    const result = await SubCategoriesModel.update(req.body, {
      where: {
        sub_category_id
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
    const result = await SubCategoriesModel.create(req.body);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    console.log(err);
    return res.status(500).send(err);
  }
});

router.delete('/delete/:id', async (req, res) => {
  
  try {
    const sub_category_id = req.params.id;
    const result = await SubCategoriesModel.destroy({
      where: {
        sub_category_id
      }
    });
    res.status(200).json({
      error: false,
      message: 'Sub-categoria Deletada com Sucesso',
      result
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: 'Sub-categoria Deletada com Sucesso',
      error
    });
  }
});



module.exports = router;