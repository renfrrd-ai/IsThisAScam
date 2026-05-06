import { describe, expect, it } from "vitest";
import { getHealthPayload } from "../src/routes/health";

describe("health payload", () => {
  it("returns API health data", () => {
    expect(getHealthPayload()).toEqual({
      status: "ok",
      service: "scamradar-api",
    });
  });
});
