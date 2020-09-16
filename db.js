const fs = require("fs");
const p = require("path");
const homedir = require("os").homedir();
const home = process.env.HOME || homedir;
const dbpath = p.join(home, ".todo");

module.exports = {
  read(path = dbpath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: "a+" }, (err, data) => {
        if (err) reject(err);
        let list;
        try {
          list = JSON.parse(data.toString());
        } catch (e) {
          list = [];
        }
        resolve(list);
      });
    });
  },
  write(data, path = dbpath) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(data), (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  },
};
