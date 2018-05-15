var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var helpers = require('handlebars-helpers')();
var expresshbs = require('express-handlebars');
var Handlebars = require('handlebars')

var indexRouter = require('./routes/index');
var authRouter = require('./routes/authRoutes');
var evalRouter = require('./routes/evaluationRoutes');
var dataRouter = require('./routes/dataRoutes');
var chartRouter = require('./routes/chartRoutes');
var createRouter = require('../XProfGroupe/routes/createRoutes');
var removeRouter = require('../XProfGroupe/routes/removeRoutes');
var editRouter = require('../XProfGroupe/routes/editRoutes');
var CRUDRouter = require('../XProfGroupe/routes/CRUDRoutes');
var mongoose = require('mongoose');

var app = express();
Handlebars.registerHelper('idInArray', function (list, elt, options) {
    var stringElt = elt.toString();
    if (list.indexOf(stringElt) != -1) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('egal', function (a, b, options) {
    console.log("eq :" + a + ' ' + b)
    astr = a.toString()
    bstr = b.toString()
    if (astr == bstr) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

mongoose.connect('mongodb://localhost/xprofs-groupe', function (err) {
    if (err) {
        throw err;
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
var paginateHelper = require('./express-handlebars-paginate/index.js');
var hbs = require('hbs');
//hbs.registerHelper('paginateHelper', paginateHelper.createPagination);
var helpers = require('handlebars-helpers')();
helpers.paginateHelper = paginateHelper.createPagination;
app.engine('hbs', expresshbs({extname: 'hbs', helpers: helpers, defaultLayout: 'layout.hbs'}));


app.use(logger('dev'));

var FileStore = require('session-file-store')(session);
app.use(session({
    store: new FileStore({path: '/tmp/Sessions'}),
    secret: "315817458371538", resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', evalRouter);
app.use('/', dataRouter);
app.use('/', chartRouter);
app.use('/create', createRouter);
app.use('/remove', removeRouter);
app.use('/edit', editRouter);
app.use('/CRUD', CRUDRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
