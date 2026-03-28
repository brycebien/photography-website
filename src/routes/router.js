const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const serviceAccount = require("../serviceAccountKey.json");
const bcrypt = require('bcrypt');

if (!getAuth.app) {
	initializeApp({
		credential: cert(serviceAccount)
	});
}

const auth = getAuth();
const db = getFirestore();

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

router.get('/admin/signUp', (req, res) => {
	res.render('admin/adminSignUp');
});

router.get('/admin', (req, res) => {
	if (req.session.userId) {
		res.redirect('/admin/dashboard');
	} else {
		const successMsg = req.flash('success')[0];
		const errorMsg = req.flash('error')[0];
		res.render('admin/adminSignIn', {
			message: successMsg || errorMsg || null,
			isSuccess: !!successMsg
		});
	}
});

router.post('/admin/signUp', async (req, res) => {
	const { email, password } = req.body;
	try {
		const userRecord = await auth.createUser({
			email: email,
			password: password
		});
		const hashedPassword = await bcrypt.hash(password, 10);
		await db.collection('users').doc(userRecord.uid).set({
			email: email,
			passwordHash: hashedPassword
		});
		req.flash('success', 'Admin account created successfully! Please sign in.');
		res.redirect('/admin');
	} catch (error) {
		req.flash('error', 'Error creating admin account: ' + error.message);
		res.redirect('/');
	}
});

router.post('/admin/signIn', async (req, res) => {
	const { email, password } = req.body;
	try {
		const userRecord = await auth.getUserByEmail(email);
		const userDoc = await db.collection('users').doc(userRecord.uid).get();
		if (!userDoc.exists) {
			req.flash('error', 'User not found.');
			res.redirect('/admin');
		}
		const userData = userDoc.data();
		const isMatch = await bcrypt.compare(password, userData.passwordHash);
		if (!isMatch) {
			return res.render('admin/adminSignIn', {
				message: 'Invalid email or password.',
				isSuccess: false,
			});
		}
		req.session.userId = userRecord.uid;
		req.flash('success', 'Admin signed in successfully!');
		res.redirect('/admin/dashboard');
	} catch (error) {
		req.flash('error', 'An unexpected error occurred: ' + error.message);
		const errorMsg = req.flash('error')[0];
		res.render('admin/adminSignIn', {
			message: errorMsg,
			isSuccess: false,
		});
	}
});

router.get('/admin/dashboard', (req, res) => {
	if (!req.session.userId) {
		req.flash('error', 'Please sign in to access the admin dashboard.');
		res.redirect('/admin');
	} else {
		res.render('admin/dashboard');
	}
});

module.exports = router;