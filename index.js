const express = require('express');
require('dotenv').config();
const app = express();
const port = 3001;
const mongo = require('./src/mongo/index');
const cors = require('cors');
const blogRouter = require('./src/controllers/blogController');
const userRouter = require('./src/controllers/userController');
const commentRouter = require('./src/controllers/commentController');
const addProductRouter = require('./src/controllers/addProductController');
const loginRouter = require('./src/controllers/loginController');
const cartRouter = require('./src/controllers/cartController');


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