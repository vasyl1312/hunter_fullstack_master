const bcrypt = require('bcryptjs')
const User = require('../models/User')

module.exports.login = function (req, res) {
  res.status(200).json({
    //при запиті логіна потрібно відправити емейл і пароль
    login: {
      email: req.body.email,
      password: req.body.password,
    },
  })
}

module.exports.register = async function (req, res) {
  const candidate = await User.findOne({ email: req.body.email }) //check чи вже існує user з таким email
  if (candidate) {
    res.status(409).json({ message: 'Такий email вже існує' }) //409 client error-conflict
  } else {
    const salt = bcrypt.genSaltSync(10) //шифруємо пароль
    const password = req.body.password
    const user = new User({
      email: req.body.email, //створюємо користувача
      password: bcrypt.hashSync(password, salt),
    })
    try {
      await user.save() //зберегти користувача
      res.status(201).json(user) //201-created
    } catch (error) {
      console.log(error) //обробити помилку
    }
  }
}
