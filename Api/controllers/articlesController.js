const {
  fetchArticlesId,
  updateArticleById,
  fetchArticles,
} = require("../models/articlesModel.js");

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  fetchArticles(topic)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesId = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticlesId(article_id)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const articleId = req.params;
  const { incr_votes } = req.body;
  updateArticleById(incr_votes, articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
