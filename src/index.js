const { readFile, readFileSync } = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
	readFile('./src/views/index.html', 'utf8', (err, html) => {
		if (err) {
			response.status(500).send(`An error occured: ${err}`);
		}

		response.send(html);
	});
});

app.get('/contact', (request, response) => {
	readFile('./src/views/contact.html', 'utf8', (err, html) => {
		if (err) {
			response.status(500).send(`An error occured: ${err}`);
		}

		response.send(html);
	});
});

app.post('/contact', (request, response) => {
	const { firstName, lastName, email, message } = request.body;

	console.log(firstName);
	response.redirect('/');
});

app.listen(process.env.PORT || 3000, () => console.log(`App available on port ${process.env.PORT || 3000}`));