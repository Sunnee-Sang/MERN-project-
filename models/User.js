const mongoose = require ('mongoose');

const userSchema = new  mongoose.Schema({

    firstName: {type: String },
    lastName:  {type: String },
    sex:  {type: String },
    age: {type: Number },
    password:  {type: String },
    createdAt:  {
        type: Date,
        default: Date.now
    }
})
module.exports = User= mongoose.model('user', userSchema);