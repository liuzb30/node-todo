const inquirer = require("inquirer");
const db = require("./db");

const askForCreateTask = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "请输入标题",
      },
    ])
    .then(async (answers) => {
      await add(answers.title);
    });
};

const markAsDone = (list, index) => {
  list[index].done = true;
  db.write(list);
};

const markAsUndo = (list, index) => {
  list[index].done = false;
  db.write(list);
};

const updateTitle = (list, index) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "请输入新的标题",
        default: function () {
          return list[index].title;
        },
      },
    ])
    .then(async (answers3) => {
      console.log(answers3);
      list[index].title = answers3.title;
      db.write(list);
    });
};

const remove = (list, index) => {
  list.splice(index, 1);
  db.write(list);
};

const askForAction = (list, index) => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "请选择操作",
        choices: [
          { name: "退出", value: "quit" },
          { name: "已完成", value: "markAsDone" },
          { name: "未完成", value: "markAsUndo" },
          { name: "改标题", value: "updateTitle" },
          { name: "删除", value: "remove" },
        ],
      },
    ])
    .then((answers) => {
      const actionMap = { markAsDone, markAsUndo, updateTitle, remove };
      const action = answers.action;
      actionMap[action] && actionMap[action](list, index);
    });
};

const printTasks = (list) => {
  const string = list.map((item, index) => {
    return {
      name: `${item.done ? "[*]" : "[_]"} ${index + 1} - ${item.title}`,
      value: index,
    };
  });
  inquirer
    .prompt([
      {
        type: "list",
        name: "index",
        message: "请选择你想操作的任务",
        choices: [
          { name: "退出", value: -1 },
          ...string,
          { name: "+ 创建任务", value: -2 },
        ],
      },
    ])
    .then((answers) => {
      const { index } = answers;
      if (index === -2) {
        askForCreateTask();
      } else if (index >= 0) {
        askForAction(list, index);
      }
    });
};

const add = async (task) => {
  // 读取文件
  const list = await db.read();
  // 添加任务
  list.push({ title: task, done: false });
  // 写入文件
  await db.write(list);
  console.log("添加成功");
};

const clear = async () => {
  // 清空文件内容
  await db.write([]);
  console.log("清除成功");
};

const showAll = async () => {
  // 读取文件内容
  const list = await db.read();
  printTasks(list);
};

module.exports = {
  add,
  clear,
  showAll,
};
