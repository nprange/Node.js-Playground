import request from "supertest";
import { execSync } from "node:child_process";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("Transaction routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a new transaction", async () => {
    await request(app.server)
      .post("/transaction")
      .send({
        title: "New transaction",
        amount: 5400,
        type: "credit",
      })
      .expect(201);
  });

  it("should be able to get all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transaction")
      .send({
        title: "New transaction",
        amount: 5400,
        type: "credit",
      });
    const cookies = createTransactionResponse.get("Set-Cookie");

    const getTransactionsResponse = await request(app.server)
      .get("/transaction")
      .set("Cookie", cookies)
      .expect(200);

    expect(getTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "New transaction",
        amount: 5400,
      }),
    ]);
  });

  it("should be able to get a specific transaction", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transaction")
      .send({
        title: "New transaction",
        amount: 5400,
        type: "credit",
      });
    const cookies = createTransactionResponse.get("Set-Cookie");

    const getTransactionsResponse = await request(app.server)
      .get("/transaction")
      .set("Cookie", cookies)
      .expect(200);

    const transactionId = getTransactionsResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transaction/${transactionId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: "New transaction",
        amount: 5400,
      })
    );
  });

  it("should be able to get the summary", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transaction")
      .send({
        title: "New transaction",
        amount: 5400,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    await request(app.server).post("/transaction").set("Cookie", cookies).send({
      title: "Debit transaction",
      amount: 2200,
      type: "debit",
    });

    const summaryResponse = await request(app.server)
      .get("/transaction/summary")
      .set("Cookie", cookies)
      .expect(200);

    expect(summaryResponse.body.summary).toEqual({
      amount: 3200,
    });
  });
});
