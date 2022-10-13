const db = require("../../db/connection");

exports.fetchArticles = (id) => {
  if (/^\d+$/.test(id) !== true) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `SELECT articles.*, 
      COUNT(comments.article_id) ::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE articles.article_id =$1
      GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Invalid article Id, please try another Id",
        });
      }
      return rows[0];
    });
};

exports.updateArticleById = (newVotes, id) => {
  const { article_id } = id;
  if (/^\d+$/.test(article_id) !== true) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  if (typeof newVotes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes +$1 WHERE article_id = $2 RETURNING *;`,
      [newVotes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Invalid article Id, please try another Id",
        });
      }
      return rows[0];
    });
};
