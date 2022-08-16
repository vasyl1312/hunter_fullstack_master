const express = require('express')
const controller = require('../controllers/analytics')
const router = express.Router()

router.get('/overwiev', controller.overwiev)
router.get('/analytics', controller.analytics)

module.exports = router
