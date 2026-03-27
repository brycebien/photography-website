require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
	secret: process.env.SESSION_KEY,
	resave: false,
	saveUninitialized: true
}));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const indexRouter = require('./routes/router.js');
// ROUTES
app.use('/', indexRouter);
app.use('/contact', indexRouter);
app.use('/admin', indexRouter);

app.listen(process.env.PORT || 3000, () => console.log(`App available on port ${process.env.PORT || 3000}`));