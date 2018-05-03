var express = require('express');
var session = require('express-session');
var router = express.Router();

var User = require('../models/userModel');
var Course = require('../models/courseModel');
var Session = require('../models/sessionsModel');
var Skill = require('../models/skillModel');
var Evaluation = require('../models/evalModel');


router.get('/data', function(req,res){
    if(!req.session.user){
        res.redirect('auth');
    }
    res.render('data');
});


module.exports = router;