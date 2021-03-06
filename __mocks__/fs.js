const fs = jest.createMockFromModule("fs");
const _fs = jest.requireActual("fs");

Object.assign(fs, _fs);

let readMock = {};
fs.setReadMock = (path, error, data) => {
  readMock[path] = [error, data];
};

fs.readFile = (path, options, callback) => {
  callback == undefined && (callback = options);
  if (path in readMock) {
    callback(...readMock[path]);
  } else {
    _fs.readFile(path, options, callback);
  }
};

let writeMock = {};

fs.setWriteMock = (path, fn) => {
  writeMock[path] = fn;
};

fs.writeFile = (path, data, options, callback) => {
  if (path in writeMock) {
    writeMock[path](path, data, options, callback);
  } else {
    _fs.writeFile(path, data, options, callback);
  }
};

fs.clearMock = () => {
  readMock = {};
  writeMock = {};
};

module.exports = fs;
