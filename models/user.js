const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
// User Schema for creating table
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    address:{
        type:String,
        required:true,
    },
    adhaarCardNo: {
        type: Number,
        unique: true,    // Ensures unique index
        required: true,  // Field is mandatory
        validate: {
            validator: function(v) {
                // Aadhaar number should be a 12-digit number
                return /^\d{12}$/.test(v);
            },
            message: props => `${props.value} is not a valid Aadhaar number!`
        },
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['Voter','Admin'],
        default:'Voter'
    },
    isVoted:{
        type:Boolean,
        default:true
    }
});


userSchema.pre('save', async function (next) {
    const person = this;
    if (!person.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(person.password, salt);
        person.password = hashPassword; // Fixed typo here
        next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.comparePassword= async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password); // Fixed typo here
        return isMatch;
    } catch (err) {
        throw err;
    }
};
const User = mongoose.model('User', userSchema);
module.exports = User;
