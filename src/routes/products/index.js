const express = require('express');
const ProductsModel = require('./../../models/products/products');
const UsersModels = require('./../../models/users/users');
const uploaderCloud = require('../images/clouduploader');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');

const app = express();




//function check carateres especiais
var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
var checkForSpecialChar = function (string) {
  for (i = 0; i < specialChars.length; i++) {
    if (string.indexOf(specialChars[i]) > -1) {
      return true
    }
  }
  return false;
}
//passport
app.use(passport.initialize());
app.use(passport.session());

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// todo: criar um lugar para salvar a palavra chave do token
jwtOptions.secretOrKey = 'token_api_backend_$20'
// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  //console.log('payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id });

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

// use the strategy
passport.use(strategy);

//cors habilitada
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//check if exist user database
const getUser = async obj => {
  return await UsersModels.findOne({
    where: obj,
  });
};

const router = express.Router();
// const jsonParser = bodyParser.json();
// const Sequelize = require('sequelize');
//const moment = require('moment');


router.post('/create', async (req, res, next) => {
  try {
    const result = await ProductsModel.create(req.body);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.put('/update', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const command_order_table = req.body.command_order_table;
    const result = await ProductsModel.update(req.body, {
      where: {
        command_order_table
      }
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/getAll', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const result = await ProductsModel.findAll();
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

// mais vendido
router.get('/best_sellers', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const result = await ProductsModel.findAll({ where: { product_best_sellers: 1 } });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

// produtos em promoção
router.get('/sellers', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const result = await ProductsModel.findAll({ where: { product_saller: 1 } });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});
//seleciona produto por id
router.get('/:id', passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const result = await ProductsModel.findByPk(req.params.id);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});
//upload imagem de produto
router.post('/uploadImage', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  return uploaderCloud.uploadCloud(req, res, 2);
});

module.exports = router;