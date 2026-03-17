import { describe, it } from "node:test";
import assert from "node:assert";
import { isProfileComplete } from "./profileValidation";

describe("isProfileComplete profile setup logic", () => {
    it("returns false for a completely new user", () => {
        assert.strictEqual(isProfileComplete({ name: "Just Auth Name" } as any), false);
    });

    it("returns true for a modern user who just completed the setup page", () => {
        assert.strictEqual(isProfileComplete({ profileCompleted: true, name: "New User" } as any), true);
    });

    it("returns false for an existing user who signed up initially but left", () => {
        assert.strictEqual(isProfileComplete({ name: "Bob Builder" } as any), false);
    });

    it("returns true for an existing user who has fields filled out, despite no profileCompleted flag", () => {
        assert.strictEqual(isProfileComplete({
            name: "Alice Builder",
            contactNumber: "1234567890",
            dateOfBirth: "2000-01-01"
        } as any), true);
    });
});
