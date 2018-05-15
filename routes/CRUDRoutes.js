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

router.get('/', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1){
        return res.render('error', {message:"You are not admin"});
    }
    res.render('CRUD', {roles:req.session.user.roles,
        firstname: req.session.user.firstname,
        name: req.session.user.name});
});

router.get('/user', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1){
        return res.render('error', {message:"You are not admin"});
    }
    User.find({}).exec(function (err, users) {
        res.render('readUsers', {
            List: users,
            roles:req.session.user.roles[0],
            firstname: req.session.user.firstname,
            name: req.session.user.name
        });
    });
});

router.get('/skill', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1){
        return res.render('error', {message:"You are not admin"});
    }
    Skill.find({}).exec(function (err, skills) {
        res.render('readSkills', {
            List: skills,
            roles:req.session.user.roles[0],
            firstname: req.session.user.firstname,
            name: req.session.user.name
        });
    });
});

router.get('/session', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1){
        return res.render('error', {message:"You are not admin"});
    }
    Session.find({}).exec(function (err, sessions) {
        res.render('readSessions', {
            List: sessions,
            roles:req.session.user.roles[0],
            firstname: req.session.user.firstname,
            name: req.session.user.name
        });
    });
});

router.get('/course', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1){
        return res.render('error', {message:"You are not admin"});
    }
    Course
        .find({})
        .populate({path: 'teacher', model: User})
        .populate({path: 'students', model: User})
        .populate({path: 'skills', model: Skill})
        .populate({path: 'sessions', model: Session})
        .exec(function (err, courses) {
                res.render('readCourses', {
                    List: courses,
                    roles:req.session.user.roles[0],
                    firstname: req.session.user.firstname,
                    name: req.session.user.name
                });
            }
        )
    ;
});

module.exports = router;