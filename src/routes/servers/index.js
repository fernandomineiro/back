const express = require('express');
const ServersModel = require('./../../models/servers');
const SectionsModel = require('./../../models/sections/index');
const OfficeModel = require('./../../models/offices/offices');
const uuidv4 = require('uuid/v4');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt');
const uploaderCloud = require('../images/clouduploader');

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

// rota para obter todos os usuários admin: not implementated
router.route('/findByOfficeAdmin')
  .get(auth, wrapAsync(async (req, res) => {
    return res.json({ status: 200, msg: 'ok' });
  }));

router.get('/findByOffice/:id', async (req, res) => {
  try {
    const id_server = req.params.id;
    const result = await ServersModel.findAll({
      where: {
        id_server
      }
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/getAll', async (req, res, next) => {
  try {
    ServersModel.belongsTo(SectionsModel, {
      foreignKey: 'section_id'
    });

    ServersModel.belongsTo(OfficeModel, {
      foreignKey: 'office_id'
    });

    const result = await ServersModel.findAll(
      {
        include: [
          {
            model: SectionsModel,
            required: false, // false: left join, true: inner join,          
          },
          {
            model: OfficeModel,
            required: false, // false: left join, true: inner join,          
          }
        ],

      }
    );
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.delete('/delete/:id', async (req, res, next) => {
  try {
    const id_server = req.params.id;
    const result = await ServersModel.destroy({
      where: {
        id_server
      }
    });
    return res.sendStatus(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.put('/update', async (req, res) => {
  const userUpdate = req.body;
  let user;
  console.log(userUpdate.changePassword)
  if (userUpdate.changePassword) {
    pass = bcrypt.hashSync(userUpdate.password, 10);
    user = {
      name_server: userUpdate.name_server,
      number_server: userUpdate.number_server,
      status_active: userUpdate.status_active,
      password: pass
    };
  } else {
    user = {
      name_server: userUpdate.name_server,
      number_server: userUpdate.number_server,
      status_active: userUpdate.status_active,
      img_server: userUpdate.img_server
    };
  }

  try {
    const id_server = req.body.id_server;
    const result = await ServersModel.update(user, {
      where: {
        id_server
      }
    });
    return res.status(200).json({
      error: false,
      message: 'Server atualizado com sucesso',
      result
    });
  } catch (err) {
    res.logger.log('error', err);
    res.status(500).json({
      error: true,
      message: 'Erro ao atualizar o server',
      result
    });
  }
});


router.get('/findByServerById/:number/:pass', async (req, res, next) => {
  try {
    const number_server = req.params.number;
    const password = req.params.pass;

    ServersModel.findOne({
      where: {
        number_server,
        password
      },
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

//check user existe bd
const getUser = async obj => {
  return await ServersModel.findOne({
    where: obj,
  });
};
//cadastro de usuario
router.post('/create', (req, res) => {
  const uuid = uuidv4(new Date().getTime().toString());

  if (req.body.name_server == undefined || req.body.name_server == null || req.body.name_server == '') {
    return res.json({
      error: true,
      data: "Favor Preencha o nome",
      nome: true
    })
  }
  else if (req.body.number_server == undefined || req.body.number_server == null || req.body.number_server == '') {
    return res.json({
      error: true,
      data: "Favor Preencha o	number_server",
      email: true
    })
  }
  else if (req.body.status_active == undefined || req.body.status_active == null || req.body.status_active == '') {
    return res.json({
      error: true,
      data: "Favor Preencha o status_active",
      status_active: true
    })
  }
  else if (req.body.password == undefined || req.body.password == null || req.body.password == '') {
    return res.json({
      error: true,
      data: "Favor Preencha a senha",
      password: true
    })
  }
  else if (req.body.password.length < 8) {
    return res.json({
      error: true,
      data: "A senha precisa ter pelo menos 8 digitos",
      password: true
    })
  }
  else {
    ServersModel.findAndCountAll({ where: { number_server: req.body.number_server } }).then(result => {
      if (result.count == 0) {
        let payload = { id: result.rows.id };
        let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '12h' });
        let hash = bcrypt.hashSync(req.body.password, 10);
        const newUser = {
          number_server: req.body.number_server,
          name_server: req.body.name_server,
          status_active: req.body.status_active,
          office_id: req.body.office_id,
          section_id: req.body.section_id,
          password: hash,
          level_access: req.body.level_access,
          img_server: req.body.img_server,
          uuid
        };

        ServersModel.create(newUser).then(user => {
          return res.status(201).json({
            error: false,
            message: 'Cadastro realizado com sucesso',
            id_server: user.get('id_server'),
            name_server: user.get('name_server'),
            token: token
          })
        }).catch(error => res.json({
          error: true,
          data: [],
          error: error
        }))
      } else {
        res.json({
          error: true,
          message: "Usuario ja existe",
          data: []
        })
      }

    })
  }
});


//login user/server/ funcinário
router.post('/login_server', async (req, res) => {
  const { number_server, password } = req.body;

  if (req.body.number_server == null || req.body.number_server == '' || req.body.number_server == undefined) {
    res.json({
      error: true,
      data: 'Favor preencha o number_server'
    })
  } else if (req.body.password == null || req.body.password == '' || req.body.password == undefined) {
    res.status(401).json({
      error: true,
      data: 'Favor preencha a senha'
    })
  } else {
    if (number_server && password) {
      let user = await getUser({ number_server: number_server });
      if (!user) {
        res.status(401).json({
          error: true,
          data: "O usuario não encontrado"
        });

      } else {
        const match = await bcrypt.compare(password, user.password);
        if (match) {

          let payload = { id_server: user.id_server };
          let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '12h' });
          res.set('x-access-token', token);
          res.json({ msg: 'Você esta logado!', token: token, id_server: user.id_server, name: user.get('name_server'), user });
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

router.post('/uploadImage', async (req, res) => {

  return uploaderCloud.uploadCloud(req, res, 4);
});

// checa se matrícula existe para funçao de cadastro de usuários
router.get('/matriculaexists/:id', async (req, res) => {
  ServersModel.findAll({ where: { number_server: req.params.id } }).then(result => {
    if (result.length > 0) {
      return res.json({ error: true, message: `A matrícula ${req.params.id} já foi cadastrada no sistema` });
    } else {
      return res.json({ error: false, message: `A matrícula ${req.params.id} está disponível no sistema` });
    }
  });
});


function validaUsuario(usuario) {

  ServersModel.findAll({ where: { number_server: usuario.number_server } }).then(result => {
    if (result.length > 0) {
      throw new Error(`A matrícula ${usuario.number_server} já foi cadastrada no sistema`)
    }
  });
}

module.exports = router;