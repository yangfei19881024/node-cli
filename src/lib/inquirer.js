// inquirer.js

const inquirer = require('inquirer')
const files = require('./files')
const chalk = require('chalk')
module.exports = {
  // 询问git账号信息
  askProjectType: () => {
    const questions = [
      {
        type: 'list',
        name: 'type',
        message: '选择项目脚手架模板',
        choices: [
          {name: 'React', value: 'react'},
          {name: 'Vue', value: 'vue'},
          {name: '小程序', value: 'mini'},
        ],
      },
    ]
    return inquirer.prompt(questions)
  },
  askProjectInfo: () => {
    const questions = [
      {
        name: 'name',
        type: 'input',
        message: '请输入项目名(英文):',
        validate: function (value) {
          if (files.directoryExists(value)) {
            console.log(chalk.red(' 项目名已存在,请更换'))
            return false
          } else {
            return true
          }
        },
      },
      {
        name: 'author',
        type: 'input',
        message: '请输入项目作者:',
        default: 'me',
      },
      {
        name: 'version',
        type: 'input',
        message: '请输入版本号:',
        default: '1.0.0',
      },
      {
        name: 'description',
        type: 'input',
        message: '请输入项目描述:',
        default: '项目描述',
      },
    ]
    return inquirer.prompt(questions)
  },
}
