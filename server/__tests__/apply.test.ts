import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createServer } from "../app";

let app: ReturnType<typeof createServer>;

beforeAll(() => { app = createServer(); });

describe("POST /api/apply", () => {
  it("accepts a valid application and returns 201", async () => {
    const res = await request(app).post("/api/apply").send({
      name: "Tariq Ahmed", email: "tariq@example.com", background: "engineer",
      message: "I want to transition from IC to founder.",
    });
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.id).toBeDefined();
  });

  it("rejects a missing name with 400", async () => {
    const res = await request(app).post("/api/apply").send({ email: "bad@example.com", background: "engineer", message: "Hi" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("rejects an invalid email with 400", async () => {
    const res = await request(app).post("/api/apply").send({ name: "Test", email: "not-an-email", background: "founder", message: "Hi" });
    expect(res.status).toBe(400);
  });
});
