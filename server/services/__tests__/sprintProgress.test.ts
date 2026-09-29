import { describe, expect, it } from "vitest";
import { hasSprintReflection } from "../sprintProgress";

describe("hasSprintReflection", () => {
  it("rejects missing, malformed, and too-short reflections", () => {
    expect(hasSprintReflection(null)).toBe(false);
    expect(hasSprintReflection({ reflection: 123 })).toBe(false);
    expect(hasSprintReflection({ reflection: "  four  " })).toBe(false);
  });

  it("accepts a meaningful reflection", () => {
    expect(hasSprintReflection({ reflection: "Talked with two buyers" })).toBe(true);
  });
});
