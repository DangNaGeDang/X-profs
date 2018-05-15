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

// CREATE //

router.get('/user', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1){
        return res.render('error', {message:"You are not admin"});
    }
    res.render('create_user', {
        roles: req.session.user.roles[0],
        firstname: req.session.user.firstname,
        name: req.session.user.name
    });
});

router.post('/user.post', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1){
        return res.render('error', {message:"You are not admin"});
    }
    console.log(req.body);
    if (req.body.password == req.body.confirm) {

        var user = User({
            roles: [req.body.role],
            name: req.body.name,
            firstname: req.body.firstname,
            login: req.body.login,
            password: req.body.password
        });

        user.save(function (err) {
            if (err) {
                console.log('user error');
                res.render('create_user', {roles:req.session.user.roles[0],
                    firstname: req.session.user.firstname,
                    name: req.session.user.name});
            }
            else {
                console.log('user saved');
                res.redirect('/CRUD');
            }
        });
    } else {
        res.render('create_user');
    }


})
;

router.get('/skill', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1){
        return res.render('error', {message:"You are not admin"});
    }
    res.render('create_skill', {
        roles: req.session.user.roles[0],
        firstname: req.session.user.firstname,
        name: req.session.user.name
    });
});

router.post('/skill.post', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1){
        return res.render('error', {message:"You are not admin"});
    }
    console.log(req.body);
    var skill = Skill(req.body);

    skill.save(function (err) {
        if (err) {
            console.log('skill error');
            res.render('create_skill', {roles:req.session.user.roles[0],
                firstname: req.session.user.firstname,
                name: req.session.user.name});
        }
        else {
            console.log('skill saved');
            res.redirect('/CRUD');
        }
    });
});

router.get('/session', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1){
        return res.render('error', {message:"You are not admin"});
    }
    res.render('create_session', {
        roles: req.session.user.roles[0],
        firstname: req.session.user.firstname,
        name: req.session.user.name
    });
});

router.post('/session.post', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1){
        return res.render('error', {message:"You are not admin"});
    }
    var session = Session(req.body);

    session.save(function (err) {
        if (err) {
            console.log('session error');
            res.render('create_session', {roles:req.session.user.roles[0],
                firstname: req.session.user.firstname,
                name: req.session.user.name});
        }
        else {
            console.log('session saved');
            res.redirect('/CRUD');
        }
    });
});

router.get('/course', async function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1){
        return res.render('error', {message:"You are not admin"});
    }
    var Teachers = await User
        .find({roles: 'teacher'})
        .exec()
    ;

    var Sessions = await Session
        .find({})
        .exec()
    ;

    var Students = await User
        .find({roles: 'student'})
        .exec()
    ;

    var Skills = await Skill
        .find({})
        .exec()
    ;

    res.render('create_course', {
        roles: req.session.user.roles[0],
        firstname: req.session.user.firstname,
        name: req.session.user.name, Teachers: Teachers, Sessions: Sessions, Students: Students, Skills: Skills
    });
});

router.post('/course.post', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1){
        return res.render('error', {message:"You are not admin"});
    }
    console.log(req.body)
    var course = Course(req.body)

    course.save(function (err) {
        if (err) {
            console.log('course error');
            res.render('create_course', {roles:req.session.user.roles[0],
                firstname: req.session.user.firstname,
                name: req.session.user.name});
        }
        else {
            console.log('course saved');
            res.redirect('/CRUD');
        }
    });
});

module.exports = router;
