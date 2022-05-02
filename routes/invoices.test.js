const request = require("supertest");
process.env.NODE_ENV === "test";
const app = require("../app");
const db = require("../db");
const { dropAndCreate } = require("../testTableSeed");
// before each test, clean out data
beforeEach(async () => {
  await db.query(dropAndCreate);
});
// afterEach(async () => {
//     await db.query("DELETE FROM invoices");
//     await db.query("DELETE FROM companies");
// })

afterAll(async () => {
  await db.end();
});

describe("GET /", function () {
  test("Respond with array of invoices", async function () {
    const response = await request(app).get("/invoices");
    expect(response.body).toEqual({
      invoices: [
        { id: expect.any(Number), comp_code: "apple" },
        { id: expect.any(Number), comp_code: "apple" },
        { id: expect.any(Number), comp_code: "apple" },
        { id: expect.any(Number), comp_code: "ibm" },
      ],
    });
  });
});

describe("GET /1", function () {
  test("Return invoice info", async function () {
    const response = await request(app).get("/invoices/1");
    expect(response.body).toEqual({
      invoice: {
        id: expect.any(Number),
        comp_code: "apple",
        amt: 100,
        add_date: expect.any(String),
        paid: false,
        paid_date: null,
        company: {
          code: "apple",
          name: "Apple Computer",
          description: "Maker of OSX.",
        },
      },
    });
  });
});

describe("POST /", function () {
  test("Add an invoice", async function () {
    const response = await request(app)
      .post("/invoices")
      .send({ amt: 100, comp_code: "apple" });

    expect(response.status).toBe(201);
  });
});

describe("PUT /", function () {
  test("update an invoice", async function () {
    const response = await request(app)
      .put("/invoices/2")
      .send({ amt: 500, paid: true });

    expect(response.body).toEqual({
      invoice: {
        id: 2,
        comp_code: "apple",
        paid: true,
        amt: 500,
        add_date: expect.any(String),
        paid_date: expect.any(String),
      },
    });
  });
});

describe("DELETE /", function () {
  test("Delete invoice", async function () {
    const response = await request(app).delete("/invoices/1");

    expect(response.body).toEqual({ status: "deleted" });
  });
});
