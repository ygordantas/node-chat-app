const expect = require("expect");
const { generateMsg, generateLocationMsg } = require("./msg");

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

describe("generateLocationMsg", () => {
  it("should generate correct location object", () => {
    const from = "Ygor";
    const lat = 1;
    const lon = 2;

    const response = generateLocationMsg(from, lat, lon);

    expect(response.from).toBe(from);
    expect(response.url).toBe(`http://google.com/maps?q=${lat},${lon}`);
    expect(typeof response.createdAt).toBe("number");
  });
});
