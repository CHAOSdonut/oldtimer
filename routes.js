const express = require('express')
const router = express.Router()
const login = require('./login.json')
const db = require('./db.js');

router.get('/', function (req, res) {
  res.render('pages/index');
})

router.get('/login', function (req, res) {
  res.render('pages/login')
})

router.get('/dashboard', function (req, res) {
if (req.session.loggedin) {
		res.render('pages/dashboard/dashboard');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
})

router.post('/auth', function(req, res) {
	const username = req.body.username;
	const password = req.body.password;
	if (username != '' && password != '') {
		if (username == login.name && password == login.pw) {
			req.session.loggedin = true;
			req.session.username = username;
			res.redirect('/dashboard');
		} else {
			res.send('Incorrect Username and/or Password!');
		}
		res.end();
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

router.get('/dashboard/patienten', function(req, res) {
if (req.session.loggedin) {
        db.getAllPatients().then((data) => {
            res.render('pages/dashboard/klanten', {data: data});
        });
     }
     else{
        res.send('Please login to view this page!');
        res.end();
     }
});

router.get('/dashboard/patient/:id', function(req, res) {
    if (req.session.loggedin) {
        db.getPatientById(req.params.id).then((data) => {
            res.render('pages/dashboard/klant', {data: data});
        });
    }
    else{
        res.send('Please login to view this page!');
        res.end();
    }
});

router.get('/dashboard/horloges', function(req, res) {
    if (req.session.loggedin) {
        db.getAllWatches().then((data) => {
            res.render('pages/dashboard/horloges', {data: data});
        });
    }
    else{
        res.send('Please login to view this page!');
        res.end();
    }
});

router.post('/api' , function(req, res){
    db.saveLocationReqeust(req.body).then(console.log("data saved"))
    .catch(e => console.log(e));
    console.log(req.body);
});

module.exports = router