const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const middleware = require("./middleware");

var userRouter = require("./routes/user");
var apiRouter = require("./routes/api");

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

app.use("/", userRouter);
app.use("/api", apiRouter);

// app.use(function (err, req, res, next) {
//   if (err){
//     console.error(err.stack)
//     res.status(500).send('Something broke!')
//   }
// });

app.use(middleware.errorHandler);

app.listen(port, () => {
  console.log(`App is running on port: ${port}`);
});
