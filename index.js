const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const middleware = require("./middleware");

var authRouter = require("./routes/auth");
var userRouter = require("./routes/user");
var postRouter = require("./routes/post");
var commentRouter = require("./routes/comment");
var friendRequestRouter = require("./routes/friendRequest");
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api", friendRequestRouter);

app.use(middleware.errorHandler);

app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
