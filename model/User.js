
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure that each admin's email is unique
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});



userSchema.pre('save', async function (next) {
    const user = this
    console.log("before hashing " + user.password);
    if (!user.isModified('password')) {
        return next();
    }
    user.password = await bcrypt.hash(user.password, 10)
    console.log("after hashing " + user.password);
    next()
})




module.exports = mongoose.model('User', userSchema);

