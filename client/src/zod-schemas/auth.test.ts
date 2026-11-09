import { describe, expect, it } from "vitest";
import type * as z from "zod";
import { changeEmailSchema, registerSchema, resetPasswordSchema } from "./auth";

function errorAt(schema: z.ZodType, value: unknown, path: string) {
  const result = schema.safeParse(value);
  return result.success
    ? undefined
    : result.error.issues.find((issue) => issue.path.join(".") === path)?.message;
}

const validPassword = "Passw0rd!";
const ruleMessage = "Must include upper & lowercase letters, a number, and a symbol";

describe("password rule", () => {
  it.each([
    ["Passw0rd!", undefined],
    ["password1!", ruleMessage],
    ["PASSWORD1!", ruleMessage],
    ["Password!!", ruleMessage],
    ["Password12", ruleMessage],
  ])("validates %j", (password, message) => {
    expect(
      errorAt(resetPasswordSchema, { password, confirmPassword: password }, "password"),
    ).toBe(message);
  });
});

describe("matching fields", () => {
  it("flags mismatched passwords on register", () => {
    expect(
      errorAt(
        registerSchema,
        {
          userName: "alice",
          email: "alice@example.com",
          password: validPassword,
          confirmPassword: "Different1!",
        },
        "confirmPassword",
      ),
    ).toBe("Passwords do not match");
  });

  it("flags mismatched passwords on reset", () => {
    expect(
      errorAt(
        resetPasswordSchema,
        { password: validPassword, confirmPassword: "Other1!xx" },
        "confirmPassword",
      ),
    ).toBe("Passwords do not match");
  });

  it("flags mismatched emails", () => {
    expect(
      errorAt(changeEmailSchema, { newEmail: "a@b.co", confirmEmail: "c@d.co" }, "confirmEmail"),
    ).toBe("Emails do not match");
  });
});
