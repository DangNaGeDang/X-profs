/**
 * Created by a.gimonnet on 4/26/18.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
    name : {type : String},
    teacher: { type : ObjectId, ref : 'users'},
    sessions: [{type: ObjectId, ref: 'sessions'}],
    students: [{type: ObjectId, ref: 'users'}],
    skills: [{type: ObjectId, ref: 'skills'}]
})

const model = mongoose.model('course',schema);
module.exports = model