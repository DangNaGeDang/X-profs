/**
 * This page implements graph display, including filters functions.
 */

var express = require('express');
var router = express.Router();

var User = require('../models/userModel');
var Course = require('../models/courseModel');
var Session = require('../models/sessionsModel');
var Skill = require('../models/skillModel');
var Evaluation = require('../models/evalModel');

/* Debug info displayed on the console upon each HTTP request, before logger message */
router.all('/*', function(req, res, next) {
    console.log('Next request URL params: ', req.params);
    console.log('Next request URL query: ', req.query);
    console.log('Next request body: ', req.body);
    next();
});

/* Création d'une fonction qui retourne la moyenne du tableau passé en argument*/
function moyenne(tableau)
{
    var n = tableau.length;
    var somme = 0;
    for(i=0; i<n; i++)
        somme += tableau[i];
    return somme/n;
};

router.get('/charts.html', function(req,res) {

    if(!req.session.user){        // Pour s'assurer qu'un utilisateur s'est bien authentifié
        res.redirect('auth');
    }

    if (req.query.chartFilter) {  // Choix du type de graphe par l'utilisateur

        req.session.chartFilter = req.query.chartFilter;

        var filters = { };        // Formation d'un filtre en fonction des souhaits de l'utilisateur avec les boutons à sa disposition
        if(req.query.studentFilter) { filters.student = req.query.studentFilter };
        if(req.session.user.roles[0]=="student") {filters.student = req.session.user._id};
        if(req.query.sessionFilter) { filters.session = req.query.sessionFilter };
        if(req.query.skillFilter) { filters.skill = req.query.skillFilter };
        if(req.query.courseFilter) { filters.course = req.query.courseFilter};



        Evaluation.find(filters)   // Recherche de toutes les évaluations qui correpondent au filtre établi par l'utilisateur
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
            .exec(function (err,evaluations) {

                if(err) {throw err};


                  // Récupération des données associées aux évaluations choisies
                if (filters.skill) {var realSkill = evaluations[0].skill;};
                if (filters.course) {var realCourse = evaluations[0].course;};
                if (filters.student) {var realStudent = evaluations[0].student;};
                if (filters.session) {var realSession = evaluations[0].session;};


                  // Si le type de graphe choisi est radar
                if (req.session.chartFilter == 'radar') {

                    // Récuperation des noms des compétences
                    var skillNames = [];
                    for (var k =0; k < req.session.allSkills.length; k++) {
                        skillNames.push(req.session.allSkills[k].name.replace(/\s/g,"_"));

                    };


                    // Création de la liste des moyennes à afficher par compétence
                    var moy = [];
                    for (var k =0; k < req.session.allSkills.length; k++) {

                        var evals = [];
                        for (var e = 0; e < evaluations.length; e++) {

                            realCourse = evaluations[e].course;
                            // Répartition des notes par compétence
                            if (evaluations[e].skill.name == req.session.allSkills[k].name && evaluations[e].mark != -1) {
                                evals.push(evaluations[e].mark);
                            };

                        };
                        moy.push(moyenne(evals));
                    }


                    res.render('charts', {

                        // On rend les éléments nécessaires à l'affichage du menu
                        roles:req.session.user.roles,
                        firstname: req.session.user.firstname,
                        name: req.session.user.name,
                        courses:req.session.allCourses,
                        skills:req.session.allSkills,
                        sessions:req.session.allSessions,
                        students:req.session.allStudents,

                        // Elements propres à l'affichage des graphes
                        chartFilter : req.session.chartFilter,
                        notes : moy,
                        skillNames : skillNames,
                        realCourse : realCourse,
                        realStudent : realStudent,
                        realSession : realSession
                    });
                }

                // Si le type de graphe choisi est moyenne
                else if (req.session.chartFilter == 'moyenne'){

                    // Récuperation des noms des élèves
                    var studentNames = [];
                    for (var k =0; k < req.session.allStudents.length; k++) {
                        studentNames.push(req.session.allStudents[k].name.replace(/\s/g,"_"));

                    };

                    // Création de la liste des moyennes à afficher par élève
                    var moy = [];
                    for (var k =0; k < req.session.allStudents.length; k++) {

                        var evals = [];
                        for (var e = 0; e < evaluations.length; e++) {

                            // Répartition des notes par élèves
                            if (evaluations[e].student._id == req.session.allStudents[k]._id && evaluations[e].mark != -1) {
                                evals.push(evaluations[e].mark);
                            };

                        };
                        moy.push(moyenne(evals));
                    }

                    res.render('charts', {
                        roles:req.session.user.roles,
                        firstname: req.session.user.firstname,
                        name: req.session.user.name,
                        courses:req.session.allCourses,
                        skills:req.session.allSkills,
                        sessions:req.session.allSessions,
                        students:req.session.allStudents,
                        chartFilter : req.session.chartFilter,
                        notes : moy,
                        studentNames : studentNames,
                        realCourse : realCourse,
                        realSkill : realSkill,
                        realSession : realSession
                    });
                }

            });

    }


    else {
        res.render('charts', {
            user : req.session.user,
            roles:req.session.user.roles[0],
            firstname: req.session.user.firstname,
            name: req.session.user.name,
            courses:req.session.allCourses,
            skills:req.session.allSkills,
            sessions:req.session.allSessions,
            students:req.session.allStudents
        });
    }

});


module.exports = router;