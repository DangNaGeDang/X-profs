/**
 * Created by a.gimonnet on 4/27/18.
 */

var mongoose = require('mongoose');

const schema = mongoose.Schema({
    name : {type : String}
});

const model = mongoose.model('skill',schema);
module.exports = model;