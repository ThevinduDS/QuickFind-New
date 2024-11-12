// AddService.routes.js
const express = require('express');
const router = express.Router();
const { createService } = require('../controllers/AddService.controller');
const { uploadImages } = require('../middleware/upload');

router.post('/services', uploadImages.array('images', 5), createService);

module.exports = router;


