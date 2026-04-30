import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge tailwind classes properly", () => {
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });
    
    it("should handle conditional classes", () => {
      expect(cn("px-2 py-1", true && "text-sm", false && "font-bold")).toBe("px-2 py-1 text-sm");
    });
  });
});
