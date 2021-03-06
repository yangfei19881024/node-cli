const child_process = require('child_process')

const {resolve} = require('path')

module.exports = function npmInstall(...args) {
  let c_process = child_process.spawn(...args)
  c_process.stdout.pipe(process.stdout)
  c_process.stderr.pipe(process.stderr)
  return new Promise((resolve, reject) => {
    c_process.on('close', function () {
      resolve()
    })
    c_process.on('error', function () {
      reject()
    })
  })
}
