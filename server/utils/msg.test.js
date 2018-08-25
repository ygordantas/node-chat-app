const expect = require("expect");
const { generateMsg } = require("./msg");

describe("generateMsg", () => {
  it("Should generate the correct message object", () => {
    const from = "Ygor";
    const text = "hello world";
    const response = generateMsg(from, text);
    
    expect(response.from).toBe(from);
    expect(response.text).toBe(text);
    expect(typeof response.createdAt).toBe("number");
  });
});
