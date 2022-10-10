const express = require("express");
const app = express();
const {
  getTopics,
  getArticlesId,
  getUsers,
} = require("./controllers/nc_newsController");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesId);
app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
