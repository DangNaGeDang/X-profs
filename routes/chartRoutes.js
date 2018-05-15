var express = require('express');
var router = express.Router();

var User = require('../models/userModel');
var Course = require('../models/courseModel');
var Session = require('../models/sessionsModel');
var Skill = require('../models/skillModel');
var Evaluation = require('../models/evalModel');

/* Debug info displayed on the console upon each HTTP request, before logger message */
router.all('/*', function (req, res, next) {
    console.log('Next request URL params: ', req.params);
    console.log('Next request URL query: ', req.query);
    console.log('Next request body: ', req.body);
    next();
});


function moyenne(tableau) {
    var n = tableau.length;
    var somme = 0;
    for (i = 0; i < n; i++)
        somme += tableau[i];
    return somme / n;
};

router.get('/charts.html', function (req, res) {

    if (!req.session.user) {
        res.redirect('auth');
    }

    if (req.query.chartFilter) {

        req.session.chartFilter = req.query.chartFilter;

        var filters = {};
        if (req.query.studentFilter) {
            filters.student = req.query.studentFilter
        }
        if (req.session.user.roles[0] == "student") {
            filters.student = req.session.user._id
        }
        if (req.query.sessionFilter) {
            filters.session = req.query.sessionFilter
        }
        if (req.query.skillFilter) {
            filters.skill = req.query.skillFilter
        }
        if (req.query.courseFilter) {
            filters.course = req.query.courseFilter
        }


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
            .exec(function (err, evaluations) {

                if (err) {
                    throw err
                }


                for (var k = 0; k < evaluations.length; k++) {
                    if (filters.skill) {
                        var realSkill = evaluations[k].skill;
                    }
                    if (filters.course) {
                        var realCourse = evaluations[k].course;
                    }
                    if (filters.student) {
                        var realStudent = evaluations[k].student;
                    }
                    if (filters.session) {
                        var realSession = evaluations[k].session;
                    }
                }


                if (req.session.chartFilter == 'radar') {


                    var skillNames = [];
                    for (var k = 0; k < req.session.allSkills.length; k++) {
                        skillNames.push(req.session.allSkills[k].name.replace(/\s/g, "_"));

                    }

                    var realCourse;
                    var moy = [];
                    for (var k = 0; k < req.session.allSkills.length; k++) {

                        var evals = [];
                        for (var e = 0; e < evaluations.length; e++) {

                            realCourse = evaluations[e].course;
                            if (evaluations[e].skill.name == req.session.allSkills[k].name && evaluations[e].mark != -1) {
                                evals.push(evaluations[e].mark);
                            }

                        }
                        moy.push(moyenne(evals));
                    }


                    res.render('charts', {
                        roles: req.session.user.roles,
                        firstname: req.session.user.firstname,
                        name: req.session.user.name,
                        courses: req.session.allCourses,
                        skills: req.session.allSkills,
                        sessions: req.session.allSessions,
                        students: req.session.allStudents,
                        chartFilter: req.session.chartFilter,
                        notes: moy,
                        skillNames: skillNames,
                        realCourse: realCourse,
                        realStudent: realStudent,
                        realSession: realSession
                    });
                }

                else if (req.session.chartFilter == 'moyenne') {


                    var studentNames = [];
                    for (var k = 0; k < req.session.allStudents.length; k++) {
                        studentNames.push(req.session.allStudents[k].name.replace(/\s/g, "_"));

                    }

                    var moy = [];
                    for (var k = 0; k < req.session.allStudents.length; k++) {

                        var evals = [];
                        for (var e = 0; e < evaluations.length; e++) {

                            if (evaluations[e].student._id == req.session.allStudents[k]._id && evaluations[e].mark != -1) {
                                evals.push(evaluations[e].mark);
                            }

                        }
                        moy.push(moyenne(evals));
                    }

                    res.render('charts', {
                        roles: req.session.user.roles,
                        firstname: req.session.user.firstname,
                        name: req.session.user.name,
                        courses: req.session.allCourses,
                        skills: req.session.allSkills,
                        sessions: req.session.allSessions,
                        students: req.session.allStudents,
                        chartFilter: req.session.chartFilter,
                        notes: moy,
                        studentNames: studentNames,
                        realCourse: realCourse,
                        realSkill: realSkill,
                        realSession: realSession
                    });
                }

            });

    }


    else {
        res.render('charts', {
            user: req.session.user,
            roles: req.session.user.roles[0],
            firstname: req.session.user.firstname,
            name: req.session.user.name,
            courses: req.session.allCourses,
            skills: req.session.allSkills,
            sessions: req.session.allSessions,
            students: req.session.allStudents
        });
    }

});


module.exports = router;