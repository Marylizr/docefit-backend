const express = require('express');
require('dotenv').config();
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors');
const routes = require('./src/routes/route');
const bodyParser = require('body-parser');
 
// const blogRouter = require('./src/controllers/blogController');
// const userRouter = require('./src/controllers/userController');
// const commentRouter = require('./src/controllers/commentController');
// const addProductRouter = require('./src/controllers/addProductController');
// const loginRouter = require('./src/controllers/loginController');
// const cartRouter = require('./src/controllers/cartController');
const PORT = process.env.PORT;

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

mongoose
 .connect(`mongodb://localhost:${PORT}/rbac`)
 .then(() => {
  console.log('Connected to the DoceFit Database successfully');
 });

app.use(bodyParser.urlencoded({ extended: true }));
 
app.use(async (req, res, next) => {
 if (req.headers["x-access-token"]) {
  const accessToken = req.headers["x-access-token"];
  const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
  // Check if token has expired
  if (exp < Date.now().valueOf() / 1000) { 
   return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
  } 
  res.locals.loggedInUser = await User.findById(userId); next(); 
 } else { 
  next(); 
 } 
});
 
app.use('/', routes); app.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT)
})

app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
   const accessToken = req.headers["x-access-token"];
   const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
   // Check if token has expired
   if (exp < Date.now().valueOf() / 1000) {
    return res.status(401).json({
     error: "JWT token has expired, please login to obtain a new one"
    });
   }
   res.locals.loggedInUser = await User.findById(userId);
   next();
  } else {
   next();
  }
});
 