const PATH = require('path');
const pug = require('pug');
const express = require('express');
const userRouter = require('./src/routers/post');
const catenews = require('./src/routers/catenews');
const mysql = require('./src/model/connect');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const { request } = require('http');
const multer = require('multer');
// const upload = multer({dest: './uploads'})
// const passport = require('passport');

app.set('views', './src/views'); // Thư mục views nằm cùng cấp với file app.js
app.set('view engine', 'pug'); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
  secret: 'keyboard_cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// app.use(passport.initialize());
// app.use(passport.session());

//load the cookie-parsing middleware
app.use(cookieParser());
// app.use(express.static('uploads'));


app.use('/uploads', express.static('public'))
app.use('/post', userRouter,express.static('public'));
app.use('/', catenews ,express.static('public'));



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})