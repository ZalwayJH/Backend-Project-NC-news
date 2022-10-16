const db = require("../../db/connection");

exports.fetchArticlesComments = (id) => {
  if (/^\d+$/.test(id) !== true) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `SELECT comments.* FROM comments 
      WHERE comments.article_id = $1 ORDER BY created_at ASC;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Invalid Id, please try another",
        });
      }
      return rows;
    });
};

exports.fetchArticles = (query) => {
  let queryStr = `SELECT articles.*, 
  COUNT(comments.article_id) ::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;

  const queryValue = [];

  if (query) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValue.push(query);
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY created_at DESC;`;

  return db.query(queryStr, queryValue).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Invalid search term, please try another",
      });
    }
    return rows;
  });
};

exports.fetchArticlesId = (id) => {
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

exports.sendComments = (id, newComment) => {
  const { username, body } = newComment;

  if (/^\d+$/.test(id) !== true) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (body.trim() === "") {
    return Promise.reject({ status: 204, msg: "No comment to post" });
  }

  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User does not exist" });
      } else {
        return db
          .query(
            `INSERT INTO comments (article_id, author, body) VALUES($1, $2, $3) RETURNING *;`,
            [id, username, body]
          )
          .then(({ rows }) => {
            return rows;
          });
      }
    });
};
