const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config()




router.post('/signup', (req, res) => {
    const { name, email, password, dob } = req.body
    if (!name || !email || !password || !dob) {
        return res.status(422).json({ error: 'all fields are required' })
    }

    User.findOne({ email: email })
        .then(async (saveUser) => {
            if (saveUser) {
                return res.status(422).json({ error: 'Invalid credential' })
            }
            else {
                const user = new User({
                    name: name,
                    email: email,
                    password: password,
                    dob: dob,
                })
                try {
                    await user.save()
                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
                    return res.status(200).send({ Message: "user saved successfully", token: token })
                } catch (error) {
                    console.log(error);
                    return res.status(422).send({ error: "user not saved" })
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })
})


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: 'Please Add Email and Password' })
    }
    await User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return res.status(422).send({ error: 'Invalid credential' })
            }
            else {
                bcrypt.compare(password, user.password, (err, payload) => {
                    if (payload) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
                        return res.status(422).send({ message: `Password match`, token: token })
                    }
                    else {
                        return res.status(422).send({ error: `Password mismatch` })
                    }
                })
            }
        })
        .catch((err) => {
            console.log(err);
        })


})


module.exports = router