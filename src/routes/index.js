const express = require('express');
const tableRooms = require('./tableRooms');
const users = require('./users');
const categories = require('./categories');
const SubCategory = require('./subCategory');
const foods = require('./foods');
const orders = require('./orders');
const servers = require('./servers');
const sections = require('./sections/sections');
const chat = require('./chat/chat');
const bills = require('./bills/bills');
const images = require('./images/index');
const offices = require('./offices/office');
const imgCategory = require('./imgCategory/index');
const log = require('./logger/index');
const providers = require('./providers/providers');
const stock = require('./stock/stocks');
const entryStock = require('./stock/entry_stocks');
const outStock = require('./stock/out_stocks');
const cashFlowEntries = require('./cashFlow/cashFlowEntries');
const cashFlowOuts = require('./cashFlow/cashFlowOuts');
const products = require('./products')

const router = express.Router();

router.use('/tableRooms', tableRooms);
router.use('/users', users);
router.use('/categories', categories);
router.use('/foods', foods);
router.use('/orders', orders);
router.use('/servers', servers);
router.use('/SubCategory', SubCategory);
router.use('/sections', sections);
router.use('/chat', chat);
router.use('/bills', bills);
router.use('/images', images);
router.use('/offices', offices);
router.use('/imgCategory', imgCategory);
router.use('/logs', log);
router.use('/providers', providers);
router.use('/stock', stock);
router.use('/entry_stock', entryStock);
router.use('/out_stock', outStock);
router.use('/cash_flow_entries', cashFlowEntries);
router.use('/cash_flow_outs', cashFlowOuts);
router.use('/products', products);


module.exports = router;