const { readFile, readFileSync } = require('fs');
const express = require('express');
const app = express();

app.get('/', (request, response) => {
	readFile('./src/views/index.html', 'utf8', (err, html) => {
		if (err) {
			response.status(500).send(`An error occured: ${err}`);
		}

		response.send(html);
	});
});

app.listen(process.env.PORT || 3000, () => console.log(`App available on port ${process.env.PORT || 3000}`));