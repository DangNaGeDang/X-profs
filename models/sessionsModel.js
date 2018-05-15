/**
 * Created by a.gimonnet on 4/27/18.
 */

var mongoose = require('mongoose');

const schema = mongoose.Schema({
    date : {type : Date}
});

const model = mongoose.model('session',schema);
module.exports = model;