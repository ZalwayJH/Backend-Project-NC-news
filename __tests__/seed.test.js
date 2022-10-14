const seed = require("../db/seeds/seed");
const testsData = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../Api/app");

afterAll(() => db.end());

beforeEach(() => {
  return seed(testsData);
});

describe("get/api/topics", () => {
  test("should return an array of topic objects with a key/value of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        expect(
          topics.every((property) => property.hasOwnProperty("slug"))
        ).toBe(true);
        expect(
          topics.every((property) => property.hasOwnProperty("description"))
        ).toBe(true);
      });
  });
});

describe("GET/api/articles", () => {
  test("should return an array object with the specified article Id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        const specifiedArticle = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: 11,
        };
        expect(articles).toBeInstanceOf(Object);
        expect(articles).toEqual(specifiedArticle);
        expect(articles).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          comment_count: 11,
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
  test("should return an an error of 404 and a message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/600")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article Id, please try another Id");
      });
  });
  test("should return an an error of 400 and a message when given an bad request eg a string instead of a number", () => {
    return request(app)
      .get("/api/articles/B4NAnA")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("get/api/users", () => {
  test("should return an array of user objects and properties of username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        expect(users).toBeInstanceOf(Array);
        users.forEach((property) => {
          expect(property).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("PATCH/api/articles/:article_id", () => {
  test("200: should return the article object with the votes incremented by the input amount", () => {
    const updatedVotes = { incr_votes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        const updatedExample = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 105,
        };
        expect(article).toEqual(updatedExample);
      });
  });
  test("200: should return the article object with the votes decremented by the input amount", () => {
    const updatedVotes = { incr_votes: -100 };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        const updatedExample = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 0,
        };
        expect(article).toEqual(updatedExample);
        expect(article).toBeInstanceOf(Object);
      });
  });
  test("400: should return an error and message when given the wrong type of input", () => {
    const updatedVotes = { incr_votes: 100 };
    return request(app)
      .patch("/api/articles/jaffacake")
      .send(updatedVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: should return an error and message when there is no matching Id in the database", () => {
    const updatedVotes = { incr_votes: 100 };
    return request(app)
      .patch("/api/articles/99999")
      .send(updatedVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article Id, please try another Id");
      });
  });
  test("400: should return an error and message if the vote number is a string", () => {
    const updatedVotes = { incr_votes: "fred" };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("get/api/article/:article_id(comments)", () => {
  test("should return an article object with a new row of comment_count with the number of comments associated with that article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body;
        const specifiedArticle = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          comment_count: 11,
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        };
        expect(article.comment_count).toBe(11);
        expect(article).toEqual(specifiedArticle);
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          comment_count: 11,
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
  test("testing with another id to make sure it functions correctly", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const article = body;
        const specifiedArticle = {
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          comment_count: 2,
        };
        expect(article).toEqual(specifiedArticle);
        expect(article).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          comment_count: 2,
        });
      });
  });
  test("should return 404 when give the wrong query type", () => {
    return request(app)
      .get("/api/articles/Banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("should return 400 when given an id that does'nt exist", () => {
    return request(app)
      .get("/api/articles/666")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article Id, please try another Id");
      });
  });
});

describe("get/api/articles", () => {
  test("should return all articles when no endpoint is supplied with a row of comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
        articles.forEach((property) => {
          expect(property).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("should return all articles with the matching topic query 'cats'", () => {
    return request(app)
      .get("/api/articles/?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const articles = body;
        expect(articles).toHaveLength(1);
        expect(articles[0].topic).toBe("cats");
        expect(articles[0]).toHaveProperty("comment_count", 2);
      });
  });
  test("should return an error of 404 when the query value does not exist in the table", () => {
    return request(app)
      .get("/api/articles/?topic=frog")
      .expect(404)
      .then(({ body }) => {
        const error = body;
        expect(error.msg).toBe("Invalid search term, please try another");
      });
  });
  test("should return a 400 error when the query is the wrong type of primitive", () => {
    return request(app)
      .get("/api/articles/?topic=c4t")
      .expect(400)
      .then(({ body }) => {
        const error = body;
        expect(error.msg).toBe("Bad Request");
      });
  });
});

describe("POST/api/articles/:article_id/comments", () => {
  test("should send a comment with a username to the database and respond with that posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "icellusedkars", body: "Good doggo much wow" })
      .expect(201)
      .then(({ body }) => {
        const newComment = body[0];
        expect(newComment).toHaveProperty("author", "icellusedkars");
        expect(newComment).toHaveProperty("body", "Good doggo much wow");
        expect(body).toHaveLength(1);
      });
  });
  test("returns an error when the username does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "gollum", body: "whats taters precious?" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User does not exist");
      });
  });
  test("returns an error when the comment isnt a string", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "gollum", body: 3 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("returns an error when the request body endpoints are incorrect", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ AuthorName: "icellusedkars", Pbody: "Good doggo much wow" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
