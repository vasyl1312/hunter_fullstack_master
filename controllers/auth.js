const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')

module.exports.login = async function (req, res) {
  const candidate = await User.findOne({ email: req.body.email }) //check чи вже існує user з таким email
  if (!candidate) {
    res.status(404).json({ message: 'Такого email немає в базі' }) //404 client error-not found email
  } else {
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password) //перевіряємо пароль
    if (passwordResult) {
      const token = jwt.sign(
        {
          email: candidate.email,
          userId: candidate._id,
        },
        keys.jwt, //секретний ключ в config
        { expiresIn: 60 * 60 } //час життя токена
      ) //генеруємо токен

      res.status(200).json({ token: `Bearer ${token}` })
    } else {
      res.status(401).json({ message: 'Неправильний пароль' }) //401 Unauthorized
    }
  }
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
