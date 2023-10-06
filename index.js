const express = require('express');
const color = require('colors');

require('dotenv').config()

const PORT = process.env.PORT || 3000
const app = express()

const bodyParser = require('body-parser')
require('./db.js')
require('./model/User.js')
const authrouter = require('./router/authRouter.js')
const requireToken = require('./midllewares/authRequireToken.js')

app.use(bodyParser.json())
app.use(authrouter)




app.get('/', requireToken, (req, res) => {
    console.log(req.user);
    res.status(200).send({ message: 'this is home page 👌', user: req.user })
})



app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`.rainbow);
})



