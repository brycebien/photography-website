const { readFile, readFileSync } = require('fs');
const indexRouter = require('./routes/router.js');
const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
	secret: 'secret-key',
	resave: false,
	saveUninitialized: true
}));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// ROUTES
app.use('/', indexRouter);
app.use('/contact', indexRouter);

// app.get('/', (request, response) => {
// 	readFile('./src/views/index.html', 'utf8', (err, html) => {
// 		if (err) {
// 			response.status(500).send(`An error occured: ${err}`);
// 		}

// 		response.send(html);
// 	});
// });

// app.get('/contact', (request, response) => {
// 	readFile('./src/views/contact.html', 'utf8', (err, html) => {
// 		if (err) {
// 			response.status(500).send(`An error occured: ${err}`);
// 		}

// 		response.send(html);
// 	});
// });

// app.post('/contact', (request, response) => {
// 	const { firstName, lastName, email, message } = request.body;

// 	console.log(firstName);
// 	response.redirect('/');
// });

app.listen(process.env.PORT || 3000, () => console.log(`App available on port ${process.env.PORT || 3000}`));