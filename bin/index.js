#!/usr/bin/env node

const {program} = require('commander')

const {resolve} = require('path')

const res = (command) => resolve(__dirname, '../src/', command) // 读取脚本路径

const version = require('../package.json').version

program.version(version, '-v, --version') // 执行mycli -v 或 mycli --version的时候输出当前版本号

let actionMap = {
  init: {
    description:
      'generate a new (vue/react/miniprograme)project from a template',
    usages: ['boqii-cli init'],
  },
  config: {
    alias: 'cfg',
    description: 'config .eosrc',
    usages: ['暂不开放'],
  },
}

Object.keys(actionMap).forEach((action) => {
  program
    .command(action)
    .description(actionMap[action].description)
    .action(() => {
      require(res(action))
    })
})

// 帮助
function help() {
  console.log('\r\nUsage:')
  Object.keys(actionMap).forEach((action) => {
    actionMap[action].usages.forEach((usage) => {
      console.log('  - ' + usage)
    })
  })
  console.log('\r')
}

program.on('-h', help)
program.on('--help', help)

program.parse(process.argv) // 处理输出参数
