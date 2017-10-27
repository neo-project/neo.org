# 关于本网站

本网站由 NEO Project 开发，由 NEO 理事会负责运营维护，网站代码在 GitHub 上开源，允许社区成员开发和修改。

### 关于所使用的浏览器

推荐使用以下浏览器及系统最新版环境浏览本网站。

Internet Explorer10以上、Microsoft Edge、Google Chrome、Firefox、Safari、iOS、Android

我们将全力提供技术支持,保证各浏览器更新后对于本网页的流畅访问。

### 开发环境

本网站使用 `ASP.NET Core 2.0`，开发者如需本地运行调试请先安装好开发环境。

[Visual Studio 2017](https://www.visualstudio.com) 安装时需要勾选 `ASP.NET 和 Web 开发`、`.NET Core 跨平台开发` 。

[.NET Core 2.0 SDK](https://www.microsoft.com/net/core)

项目代码不包含数据库，首次运行网站会提示：

A database operation failed while processing the request.

Applying existing migrations for ApplicationDbContext may resolve this issue.

此时按照提示操作，点击 `Apply Migrations` 按钮即可自动创建数据库。

附：[ASP.NET Core Tutorials](https://docs.microsoft.com/en-us/aspnet/core/)

### 如何修改网站的代码

总的流程如下：

1. Fork 这个项目到自己的 GitHub 仓库，相当于拷贝一份到自己的 GitHub 账户下
2. 将自己的库 Pull 下来（这时候 Origin 是自己的地址，不是公共地址）
3. 本地修改网站代码，并完成测试
4. 提交修改（Commit）
5. Push 到自己的 GitHub，也就是当前的 Origin 地址
6. 在 GitHub 上提交 Pull request（neo-project ← Your GitHub）

提交 Pull request 后，管理员审核通过后，就会合并到主分支中，并且发布到官网。若有疑问，可以发邮件到 chris@neo.org

### 如何提交 Pull request

- [Creating a pull request](https://help.github.com/articles/creating-a-pull-request/)
- [Creating a pull request from a fork](https://help.github.com/articles/creating-a-pull-request-from-a-fork/)