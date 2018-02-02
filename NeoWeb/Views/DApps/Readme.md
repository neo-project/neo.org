## 自助添加 dApp 的步骤

总的流程如下：

1. Fork 这个项目到自己的 GitHub 仓库，相当于拷贝一份到自己的 GitHub 账户下
2. 将自己的库 Pull 下来（这时候 Origin 是自己的地址，不是公共地址）
3. 创建子分支并修改本地 NeoWeb \ Views \ DApps 目录下的 Index.cshtml 文件
4. 提交修改（Commit）
5. Push 到自己的 GitHub，也就是当前的 Origin 地址
6. 在 GitHub 上提交 Pull request（neo-project ← Your GitHub）

提交 Pull request 后，管理员审核通过后，就会合并到主分支中，并且发布到官网。若有疑问，可以发邮件到 chris@neo.org

### 如何提交 Pull request
- [Creating a pull request](https://help.github.com/articles/creating-a-pull-request/)
- [Creating a pull request from a fork](https://help.github.com/articles/creating-a-pull-request-from-a-fork/)

### 开发环境

本网站使用 `ASP.NET Core 2.0`，开发者如需本地运行调试请先安装好开发环境。

[Visual Studio 2017](https://www.visualstudio.com) 安装时需要勾选 `ASP.NET 和 Web 开发`、`.NET Core 跨平台开发` 。

[.NET Core 2.0 SDK](https://www.microsoft.com/net/core)

项目代码不包含数据库，首次运行网站会提示：

A database operation failed while processing the request.

Applying existing migrations for ApplicationDbContext may resolve this issue.

此时按照提示操作，点击 `Apply Migrations` 按钮即可自动创建数据库。

附：[ASP.NET Core Tutorials](https://docs.microsoft.com/en-us/aspnet/core/)

### dApp 要求

- 所添加的 dApp 必需已在 main net 或 test net 上发布
- 需要添加完善的 dApp 信息，如封面图片、名称、作者、dApp描述、邮箱、GitHub、ScriptHash
- 封面图片上传至 NeoWeb\wwwroot\images\dapps 文件夹中
- 新添加的项目应该添加到项目列表的最后，否则审核不会通过。

## How to add a dApp

The overall process is as follows:

1. Fork this project to your own GitHub repository (so you have a copy on your own GitHub account).
2. Create a branch in your own repository (this time the origin will be your own fork, not the public one).
3. Modify the site code locally and complete the tests.
4. Commit the changes to your branch.
5. Push the changes to your main branch.
6. Create a Pull Request (PR) on GitHub (neo-project ← your own GitHub).

When the PR is submitted, it will be reviewed and, if accepted, merged into the main branch, after which it is published to the official website.

If you have any questions, you can send an e-mail to [chris@neo.org](mailto:chris@neo.org).

### How to submit a Pull Request
- [Creating a pull request](https://help.github.com/articles/creating-a-pull-request/)
- [Creating a pull request from a fork](https://help.github.com/articles/creating-a-pull-request-from-a-fork/)

### Development Environment

This website uses `ASP.NET Core 2.0`. Developers need to run local debugging. Please first install the development environment:
- [Visual Studio 2017](https://www.visualstudio.com) - make sure `ASP.NET and Web Development` and `.NET Core cross-platform development` are installed.
- [.NET Core 2.0 SDK](https://www.microsoft.com/net/core).

The project code does not contain the database. The first time running the website, the following prompt will appear:

`A database operation failed while processing the request.
Applying existing migrations for ApplicationDbContext may resolve this issue.`

At this point, follow the prompts, click the `Apply Migrations` button to automatically create the database.

See also: [ASP.NET Core Tutorials](https://docs.microsoft.com/en-us/aspnet/core/)

### dApp Requests

- The added dApp must be published on main net or test net.
- You need to add crucial dApp information, such as cover pictures, name, author, dApp description, mailbox, GitHub, ScriptHash.
- The cover image is uploaded to the NeoWeb \ wwwroot \ images \ dapps folder.
- The newly added item should be added to the end of the dApps list, otherwise the audit will not pass.
