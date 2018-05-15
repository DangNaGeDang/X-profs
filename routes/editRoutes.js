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
var Handlebars = require("hbs");


router.get('/course/:r_id', async function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1) {
        return res.render('error', {message: "You are not admin"});
    }
    console.log(req.params.r_id)

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



    var filter = {_id: req.params.r_id};

    Course.find(filter).limit(1).exec(function (err, course) {
        if (err) {
            console.error('Not found', filter);
        }
        console.log('cours : ');
        console.log(course[0]);
        res.render('edit_course', {
            course: course[0],
            Teachers: Teachers,
            Sessions: Sessions,
            Students: Students,
            Skills: Skills, roles: req.session.user.roles[0],
            firstname: req.session.user.firstname,
            name: req.session.user.name
        });
    });
});

router.post('/course.post/:r_id', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1) {
        return res.render('error', {message: "You are not admin"});
    }
    console.log('COURSE POSTED');
    console.log(req.params.r_id);
    var filter = {_id: req.params.r_id};
    Course.findByIdAndUpdate(
        req.params.r_id,
        req.body,
        (err, todo) => {
            if (err) return res.status(500).send(err);
            return res.redirect('/CRUD/course');
        }
    )
});

router.get('/user/:r_id', async function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1) {
        return res.render('error', {message: "You are not admin"});
    }
    var filter = {_id: req.params.r_id};

    User.find(filter).limit(1).exec(function (err, usr) {
        if (err) {
            console.error('Not found', filter);
        }
        console.log('user : ');
        console.log(usr[0]);
        res.render('edit_user', {
            user: usr[0], roles: req.session.user.roles[0],
            firstname: req.session.user.firstname,
            name: req.session.user.name
        });
    });
});

router.post('/user.post/:r_id', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1) {
        return res.render('error', {message: "You are not admin"});
    }
    console.log("Edit user");
    console.log(req.body);
    User.find({_id: req.params.r_id}).limit(1)
        .exec(function (err, usr) {
            if (err) {
                console.error('Not found', filter);
            }

            if (req.body.new == '') {
                User.findByIdAndUpdate(
                    req.params.r_id,
                    {
                        roles: req.body.role,
                        name: req.body.name,
                        firstname: req.body.firstname,
                        login: req.body.login,
                        password: usr[0].password
                    },
                    (err, todo) => {
                        if (err) return res.status(500).send(err);
                        return res.redirect('/CRUD/user');
                    }
                )
            } else {
                if (req.body.new == req.body.confirm) {

                    if (req.body.password == usr[0].password) {
                        User.findByIdAndUpdate(
                            req.params.r_id,
                            {
                                roles: req.body.role,
                                name: req.body.name,
                                firstname: req.body.firstname,
                                login: req.body.login,
                                password: req.body.new
                            },
                            (err, todo) => {
                                if (err) return res.status(500).send(err);
                                return res.redirect('/CRUD/user');
                            }
                        )
                    } else {
                        res.render('edit_user', {
                            user: usr[0],
                            Message: "Wrong password", roles: req.session.user.roles[0],
                            firstname: req.session.user.firstname,
                            name: req.session.user.name
                        });
                    }


                } else {
                    res.render('edit_user', {
                        user: usr[0],
                        Message: "The two instances of the new password are different",
                        roles: req.session.user.roles[0],
                        firstname: req.session.user.firstname,
                        name: req.session.user.name
                    });
                }

            }
        });
});

router.get('/session/:r_id', async function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1) {
        return res.render('error', {message: "You are not admin"});
    }
    console.log(req.params.r_id);
    var filter = {_id: req.params.r_id};

    Session.find(filter).limit(1).exec(function (err, session) {
        if (err) {
            console.error('Not found', filter);
        }
        console.log('session : ');
        console.log(session[0]);
        res.render('edit_session', {
            session: session[0], roles: req.session.user.roles[0],
            firstname: req.session.user.firstname,
            name: req.session.user.name
        });
    });
});


router.post('/session.post/:r_id', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1) {
        return res.render('error', {message: "You are not admin"});
    }
    console.log('SESSION POSTED');
    console.log(req.params.r_id);
    var filter = {_id: req.params.r_id};
    Session.findByIdAndUpdate(
        req.params.r_id,
        req.body,
        (err, todo) => {
            if (err) return res.status(500).send(err);
            return res.redirect('/CRUD/session');
        }
    )
});

router.get('/skill/:r_id', async function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1) {
        return res.render('error', {message: "You are not admin"});
    }
    console.log(req.params.r_id)
    var filter = {_id: req.params.r_id};

    Skill.find(filter).limit(1).exec(function (err, skill) {
        if (err) {
            console.error('Not found', filter);
        }
        console.log('skill : ');
        console.log(skill[0]);
        res.render('edit_skill', {
            skill: skill[0], roles: req.session.user.roles[0],
            firstname: req.session.user.firstname,
            name: req.session.user.name
        });
    });
});


router.post('/skill.post/:r_id', function (req, res) {
    if (req.session.user.roles.indexOf('admin') == -1) {
        return res.render('error', {message: "You are not admin"});
    }
    console.log('SKILL POSTED');
    console.log(req.params.r_id);
    var filter = {_id: req.params.r_id};
    Skill.findByIdAndUpdate(
        req.params.r_id,
        req.body,
        (err, todo) => {
            if (err) return res.status(500).send(err);
            return res.redirect('/CRUD/skill');
        }
    )
});


module.exports = router;