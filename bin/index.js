#!/usr/bin/env node
const program = require('commander');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');

// 开始下载
const spinner = ora('正在下载模板...');

const version = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')).toString()).version

program.version(version, '-v, --version')
    .command('create <name>')
    .action((name) => {
      if (fs.existsSync(name)) {
        // 错误提示项目已存在，避免覆盖原有项目
        console.log(symbols.error, chalk.red('项目已存在'));
      } else {
        inquirer.prompt([
          {
            name: 'description',
            message: '请输入项目描述'
          },
          {
            type: 'input',
            name: 'author',
            message: '请输入作者名称'
          }
        ]).then((answers) => {
          spinner.start();
          download('lin-Fore-end/big-project#master', name, {clone: true}, (err) => {
            if (err) {
              spinner.fail();
              console.log(symbols.error, chalk.red('项目创建失败'));
            } else {
              spinner.succeed();
              console.log(symbols.success, chalk.green('项目创建成功'));
            };
            const meta = {
              name,
              description: answers.description,
              author: answers.author
            };
            const fileName = `${name}/package.json`;
            const content = fs.readFileSync(fileName).toString();
            const result = handlebars.compile(content)(meta);
            fs.writeFileSync(fileName, result);
          });
        });
      }
    });
program.parse(process.argv);