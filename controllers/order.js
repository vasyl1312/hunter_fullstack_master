const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

// (get) localhost:5000/api/order?offset=2&limit=5
module.exports.getAll = async function (req, res) {
  const query = {
    user: req.user.id,
  }

  if (req.query.start) {
    query.date = {
      $gte: req.query.start, // $gte > або = в монго
    }
  } // перевірили дату старта додаємо спеціальну умову

  if (req.query.end) {
    if (!query.date) {
      query.date = {}
    }

    query.date['$lte'] = req.query.end // $lte < або = в монго; берем замовлення які <= даті яку вказали
  }

  if (req.query.order) {
    query.order = +req.query.order
  }

  try {
    const orders = await new Order.find(query)
      .sort({ date: -1 }) // сортуємо замовлення по даті
      .skip(+req.query.offset) // скільки пропускаєм; + щоб був формат числа
      .limit(+req.query.limit) // скільки беремо

    res.status(200).json(orders)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.create = async function (req, res) {
  try {
    const lastOrder = await Order.findOne({ user: req.user.id }) //беремо список усіх ордерів які є,
      .sort({ date: -1 }) //відсортовуєм(час по зменшенню тобто 1ший ордер який знайшли = нам і треба)

    const maxOrder = lastOrder ? lastOrder.order : 0 //якщо знайшли то ордер як ні то 0

    const order = await new Order({
      list: req.body.list,
      user: req.user.id,
      order: maxOrder + 1, //ми з фронтенда нз який ордер тому беремо максимальний номер ордер
    }).save()

    res.status(201).json(order)
  } catch (e) {
    errorHandler(res, e)
  }
}
