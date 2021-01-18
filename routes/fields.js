const router = require('express').Router();
const fieldController = require('../controllers/field.controller');

router.route('/')
	.get(fieldController.searchFields);

module.exports = router;
