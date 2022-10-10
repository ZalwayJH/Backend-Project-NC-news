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
        expect(topics.length).toBe(3);
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
        const { articles } = body;
        const specifiedArticle = [
          {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
          },
        ];
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toEqual(specifiedArticle);
        expect(
          articles.every((property) => property.hasOwnProperty("article_id"))
        ).toBe(true);
        expect(
          articles.every((property) => property.hasOwnProperty("title"))
        ).toBe(true);
        expect(
          articles.every((property) => property.hasOwnProperty("topic"))
        ).toBe(true);
        expect(
          articles.every((property) => property.hasOwnProperty("author"))
        ).toBe(true);
        expect(
          articles.every((property) => property.hasOwnProperty("body"))
        ).toBe(true);
        expect(
          articles.every((property) => property.hasOwnProperty("created_at"))
        ).toBe(true);
        expect(
          articles.every((property) => property.hasOwnProperty("votes"))
        ).toBe(true);
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
