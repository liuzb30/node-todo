const db = require("../db");
const fs = require("fs");
jest.mock("fs");

describe("db", () => {
  afterEach(() => {
    fs.clearMock();
  });
  it("can read", async () => {
    const data = [{ title: "吃水果", done: false }];
    fs.setReadMock("/xxx", null, JSON.stringify(data));
    const list = await db.read("/xxx");
    expect(list).toEqual(data);
  });

  it("can write", async () => {
    let fakeData;
    fs.setWriteMock("/yyy", (path, data, callback) => {
      fakeData = data;
      callback(null);
    });
    const data = [{ title: "吃水果2", done: false }];
    await db.write(data, "/yyy");
    expect(fakeData).toEqual(JSON.stringify(data));
  });
});
