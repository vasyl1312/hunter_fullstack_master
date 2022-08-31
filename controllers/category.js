const Category = require('../models/Category')
const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async function (req, res) {
  try {
    const categories = await Category.find({ user: req.user.id }) //тільки категорії які відправ користувач
    res.status(200).json(categories)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.getById = async function (req, res) {
  try {
    const category = await Category.findById(req.params.id)
    res.status(200).json(category)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.remove = async function (req, res) {
  try {
    await Category.remove({ _id: req.params.id }) //і видалимо позиції які є в цій категорії
    await Position.remove({ category: req.params.id })
    res.status(200).json({ message: 'Категорія була видалена' })
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.create = async function (req, res) {
  const category = new Category({
    name: req.body.name,
    user: req.user.id,
    imageSrc: req.file ? req.file.path : '', //якщо файл є
  })

  try {
    await category.save()
    res.status(201).json(category) //201 бо створення
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.update = async function (req, res) {
  const updated = { name: req.body.name }

  if (req.file) {
    updated.imageSrc = req.file.path
  }

  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id }, //params бо є в роутах id
      { $set: updated },
      { new: true }
    )
    res.status(200).json(category)
  } catch (e) {
    errorHandler(res, e)
  }
}
