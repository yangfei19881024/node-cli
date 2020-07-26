#!/usr/bin/env node
const path = require('path')
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const ora = require('ora')
const fse = require('fs-extra')
const Handlebars = require('handlebars')
const logSymbols = require('log-symbols')

const files = require('./lib/files')
const inquirer = require('./lib/inquirer')
const startDownLoad = require('./lib/download')
const npmInstall = require('./lib/npminstall')

clear()

// 输出Logo
console.log(
  chalk.yellow(figlet.textSync('BOQII-CLI', {horizontalLayout: 'full'}))
)

// 开始
// 判断是否已经存在 .git
if (files.directoryExists('.git')) {
  console.log(chalk.red('已经存在一个本地仓库!'))
  process.exit()
}

function spinner(text) {
  return ora(text).start()
}

/**
 * 1. 先去下载 项目
 * 2. 在目录下新建文件夹?
 * 3. 把下载的代码放进去
 * 2. 然后改写项目中的package.json
 *
 */
async function run() {
  let {type: project_type} = await inquirer.askProjectType()

  // 开始下载 git 项目到本地
  let tempPath = await startDownLoad(project_type)

  // 项目下载下来再次询问
  let project_info = await inquirer.askProjectInfo()

  const spinner_generate = spinner(`${project_type} 项目生成中...`)

  let pkg = fse.readJsonSync(
    require('path').resolve(tempPath, './package.json')
  )

  var pkg_template = Handlebars.compile(JSON.stringify(pkg))

  var pkg_str = pkg_template(project_info)

  fse.writeJsonSync(
    require('path').resolve(tempPath, './package.json'),
    JSON.parse(pkg_str),
    /**格式化 package.json */
    {
      spaces: '\t',
      EOL: '\n',
    }
  )
  // 把临时的文件夹内容 拷贝到项目下
  fse.copySync(tempPath, project_info.name, {
    overwrite: true,
  })
  // 删除临时文件
  fse.removeSync(tempPath)
  setTimeout(async function () {
    spinner_generate.stop()

    const spinner_install = spinner('安装项目依赖...')
    // 通过子进程 安装npm 依赖库
    await npmInstall(
      'npm',
      ['install', '--registry=https://registry.npm.taobao.org'],
      {cwd: `./${project_info.name}`}
    )

    spinner_install.succeed(`愉快的使用${project_type} 脚手架开发吧`)

    console.log(chalk.yellow('cd ' + project_info.name + '\nnpm run dev'))
  }, 1000)
}

run()

// 程序突然退出 逻辑处理
process.on('SIGINT', function (err) {
  console.log('\n')
  console.log(logSymbols.error, '程序意外终止')
  fse.removeSync('.download-temp')
})

// process.on('error', function (err) {
//   console.log('\n')
//   console.log(logSymbols.error, '程序意外终止')
//   fse.removeSync('.download-temp')
// })
