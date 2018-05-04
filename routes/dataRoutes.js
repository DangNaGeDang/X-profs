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

    if(req.session.user.roles[0]=="student"){
        Evaluation.find({student:req.session.user._id})
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
            .limit(nbPerPage).exec(function (err,evaluations) {
            res.render('data',{
                roles:req.session.user.roles[0],
                firstname: req.session.user.firstname,
                name: req.session.user.name,
                evaluations:evaluations,
                courses:req.session.allCourses,
                skills:req.session.allSkills,
                sessions:req.session.allSessions
                // pagination:{page:page,limit:nbPerPage,totalRows:30000}
            });
        });

    }else{
        Course.find({teacher:req.session.user._id}).exec(function (err,courses) {
            Evaluation.find({course:courses})
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
                .limit(nbPerPage).exec(function (err,evaluations) {
                res.render('data',{
                    roles:req.session.user.roles[0],
                    firstname: req.session.user.firstname,
                    name: req.session.user.name,
                    evaluations:evaluations,
                    courses:req.session.allCourses,
                    skills:req.session.allSkills,
                    sessions:req.session.allSessions,
                    students:req.session.allStudents
                    // pagination:{page:page,limit:nbPerPage,totalRows:30000}
                });

            })
        })
    }

});
module.exports = router;