const express = require("express");
const app = express();
const cors = require("cors");
const { getTopics } = require("./Api/controllers/topicsController.js");
const {
  getArticlesId,
  patchArticleById,
  getArticles,
  getArticleComments,
  postComments,
  removeArticleById,
  getEndpoints,
} = require("./Api/controllers/articlesController");

const { getUsers } = require("./Api/controllers/usersController");

app.use(cors());
app.use(express.json());

app.delete("/api/articles/:article_id", removeArticleById);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postComments);
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
