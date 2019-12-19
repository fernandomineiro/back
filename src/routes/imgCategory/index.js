const express = require('express');

const imgCategory = require('./../../models/imgCategory/index');

//const bodyParser = require('body-parser');



const router = express.Router();
//const jsonParser = bodyParser.json();
//const path = require('path');

router.get('/getAll', async (req, res, next) => {
    try {
        const result = await imgCategory.findAll();
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

module.exports = router;