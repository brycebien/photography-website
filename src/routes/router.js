const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	const successMsg = req.flash('success')[0];
    const errorMsg = req.flash('error')[0];
	res.render('index', { 
		message: successMsg || errorMsg || null,
		isSuccess: !!successMsg
	});
});

router.get('/contact', (req, res) => {
	res.render('contact');
});

router.post('/contact', (req, res) => {
	const { firstName, lastName, email, message } = req.body;

	req.flash('success', 'Your message has been sent successfully!')
	res.redirect('/');
});

router.get('/what-i-do', (req, res) => {
	res.render('whatDo');
});

module.exports = router;