const fse = require('fs-extra')
const ora = require('ora')
const download = require('download-git-repo')

module.exports = function (project_type = '') {
  // oraShow('模板下载中...')
  const spinner = ora(`${project_type} 模板下载中...`).start()
  target = '.download-temp'
  return new Promise((resolve, reject) => {
    // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
    // download-git-repo踩坑(路径错误导致下载模板失败--git clone status 128)
    // 从github上下载所需得template 下载地址不是你复制得https://github.com/xxx/xxx.git
    // 正确写法 github:github账号/项目名(没有.git结尾)#分支
    // 比如 github:yangfei19881024/primitive-js#master
    download(
      require('./git-repo')[project_type],
      target,
      {clone: true},
      (err) => {
        if (err) {
          spinner.fail('模板下载失败!')
          // 删除临时文件
          fse.removeSync(target)
          reject(err)
        } else {
          spinner.succeed('模板下载成功!')
          // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
          resolve(target)
        }
      }
    )
  })
}
