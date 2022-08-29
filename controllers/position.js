const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

module.exports.getByCategoryId = async function (req, res) {
  try {
    const positions = await Position.find({ category: req.params.categoryId, user: req.user.id })

    res.status(200).json({ positions })
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.create = async function (req, res) {
  try {
    const position = await new Position({
      category: req.body.category,
      name: req.body.name,
      cost: req.body.cost,
      user: req.user.id,
    }).save() //створюємо і зберігаємо позицію
    res.status(201).json(position)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.remove = async function (req, res) {
  try {
    await Position.remove({ _id: req.params.id })
    res.status(200).json({ message: 'Позиція була видалена' })
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.update = async function (req, res) {
  try {
    const position = await Position.findOneAndUpdate(
      { _id: req.params.id }, //знайшли дані,
      { $set: req.body }, // їх треба оновити
      { new: true } // повертаємо оновлення
    )

    res.status(200).json(position)
  } catch (e) {
    errorHandler(res, e)
  }
}
