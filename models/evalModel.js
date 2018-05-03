/**
 * Created by a.gimonnet on 4/28/18.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
    mark: { type : Number},
    session: {type: ObjectId, ref: 'sessions'},
    student: {type: ObjectId, ref: 'users'},
    skill: {type: ObjectId, ref: 'skills'},
    course: {type: ObjectId, ref: 'courses'},
})

const model = mongoose.model('evaluation',schema);
module.exports = model