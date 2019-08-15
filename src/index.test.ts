import { hello } from "./index";

test("example", () => {
  expect(hello("tim")).toBe("Hello tim!");
});
