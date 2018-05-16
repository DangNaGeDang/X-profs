/**
 * Created by y.Han on 5/3/18.
 * This page implements score display, including filters, sorting and export functions.
 */
var express = require('express');
var session = require('express-session');
var router = express.Router();
var jsonexport = require('jsonexport');
var xmlbuilder = require('xmlbuilder');

var User = require('../models/userModel');
var Course = require('../models/courseModel');
var Session = require('../models/sessionsModel');
var Skill = require('../models/skillModel');
var Evaluation = require('../models/evalModel');

//Scores display
router.get('/data', async function (req, res) {
    if (!req.session.user) {
        res.redirect('auth');
    }
    //The variables used to implement paging
    var nbPerPage = 30;
    var page = parseInt((req.query.page || '1'));
    var skipnb = nbPerPage * (page - 1);
    var totalRows = 3000;
    //Four collections for rendering filter drop-down menus
    Skill.find().exec(function (err, skills) {
        req.session.allSkills = skills;
    });
    Session.find().exec(function (err, sessions) {
        req.session.allSessions = sessions;
    });
    User.find({roles: ["student"]}).exec(function (err, students) {
        req.session.allStudents = students;
    });
    Course.find().exec(function (err, courses) {
        req.session.allCourses = courses;
    });

    var filters = {};
    var sort = {};
    //Clear filter
    if (req.query.Reset == "1") {
        req.session.studentFilterObject = null;
        req.session.sessionFilterObject = null;
        req.session.skillFilterObject = null;
        req.session.courseFilterObject = null;
        req.session.studentOrder = null;
        req.session.skillOrder = null;
        req.session.sessionOrder = null;
        req.session.courseOrder = null;
        req.session.markOrder = null;
    }
    //Store filter conditions and sorting requirements in session
    //Parameter-passing from sessions to filters must happen after parameter-passing from request to sessions
    if (req.query.studentFilter) {
        var student = await User.findOne({'_id': req.query.studentFilter}).exec();
        req.session.studentFilterObject = student;

    }
    if (req.query.sessionFilter) {
        var session = await Session.findOne({'_id': req.query.sessionFilter}).exec();
        req.session.sessionFilterObject = session;
    }
    if (req.query.skillFilter) {
        var skill = await Skill.findOne({'_id': req.query.skillFilter}).exec();
        req.session.skillFilterObject = skill;
    }
    if (req.query.courseFilter) {
        var course = await Course.findOne({'_id': req.query.courseFilter}).exec();
        req.session.courseFilterObject = course;
    }
    if (req.query.sortBy && req.query.Order) {
        switch (req.query.sortBy) {
            case 'student':
                req.session.studentOrder = req.query.Order;
                break;
            case 'skill':
                req.session.skillOrder = req.query.Order;
                break;
            case 'session':
                req.session.sessionOrder = req.query.Order;
                break;
            case 'course':
                req.session.courseOrder = req.query.Order;
                break;
            case 'mark':
                req.session.markOrder = req.query.Order;
                break;
        }
    }
    if (req.session.studentFilterObject) {
        filters.student = req.session.studentFilterObject._id;
    }
    if (req.session.sessionFilterObject) {
        filters.session = req.session.sessionFilterObject._id
    }
    if (req.session.skillFilterObject) {
        filters.skill = req.session.skillFilterObject._id
    }
    if (req.session.courseFilterObject) {
        filters.course = req.session.courseFilterObject._id
    }
    if (req.session.studentOrder) {
        sort.student = req.session.studentOrder
    }
    if (req.session.skillOrder) {
        sort.skill = req.session.skillOrder
    }
    if (req.session.sessionOrder) {
        sort.session = req.session.sessionOrder
    }
    if (req.session.courseOrder) {
        sort.course = req.session.courseOrder
    }
    if (req.session.markOrder) {
        sort.mark = req.session.markOrder
    }

    if (req.session.user.roles[0] == "student") {
        //Student scores page display
        filters.student = req.session.user._id;
        Evaluation.find(filters).exec(function (err, evals) {
            totalRows = evals.length;
        });
        Evaluation.find(filters)
            .populate({
                path: 'course',
                model: Course
            })
            .populate({
                path: 'session',
                model: Session
            })
            .populate({
                path: 'skill',
                model: Skill
            })
            .sort(sort).limit(nbPerPage).skip(skipnb).exec(function (err, evaluations) {
            req.session.filteredEvaluations = evaluations;
            res.render('data', {
                roles: req.session.user.roles,
                firstname: req.session.user.firstname,
                name: req.session.user.name,
                evaluations: evaluations,
                courses: req.session.allCourses,
                skills: req.session.allSkills,
                sessions: req.session.allSessions,
                pagination: {page: page, limit: nbPerPage, totalRows: totalRows},
                sessionFilterObject: req.session.sessionFilterObject,
                skillFilterObject: req.session.skillFilterObject,
                courseFilterObject: req.session.courseFilterObject,
            });
        });

    } else {
        //Teacher scores page display
        Course.find({teacher: req.session.user._id}).exec(function (err, courses) {
            if (!req.session.courseFilterObject) {
                filters.course = courses
            }
            Evaluation.find(filters).exec(function (err, evals) {
                totalRows = evals.length;
            });

            Evaluation.find(filters)
                .populate({
                    path: 'course',
                    model: Course
                })
                .populate({
                    path: 'session',
                    model: Session
                })
                .populate({
                    path: 'skill',
                    model: Skill
                })
                .populate({
                    path: 'student',
                    model: User
                })
                .sort(sort).limit(nbPerPage).skip(skipnb).exec(function (err, evaluations) {
                req.session.filteredEvaluations = evaluations;
                res.render('data', {

                    roles: req.session.user.roles,
                    firstname: req.session.user.firstname,
                    name: req.session.user.name,
                    evaluations: evaluations,
                    courses: req.session.allCourses,
                    skills: req.session.allSkills,
                    sessions: req.session.allSessions,
                    students: req.session.allStudents,
                    pagination: {page: page, limit: nbPerPage, totalRows: totalRows},
                    //afiichage de choix
                    studentFilterObject: req.session.studentFilterObject,
                    sessionFilterObject: req.session.sessionFilterObject,
                    skillFilterObject: req.session.skillFilterObject,
                    courseFilterObject: req.session.courseFilterObject,
                });

            })
        })
    }

});
//Export implementation
router.post('/data.post', function (req, res) {

    if (!req.session.user) {
        res.redirect('auth');
    }
    var dataToExport = [];
    req.session.filteredEvaluations.forEach(function (eval) {
        var simplifiedEval = {};
        if (req.session.user.roles[0] == 'teacher') {
            simplifiedEval = {
                firstname: eval.student.firstname,
                name: eval.student.name,
                course: eval.course.name,
                skill: eval.skill.name,
                session: eval.session.date,
                mark: eval.mark
            };
        }
        else if (req.session.user.roles[0] == 'student') {
            simplifiedEval = {
                course: eval.course.name,
                skill: eval.skill.name,
                session: eval.session.date,
                mark: eval.mark
            };
        }
        dataToExport.push(simplifiedEval);
    });
    switch (req.body.export_type) {
        case 'CSV':
            jsonexport(dataToExport, function (err, csv) {
                if (err) return console.log(err);
                res.writeHead(200, {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename=FilteredData.csv'
                });
                res.end(csv, "binary");
            });
            break;

        case 'JSON':
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Disposition': 'attachment; filename=FilteredData.json'
            });
            res.end(JSON.stringify(dataToExport), "binary");
            break;

        case 'XML':
            res.writeHead(200, {
                'Content-Type': 'application/XML',
                'Content-Disposition': 'attachment; filename=FilteredData.xml'
            });
            res.end(xmlbuilder.create(dataToExport).end({pretty: true}));
    }

});

module.exports = router;