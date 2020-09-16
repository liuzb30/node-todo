#!/usr/bin/env node
const program = require("commander");
const api = require("./index.js");
const pkg = require("./package.json");

program.version(pkg.version);
program
  .command("add")
  .description("add a task")
  .action((...args) => {
    const words = args[1].join(" ");
    api.add(words);
  });
program
  .command("clear")
  .description("clear all tasks")
  .action(() => {
    api.clear();
  });

if (process.argv.length === 2) {
  // 说明用户直接运行 node cli.js
  void api.showAll();
}

// program.parse(process.argv);
