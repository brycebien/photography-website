require('dotenv').config();
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	projectId: 'photography-website-51c00',
});

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

async function checkAuthStatus(req, res, next) {
    const authHeader = req.headers.authorization;
    req.user = null; // Initialize req.user to null by default

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const idToken = authHeader.split('Bearer ')[1];
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.user = decodedToken; // User is authenticated, attach decoded token
        } catch (error) {
            console.warn('Firebase ID token verification failed:', error.message);
            // If verification fails, req.user remains null.
            // We don't send a response here, just let it proceed to the route handler.
        }
    }
    next(); // Always call next(), regardless of authentication success or failure
}

router.get('/admin', checkAuthStatus, (req, res) => {
	console.log(req.user);
	if (req.user) {
		if (req.user.admin) {
				// res.send(500);
				res.render('admin');
		} else {
				// User is authenticated but not an admin, render sign-in page with a message
				res.render('adminSignIn', { message: 'You are signed in but do not have administrator privileges.' });
		}
	} else {
		// User is not authenticated, render sign-in page
		// Make sure process.env variables are available here (loaded in index.js)

		const clientFirebaseConfig = {
			apiKey: process.env.FIREBASE_API,
			authDomain: process.env.FIREBASE_DOMAIN || "photography-website-51c00.firebaseapp.com",
			projectId: process.env.FIREBASE_PROJ_ID || "photography-website-51c00",
			storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "photography-website-51c00.appspot.com",
			messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "311826914178",
			appId: process.env.FIREBASE_APP_ID,
		};

		res.render('adminSignIn', {
			firebaseConfig: clientFirebaseConfig
		});
	}
});

module.exports = router;