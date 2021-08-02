require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const articlesRouter = require("./routes/articles");
const authorsRouter = require("./routes/authors");

/*
  We create an express app calling
  the express function.
*/
const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html

  Application Level Middleware
*/

app.use(cors());
app.use(express.json());
app.use(function logRequests(req, res, next) {
  console.log(new Date().toString());
  console.log(`${req.method} ${req.url}`);
  next();
});

/*
  Endpoint to handle GET requests to the root URI "/"
*/
app.get("/", (req, res) => {
  res.json({
    "/articles": "read and create new articles",
    "/articles/:id": "read, update and delete an individual article",
    "/auhors": "read and create new authors",
  });
});

app.use("/articles", articlesRouter);
app.use("/authors", authorsRouter);

/*
  We connect to MongoDB and when the connection is successful
  put our express app to listen in port 4000
*/

const { MONGO_URI, PORT } = process.env;
console.log("Connecting to mongo now");
mongoose
  .connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to mongo");
    app.listen(PORT, () => {
      console.log("Listening on http://localhost:4000");
    });
  })
  .catch((error) => {
    console.error(error);
  });
