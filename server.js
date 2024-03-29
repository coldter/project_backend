'use strict'
// use express async handler errors middleware
require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const env = require('./config/envVariables')

mongoose.connect(
  env.MONGO_DB_CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'students' },
  (err) => {
    if (!err) {
      console.log('Database connected')
    } else {
      console.log(err)
    }
  },
)

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/students', require('./routes/student'))
app.use('/auth', require('./routes/auth'))
app.use('/notif', require('./routes/notif'))

// error handler
app.use((err, req, res, next) => {
  console.log(err)
  res.status(400).json({
    status: false,
    message: 'Something went wrong',
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`))
