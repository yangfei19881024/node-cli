# CLI 脚手架

## 依赖的库

- inquirer
- commander（获取命令行参数）
- chalk 终端颜色
- download-git-repo
- handbars 模板

git push 时候报错
Error: Permission to user/repo denied to user/other-repo

解决方案:

参考: https://stackoverflow.com/questions/5335197/gits-famous-error-permission-to-git-denied-to-user

Here is what I did:
Open "Keychain Access" (You can find it in Spotlight or LaunchPad)

Select "All items" in Category

Search "git"

Delete every old & strange item

Try to Push again and it just WORKED
