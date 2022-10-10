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
        expect(topics.length).not.toBe(0);
        expect(
          topics.every((property) => property.hasOwnProperty("slug"))
        ).toBe(true);
        expect(
          topics.every((property) => property.hasOwnProperty("description"))
        ).toBe(true);
      });
  });
  test("should return a 404 error when given an incorrect/misspelt topic endpoint", () => {
    return request(app).get("/api/topiks").expect(404);
  });
});
