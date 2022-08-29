const multer = require('multer')
const moment = require('moment')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/') //null що нема помилок, папка куди загружаєм
  },
  filename(req, file, cb) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS') // тут формуємо дату завантаження(SSS-мілісекунд)
    cb(null, `${date}-${file.originalname}`) // , створюємо назву файлу щоб всі ОС сприймали
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true) //якщо файл картинка то працюємо з ним
  } else {
    cb(null, false)
  }
} //фільтруємо файли

const limits = {
  fileSize: 1024 * 1024 * 5,
} //max розмір картинок

module.exports = multer({ storage, fileFilter, limits })
