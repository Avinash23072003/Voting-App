const express = require('express');
const app = express();
const db=require('./db');
require('dotenv').config();
//const {  jwtAuthMiddleware } = require('./jwt');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = process.env.PORT|| 4000;

const userRoutes=require('./routes/userRouter');
const candidateRoutes=require('./routes/candidateRoute')
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);

app.listen(port, () => {
    console.log("Server is listening on port " + port);
});
