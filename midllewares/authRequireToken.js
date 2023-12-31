const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User')
require('dotenv').config()




module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).send({ error: "key not awailable" })
    }
    else {
        const token = authorization.replace('Bearer ', '')
        jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
            if (err) {
                return res.status(401).json({ error: 'you must login first toke invalid' })
            }
            else {
                const { _id } = payload
                User.findById(_id)
                    .then((userdata) => {
                        req.user = userdata
                        next()
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
    }
}