import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  jwtVerify: vi.fn(),
  userFindById: vi.fn(),
  userSelect: vi.fn(),
  jobCreate: vi.fn(),
  jobFindOne: vi.fn(),
  reportFindOne: vi.fn(),
  reportFindById: vi.fn(),
  reportCreate: vi.fn(),
  reportFind: vi.fn(),
  reportCountDocuments: vi.fn()
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: mocks.jwtVerify
  }
}));

vi.mock("../../src/models/User.js", () => ({
  default: {
    findById: mocks.userFindById
  }
}));

vi.mock("../../src/models/TrustScanJob.js", () => ({
  default: {
    create: mocks.jobCreate,
    findOne: mocks.jobFindOne
  }
}));

vi.mock("../../src/models/TrustScanReport.js", () => ({
  default: {
    findOne: mocks.reportFindOne,
    findById: mocks.reportFindById,
    create: mocks.reportCreate,
    find: mocks.reportFind,
    countDocuments: mocks.reportCountDocuments
  }
}));

import trustScanRoutes from "../../src/routes/trustScanRoutes.js";

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/trustscan", trustScanRoutes);
  return app;
};

const authHeader = () => ({
  Authorization: "Bearer valid-token"
});

describe("TrustScan Routes", () => {
  const app = createApp();
  const userId = "507f191e810c19729de860ea";

  beforeEach(() => {
    vi.clearAllMocks();

    process.env.JWT_SECRET = "test-secret";

    mocks.jwtVerify.mockReturnValue({ id: userId });
    mocks.userFindById.mockReturnValue({
      select: mocks.userSelect
    });
    mocks.userSelect.mockResolvedValue({
      _id: userId,
      isSuspended: false
    });

    mocks.reportFindOne.mockResolvedValue(null);
    mocks.reportFindById.mockResolvedValue(null);
    mocks.reportCreate.mockResolvedValue(null);
    mocks.reportCountDocuments.mockResolvedValue(0);
  });

  describe("GET /api/trustscan/report/:id/public", () => {
    it("returns a public report without auth", async () => {
      mocks.reportFindById.mockResolvedValue({
        toObject: vi.fn(() => ({
          _id: "report_public",
          score: 90,
          verdict: "SAFE"
        }))
      });

      const res = await request(app).get("/api/trustscan/report/report_public/public");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.report).toMatchObject({
        _id: "report_public",
        score: 90,
        verdict: "SAFE"
      });
    });
  });

  describe("POST /api/trustscan", () => {
    it("returns 201 and job payload for authenticated valid URL", async () => {
      mocks.jobCreate.mockResolvedValue({
        _id: "job_1",
        status: "running",
        url: "https://example.com/",
        normalizedDomain: "example.com"
      });

      const res = await request(app)
        .post("/api/trustscan")
        .set(authHeader())
        .send({ url: "example.com" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        jobId: "job_1",
        status: "running",
        url: "https://example.com/",
        normalizedDomain: "example.com"
      });
      expect(typeof res.body.data.etaSeconds).toBe("number");
    });

    it("returns 401 without token", async () => {
      const res = await request(app)
        .post("/api/trustscan")
        .send({ url: "example.com" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("No token provided");
    });

    it("returns 400 for invalid URL format", async () => {
      const res = await request(app)
        .post("/api/trustscan")
        .set(authHeader())
        .send({ url: "http://" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid URL format");
    });

    it("returns 400 for empty URL", async () => {
      const res = await request(app)
        .post("/api/trustscan")
        .set(authHeader())
        .send({ url: "   " });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Validation failed");
      expect(Array.isArray(res.body.errors)).toBe(true);
    });
  });

  describe("GET /api/trustscan/:id", () => {
    it("returns job and null report while scan is running", async () => {
      const runningJob = {
        _id: "job_running",
        userId,
        status: "running",
        url: "https://example.com/",
        normalizedDomain: "example.com",
        startedAt: new Date(),
        toObject: vi.fn(() => ({
          _id: "job_running",
          status: "running"
        }))
      };

      mocks.jobFindOne.mockResolvedValue(runningJob);

      const res = await request(app)
        .get("/api/trustscan/job_running")
        .set(authHeader());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.job.status).toBe("running");
      expect(res.body.data.report).toBeNull();
    });

    it("returns completed job with report", async () => {
      const completedJob = {
        _id: "job_completed",
        userId,
        status: "completed",
        url: "https://example.com/",
        normalizedDomain: "example.com",
        toObject: vi.fn(() => ({
          _id: "job_completed",
          status: "completed"
        }))
      };

      const report = {
        toObject: vi.fn(() => ({
          jobId: "job_completed",
          score: 86,
          verdict: "SAFE"
        }))
      };

      mocks.jobFindOne.mockResolvedValue(completedJob);
      mocks.reportFindOne.mockResolvedValue(report);

      const res = await request(app)
        .get("/api/trustscan/job_completed")
        .set(authHeader());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.job.status).toBe("completed");
      expect(res.body.data.report).toMatchObject({
        jobId: "job_completed",
        score: 86,
        verdict: "SAFE"
      });
    });

    it("returns 404 when job is not found for current user", async () => {
      mocks.jobFindOne.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/trustscan/unknown")
        .set(authHeader());

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("TrustScan job not found");
    });

    it("handles bad id errors cleanly", async () => {
      mocks.jobFindOne.mockRejectedValue(new Error("Cast to ObjectId failed"));

      const res = await request(app)
        .get("/api/trustscan/not-a-valid-id")
        .set(authHeader());

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Cast to ObjectId failed");
    });
  });

  describe("GET /api/trustscan/history", () => {
    it("returns paginated, user-scoped history sorted desc and capped limit", async () => {
      const items = [
        {
          jobId: "job_2",
          url: "https://two.example",
          normalizedDomain: "two.example",
          score: 88,
          verdict: "SAFE",
          summary: "summary",
          createdAt: "2026-01-02T00:00:00.000Z"
        }
      ];

      const chain = {
        select: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(items)
      };

      mocks.reportFind.mockReturnValue(chain);
      mocks.reportCountDocuments.mockResolvedValue(25);

      const res = await request(app)
        .get("/api/trustscan/history?page=1&limit=999")
        .set(authHeader());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toEqual(items);
      expect(res.body.data.pagination).toMatchObject({
        page: 1,
        limit: 20,
        total: 25,
        totalPages: 2,
        hasNextPage: true
      });

      expect(mocks.reportFind).toHaveBeenCalledWith({ userId });
      expect(chain.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(chain.limit).toHaveBeenCalledWith(20);
    });
  });
});
