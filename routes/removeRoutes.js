/**
 * Created by p.templier on 5/14/18.
 */
var express = require('express');
var session = require('express-session');
var router = express.Router();

var User = require('../models/userModel');
var Course = require('../models/courseModel');
var Session = require('../models/sessionsModel');
var Skill = require('../models/skillModel');
var Evaluation = require('../models/evalModel');


router.get('/course/:r_id', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1) {
        return res.render('error', {message: "You are not admin"});
    }
    var filter = {_id: req.params.r_id};
    Course.remove(filter, function (err) {
        if (err) {
            console.error('Not found', filter);
        }
        res.redirect('/CRUD/course');
    });
});

router.get('/session/:r_id', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1) {
        return res.render('error', {message: "You are not admin"});
    }
    var filter = {_id: req.params.r_id};
    Session.remove(filter, function (err) {
        if (err) {
            console.error('Not found', filter);
        }
        res.redirect('/CRUD/session');
    });
});

router.get('/skill/:r_id', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1) {
        return res.render('error', {message: "You are not admin"});
    }
    var filter = {_id: req.params.r_id};
    Skill.remove(filter, function (err) {
        if (err) {
            console.error('Not found', filter);
        }
        res.redirect('/CRUD/skill');
    });
});

router.get('/user/:r_id', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1) {
        return res.render('error', {message: "You are not admin"});
    }
    var filter = {_id: req.params.r_id};
    User.remove(filter, function (err) {
        if (err) {
            console.error('Not found', filter);
        }
        res.redirect('/CRUD/user');
    });
});

module.exports = router;