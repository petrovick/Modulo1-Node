const express = require('express')
const nunjucks = require('nunjucks')
const app = express()

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})

app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'njk')

app.get('/', (req, res) => {
  return res.render('index')
})

app.post('/check', (req, res) => {
  if (req.body.age > 18) {
    return res.redirect('/major?age=' + req.body.age)
  } else {
    return res.redirect('/minor?age=' + req.body.age)
  }
})

const ageMiddleware = (req, res, next) => {
  const { age } = req.query
  return age ? next() : res.redirect('/')
}

app.use(ageMiddleware)

app.get('/minor', ageMiddleware, (req, res) => {
  return res.render('minor', { age: req.query.age })
})

app.get('/major', ageMiddleware, (req, res) => {
  return res.render('major', { age: req.query.age })
})

app.listen(3000)
