const express = require('express');
const UsersModels = require('./../../models/users/users');
const bodyParser = require('body-parser');
const router = express.Router();
const uploaderCloud = require('../images/clouduploader');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt');
const app = express();


// require for request auth token
const { wrapAsync, auth } = require('../../infra');

//use body parser
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


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
app.use(passport.initialize())
app.use(passport.session())


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
//login user funcinário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (req.body.email == null || req.body.email == '' || req.body.email == undefined) {
    res.json({
      error: true,
      data: 'Favor preencha o email'
    })
  } else if (req.body.password == null || req.body.password == '' || req.body.password == undefined) {
    res.status(401).json({
      error: true,
      data: 'Favor preencha a senha'
    })
  } else {
    if (email && password) {
      let user = await getUser({ email: email });
      if (!user) {
        res.status(401).json({
          error: true,
          data: "O usuario não encontrado"
        });

      } else {
        const match = await bcrypt.compare(password, user.password);
        if (match) {

          let payload = { id: user.id };
          let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '12h' });
          res.set('x-access-token', token);
          res.json({ msg: 'Você esta logado!', token: token, id: user.id, name: user.get('name') });
        } else {
          res.json({
            error: true,
            data: "A senha esta incorreta"
          })
        }
      }
    }
  }
});

router.post('/uploadImage', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  return uploaderCloud.uploadCloud(req, res, 3);
});

router.put('/update', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const id = req.body.id;
    const result = await UsersModels.update(req.body, {
      where: {
        id
      }
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/findPK/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await UsersModels.findByPk(id);
    const user = result.dataValues;

    // const url = req.get('host') + '/apiv1/images/users/';

    // const file = path.join(url, user.img);
    // user.img = file;

    return res.status(200).send(user);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

module.exports = router;