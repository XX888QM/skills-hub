import assert from "node:assert/strict";
import test from "node:test";
import { keepDescription } from "./description.ts";

test("keepDescription keeps content and prefers a Chinese translation", () => {
  assert.equal(keepDescription("", "用途说明"), "用途说明");
  assert.equal(keepDescription("Existing", undefined), "Existing");
  assert.equal(keepDescription("English description", "中文说明"), "中文说明");
  assert.equal(keepDescription("已有中文", "New English"), "已有中文");
});
