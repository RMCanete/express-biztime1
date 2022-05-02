const request = require("supertest");
process.env.NODE_ENV === "test";
const app = require("../app");
const db = require("../db");
const { dropAndCreate } = require("../tableSeed");
// before each test, clean out data
beforeEach(async () => {
  await db.query(dropAndCreate);
});

afterAll(async () => {
  await db.end();
});

describe("GET /", function () {
  test("Respond with an array of companies", async function () {
    const response = await request(app).get("/companies");
    expect(response.body).toEqual({
      companies: [
        { code: "apple", name: "Apple Computer" },
        { code: "ibm", name: "IBM" },
      ],
    });
  });
});

// describe("GET /apple", function () {

//     test("Return information about Apple ", async function () {
//       const response = await request(app).get("/companies/apple");
//       expect(response.status).toBe(200);
//       //     {
//       //       "company": {
//       //         code: "apple",
//       //         name: "Apple",
//       //         description: "Maker of OSX."
//       //         // invoices: [1,2]
//       //       }
//       //     }
//       // );
//     });
// });

describe("POST /", function () {
  test("Add a new company", async function () {
    const response = await request(app)
      .post("/companies")
      .send({ name: "Target", description: "Shopping" });

    expect(response.body).toEqual({
      company: {
        code: "target",
        name: "Target",
        description: "Shopping",
      },
    });
  });
});

describe("PUT /", function () {
  test("Update a company", async function () {
    const response = await request(app)
      .put("/companies/ibm")
      .send({ name: "IbmNew", description: "IBM" });

    expect(response.body).toEqual({
      company: {
        code: "ibm",
        name: "IbmNew",
        description: "IBM",
      },
    });
  });
});

describe("DELETE /", function () {
  test("Deletes a company", async function () {
    const response = await request(app).delete("/companies/ibm");

    expect(response.body).toEqual({ status: "deleted" });
  });
});
