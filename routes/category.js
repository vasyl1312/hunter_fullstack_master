const express = require('express')
const passport = require('passport')
const upload = require('../middleware/upload')
const controller = require('../controllers/category')
const router = express.Router()

router.get('/', passport.authenticate('jwt', { session: false }), controller.getAll)
router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getById)
router.delete('/:id', passport.authenticate('jwt', { session: false }), controller.remove)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }), //захист passport = secure for non user
  upload.single('image'),
  controller.create
) //single що завантажуєм тільки 1 файл, поле image
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  upload.single('image'),
  controller.update
)

module.exports = router
