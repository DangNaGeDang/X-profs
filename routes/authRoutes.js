/**
 * Created by a.gimonnet on 4/25/18.
 */

var express = require('express');
var session = require('express-session');
var router = express.Router();

var User = require('../models/userModel');

router.get('/auth', function (req, res) {
    res.render('auth');
})

router.post('/auth.post', function (req, res) {
    User.findOne({'login': req.body.login, 'password': req.body.password}, function (err, user) {
        if (err) {
            res.render('auth', {msg: 'Cannot connect to authentification database'});
        }
        if (user) {
            req.session.user = user;
            res.redirect('/data');
        }
        else {
            res.render('auth', {msg: 'Incorrect login or password'});
        }
    });
})

module.exports = router;