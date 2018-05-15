/**
 * Created by a.gimonnet on 4/25/18.
 */

var mongoose = require('mongoose');

const schema = mongoose.Schema({
    roles: [{type: String}],
    name: {type: String},
    firstname: {type: String},
    login : {type : String},
    password : {type : String}
});

const model = mongoose.model('user',schema);
module.exports = model;