
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const color = require('colors');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});



userSchema.pre('save', async function (next) {
    const user = this
    console.log(`before hashing ${user.password}`.rainbow);
    if (!user.isModified('password')) {
        return next();
    }
    user.password = await bcrypt.hash(user.password, 10)
    console.log(`after hashing ${user.password}`.rainbow);
    next()
})




module.exports = mongoose.model('User', userSchema);

