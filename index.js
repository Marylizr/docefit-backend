const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser')
const mongo = require('./src/mongo/index');
const cors = require('cors');
const blogRouter = require('./src/controllers/blogController');
const userRouter = require('./src/controllers/userController');
const commentRouter = require('./src/controllers/commentController');
const addProductRouter = require('./src/controllers/addProductController');
const loginRouter = require('./src/controllers/loginController');
const cartRouter = require('./src/controllers/cartController');
const port = process.env.PORT;

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());


const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.use("/comment", commentRouter);
app.use("/addProduct", addProductRouter);
app.use("/login", loginRouter);
app.use("/cart", cartRouter);