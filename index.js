const express = require('express');
require('dotenv').config();
const app = express();
const port = 3001;
const mongo = require('./mongo/index');
const cors = require('cors');
const blogRouter = require('./controllers/blogController');
const userRouter = require('./controllers/userController');
const commentRouter = require('./controllers/commentController');
const addProductRouter = require('./controllers/addProductController');
const loginRouter = require('./controllers/loginController');
const cartRouter = require('./controllers/cartController');


app.use(express.json());

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

app.listen(3001, () => {
  console.log(`app listening at http://localhost:${port}`)
})

app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.use("/comment", commentRouter);
app.use("/addProduct", addProductRouter);
app.use("/login", loginRouter);
app.use("/cart", cartRouter);