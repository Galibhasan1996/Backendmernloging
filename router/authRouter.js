const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer')
require('dotenv').config()



const mialer = async (email, VarificationCode) => {
    // console.log('mailer fuction called ' + code);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.NodeEmail_Email,
            pass: process.env.APP_PASS,
        },
    });

    let info = await transporter.sendMail({
        from: process.env.NodeEmail_Email,
        to: `${email}`,
        subject: "Email verification",
        text: `Your Verification code is ${VarificationCode}`,
        html: `<b>Your Verification code is ${VarificationCode}</b>`
    })
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}


// router.post('/varify', (req, res) => {
//     const { name, email, password, dob, address } = req.body
//     if (!name || !email || !password || !dob || !address) {
//         return res.status(422).json({ error: 'all field are require' })
//     }

//     else {
//         User.findOne({ email: email })
//             .then(async (saveUser) => {
//                 if (saveUser) {
//                     return res.status(422).json({ error: "user already exist" })
//                 } try {
//                     let VarificationCode = Math.floor(100000 + Math.random() * 900000)
//                     let user = [
//                         {
//                             name,
//                             email,
//                             password,
//                             dob,
//                             address,
//                             VarificationCode
//                         }
//                     ]
//                     await mialer(email, VarificationCode)
//                     return res.status(200).json({ message: "Verification Code Send to your Email", userdata: user })
//                 } catch (error) {
//                     console.log(error);
//                 }
//             }
//             )
//     }
// })




router.post('/verify', (req, res) => {
    const { name, email, password, dob, address, confirmpassword } = req.body;
    console.log('sent by client - ', req.body);
    if (!name || !email || !password || !dob || !address || !confirmpassword) {
        return res.status(422).json({ error: "Please add all the fields" });
    }


    User.findOne({ email: email })
        .then(async (savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user already exist" });
            }
            try {

                let VarificationCode = Math.floor(100000 + Math.random() * 900000);
                let user = [
                    {
                        name,
                        email,
                        password,
                        dob,
                        address,
                        confirmpassword,
                        VarificationCode
                    }
                ]
                await mialer(email, VarificationCode);
                res.send({ message: "Verification Code Sent to your Email", userdata: user });
            }
            catch (err) {
                console.log(err);
            }
        })
})



// router.post('/signup', (req, res) => {
//     const { name, email, password, dob, address, confirmpassword } = req.body
//     if (!name || !email || !password || !dob || !address || !confirmpassword) {
//         return res.status(422).json({ error: 'all fields are required' })
//     }

//     User.findOne({ email: email })
//         .then(async (saveUser) => {
//             if (saveUser) {
//                 return res.status(422).json({ error: 'user already exist' })
//             }
//             else {
//                 const user = new User({
//                     name: name,
//                     email: email,
//                     password: password,
//                     dob: dob,
//                     address: address,
//                     confirmpassword: confirmpassword
//                 })
//                 try {
//                     await user.save()
//                     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
//                     return res.status(200).send({ Message: "user saved successfully", token: token })
//                 } catch (error) {
//                     console.log(error);
//                     return res.status(422).send({ error: "user not saved" })
//                 }
//             }
//         })
//         .catch((err) => {
//             console.log(err);
//         })
// })



router.post('/signup', async (req, res) => {
    const { name, email, password, dob, address, confirmpassword } = req.body


    const user = new User({
        name: name,
        email: email,
        password: password,
        dob: dob,
        address: address,
        confirmpassword: confirmpassword
    })
    try {
        await user.save()
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        return res.status(200).send({ Message: "user saved successfully", token: token })
    } catch (error) {
        console.log(error);
        return res.status(422).send({ error: "user not saved" })
    }



})


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: 'Please Add Email and Password' })
    }
    await User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return res.status(422).send({ error: 'wrong email' })
            }
            else {
                bcrypt.compare(password, user.password, (err, payload) => {
                    if (payload) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
                        return res.status(422).send({ message: `Password match`, token: token })
                    }
                    else {
                        return res.status(422).send({ error: `wrong Password` })
                    }
                })
            }
        })
        .catch((err) => {
            console.log(err);
        })


})


module.exports = router