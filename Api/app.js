const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topicsController.js");
const {
  getArticlesId,
  patchArticleById,
  getArticles,
} = require("./controllers/articlesController");

const { getUsers } = require("./controllers/usersController");

app.use(express.json());

app.get("/api/articles", getArticles);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesId);
app.get("/api/users", getUsers);
app.patch("/api/articles/:article_id", patchArticleById);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
