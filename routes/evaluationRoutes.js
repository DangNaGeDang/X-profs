/**
 * Created by a.gimonnet on 4/26/18.
 */

var express = require('express');
var session = require('express-session');
var router = express.Router();

var User = require('../models/userModel');
var Course = require('../models/courseModel');
var Session = require('../models/sessionsModel');
var Skill = require('../models/skillModel');
var Evaluation = require('../models/evalModel');
var async = require('async');

router.get('/evaluation.html', function(req,res){
    if((!req.session.user)||(req.session.user.roles[0]=="student")){
        res.redirect('auth');
    }
    // else if(req.session.user.roles[0]=='student'){
    //     res.redirect('data',{msg: 'no permission'});
    // }
    else{
        Course.find({teacher: req.session.user})
            .populate({
                path: 'students',
                model: User
            })
            .populate({
                path: 'sessions',
                model: Session
            })
            .populate({
                path: 'skills',
                model: Skill
            })
            .exec(function(err, courses){
                if(err){
                    console.log('Failed to connect to database');
                }
                else {
                    var selectedCourse = courses.filter(function (course) {
                        return course._id.equals(req.query.course_id);
                    })[0];
                    if (!selectedCourse) {
                        res.render('evaluation', {
                            roles: req.session.user.roles[0],
                            firstname: req.session.user.firstname,
                            name: req.session.user.name,
                            courses: courses
                        });
                    }
                    else{
                        req.session.course_id = selectedCourse._id;
                        if(req.query.session_id && req.query.student_id){
                            req.session.session_id = req.query.session_id;
                            req.session.student_id = req.query.student_id;
                            Evaluation.find({session: req.query.session_id, student: req.query.student_id, skill: selectedCourse.skills})
                                .exec(function(err, evals){
                                    if(err){
                                        console.log('Failed to connect to database');
                                    }
                                    else{
                                        selectedCourse.skills.forEach(function(skill){
                                            if(evals.filter(ev => (ev.skill.equals(skill))).length == 0){
                                                var eval = new Evaluation({
                                                    mark: -1,
                                                    session: req.query.session_id,
                                                    student: req.query.student_id,
                                                    course: selectedCourse._id,
                                                    skill: skill
                                                });
                                                eval.save();
                                            };
                                        })
                                    }
                                });
                            Evaluation.find({session: req.query.session_id, student: req.query.student_id, skill: selectedCourse.skills})
                                .populate({
                                    path: 'skill',
                                    model: Skill
                                })
                                .exec(function(err, evals) {
                                    if (err) {
                                        console.log('Failed to connect to database');
                                    }
                                    else {
                                        req.session.evals = evals;
                                        res.render('evaluation', {
                                            roles: req.session.user.roles[0],
                                            firstname: req.session.user.firstname,
                                            name: req.session.user.name,
                                            courses: courses,
                                            courseId: selectedCourse._id,
                                            sessionId: req.query.session_id,
                                            sessions: selectedCourse.sessions,
                                            students: selectedCourse.students,
                                            evaluations: evals
                                        });
                                    }
                                });

                        }
                        else {

                            res.render('evaluation', {
                                roles: req.session.user.roles[0],
                                firstname: req.session.user.firstname,
                                name: req.session.user.name,
                                courses: courses,
                                courseId: selectedCourse._id,
                                sessionId: req.query.session_id,
                                sessions: selectedCourse.sessions,
                                students: selectedCourse.students
                            });
                        }
                    }
                }
        });
    }
})

router.post('/evaluation.post', function(req, res){
    for(var i = 0; i < req.session.evals.length; i++){
        console.log(req.session.evals[i].skill.name);
        Evaluation.update({session: req.session.session_id, student: req.session.student_id, skill: req.session.evals[i].skill._id}, {mark: req.body[req.session.evals[i].skill.name]},{multi: false}, function(err, doc){
            if(err){
                console.log('Dayum son where dyou fin this?');
            }
        })
    }
    res.redirect("/evaluation.html?course_id="+req.session.course_id+"&session_id="+req.session.session_id+"&student_id="+req.session.student_id);
})

router.get('/signout', function(req, res) {
    req.session.destroy();
    res.redirect("/auth");
});

module.exports = router;