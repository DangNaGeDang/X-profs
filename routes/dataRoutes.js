var express = require('express');
var session = require('express-session');
var router = express.Router();

var User = require('../models/userModel');
var Course = require('../models/courseModel');
var Session = require('../models/sessionsModel');
var Skill = require('../models/skillModel');
var Evaluation = require('../models/evalModel');


// router.get('/data', function(req,res){
//     if(!req.session.user){
//         res.redirect('auth');
//     }
//     var nbPerPage = 15;
//     var page = parseInt((req.query.page || '1'));
//     var skipnb = nbPerPage * (page - 1);
//     if(req.session.user.roles[0]=="student"){
//         Evaluation.find({student:req.session.user._id}).limit(nbPerPage).skip(skipnb).exec(function (err,evaluations) {
//             res.render('data',{
//                 roles:req.session.user.roles[0],
//                 firstname: req.session.user.firstname,
//                 name: req.session.user.name,
//                 evaluations:evaluations,
//                 pagination:{page:page,limit:nbPerPage,totalRows:30000}
//             });
//         });
//
//     }else{
//         Course.find({teacher:req.session.user._id}).exec(function (err,courses) {
//             Evaluation.find({course:courses}).limit(nbPerPage).skip(skipnb).exec(function (err,evaluations) {
//                 res.render('data',{
//                     roles:req.session.user.roles[0],
//                     firstname: req.session.user.firstname,
//                     name: req.session.user.name,
//                     evaluations:evaluations,
//                     pagination:{page:page,limit:nbPerPage,totalRows:30000}
//                 });
//
//             })
//         })
//     }
//
// });

router.get('/data', function(req,res){
    if(!req.session.user){
        res.redirect('auth');
    }

    var nbPerPage = 30;
    var page = parseInt((req.query.page || '1'));
    var skipnb = nbPerPage * (page - 1);
    var totalRows=3000;
    Skill.find().exec(function (err,skills) {
        req.session.allSkills=skills;
    });
    Session.find().exec(function (err,sessions) {
        req.session.allSessions=sessions;
    });
    User.find({roles:["student"]}).exec(function (err,students) {
        req.session.allStudents=students;
    });
    Course.find().exec(function (err,courses) {
        req.session.allCourses=courses;
    });

    var filters = { };
    var sort={};
    // if(req.query.studentFilter) { filters.student = req.query.studentFilter };
    // if(req.query.sessionFilter) { filters.session = req.query.sessionFilter };
    // if(req.query.skillFilter) { filters.skill = req.query.skillFilter };
    // if(req.query.courseFilter) { filters.course = req.query.courseFilter };
    // if(req.query.sortBy&&req.query.Order) {
    //     if(req.query.sortBy=='student'){sort.student=req.query.Order};
    //     if(req.query.sortBy=='skill'){sort.skill=req.query.Order};
    //     if(req.query.sortBy=='session'){sort.session=req.query.Order};
    //     if(req.query.sortBy=='course'){sort.course=req.query.Order};
    //     if(req.query.sortBy=='mark'){sort.mark=req.query.Order};
    // };
    if(req.query.Reset=="1"){req.session.studentFilter=null;req.session.sessionFilter=null;req.session.skillFilter=null;req.session.courseFilter=null;req.session.studentOrder=null;req.session.skillOrder=null;req.session.sessionOrder=null;req.session.courseOrder=null;req.session.markOrder=null;};
    if(req.query.studentFilter) { req.session.studentFilter = req.query.studentFilter };
    if(req.query.sessionFilter) { req.session.sessionFilter = req.query.sessionFilter };
    if(req.query.skillFilter) { req.session.skillFilter = req.query.skillFilter };
    if(req.query.courseFilter) { req.session.courseFilter = req.query.courseFilter };
    if(req.query.sortBy&&req.query.Order) {
        if(req.query.sortBy=='student'){req.session.studentOrder=req.query.Order};
        if(req.query.sortBy=='skill'){req.session.skillOrder=req.query.Order};
        if(req.query.sortBy=='session'){req.session.sessionOrder=req.query.Order};
        if(req.query.sortBy=='course'){req.session.courseOrder=req.query.Order};
        if(req.query.sortBy=='mark'){req.session.markOrder=req.query.Order};
    };
    if(req.session.studentFilter) { filters.student = req.session.studentFilter };
    if(req.session.sessionFilter) { filters.session = req.session.sessionFilter };
    if(req.session.skillFilter) { filters.skill = req.session.skillFilter};
    if(req.session.courseFilter) { filters.course = req.session.courseFilter };
    if(req.session.studentOrder){sort.student=req.session.studentOrder};
    if(req.session.skillOrder){sort.skill=req.session.skillOrder};
    if(req.session.sessionOrder){sort.session=req.session.sessionOrder};
    if(req.session.courseOrder){sort.course=req.session.courseOrder};
    if(req.session.markOrder){sort.mark=req.session.markOrder};

    if(req.session.user.roles[0]=="student"){
        filters.student=req.session.user._id;
        console.log("filter=",filters);
        Evaluation.find(filters).exec(function (err,evals) {
            totalRows=evals.length;
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
            .sort(sort).limit(nbPerPage).skip(skipnb).exec(function (err,evaluations) {
                res.render('data',{
                    roles:req.session.user.roles[0],
                    firstname: req.session.user.firstname,
                    name: req.session.user.name,
                    evaluations:evaluations,
                    courses:req.session.allCourses,
                    skills:req.session.allSkills,
                    sessions:req.session.allSessions,
                    pagination:{page:page,limit:nbPerPage,totalRows:totalRows}
            });
        });

    }else{

        Course.find({teacher:req.session.user._id}).exec(function (err,courses) {
            if(!req.session.courseFilter){ filters.course = courses};
            Evaluation.find(filters).exec(function (err,evals) {
                totalRows=evals.length;
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
                .sort(sort).limit(nbPerPage).skip(skipnb).exec(function (err,evaluations) {
                    res.render('data',{
                        roles:req.session.user.roles[0],
                        firstname: req.session.user.firstname,
                        name: req.session.user.name,
                        evaluations:evaluations,
                        courses:req.session.allCourses,
                        skills:req.session.allSkills,
                        sessions:req.session.allSessions,
                        students:req.session.allStudents,
                        pagination:{page:page,limit:nbPerPage,totalRows:totalRows}
                });

            })
        })
    }

});
module.exports = router;