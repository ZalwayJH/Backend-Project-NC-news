const { fetchTopics } = require("../models/nc_newsModel");
const { fetchArticles } = require("../models/nc_newsModel");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesId = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticles(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
