# About this Website

The neo.org domain is owned by Neo Foundation and is used to showcase the Neo project and Neo ecology. This website is run by Neo Global Development (NGD). The website code is open source on GitHub, allowing community members to develop and modify.

The `release` branch is synchronized with the website.

### About the Browser

It is recommended to use one of the following browsers with the latest version of the systems below to browse this website:

- Microsoft Edge
- Google Chrome
- Firefox
- Safari
- iOS
- Android

We provide technical support to ensure that each browser runs the website smoothly when it is updated.

### Development Environment

This website uses `ASP.NET Core 9.0`. Developers need to run local debugging. Please first install the development environment:

- [Visual Studio 2022](https://visualstudio.microsoft.com/) - make sure `ASP.NET and Web Development` are installed.

- [.NET Core 9.0  SDK](https://dotnet.microsoft.com/download).

Visual Studio extension：WebCompiler 2022+, Bundler & Minifier 2022+

The project code does not contain the database. The first time running the website, the following prompt will appear:

`A database operation failed while processing the request.
Applying existing migrations for ApplicationDbContext may resolve this issue.`

At this point, follow the prompts, click the `Apply Migrations` button to automatically create the database.

See also: [ASP.NET Core Tutorials](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core)

### How to modify the Website Code

The overall process is as follows:

1. Fork this project to your own GitHub repository (so you have a copy on your own GitHub account).
2. Create a branch in your own repository (this time the origin will be your own fork, not the public one).
3. Modify the site code locally and complete the tests.
4. Commit the changes to your branch.
5. Push the changes to your main branch.
6. Create a Pull Request (PR) on GitHub (neo-project(release branch) ← your own GitHub).

When the PR is submitted, it will be reviewed and, if accepted, merged into the main branch, after which it is published to the official website.

### How to submit a Pull Request

- [Creating a pull request](https://help.github.com/articles/creating-a-pull-request/)

- [Creating a pull request from a fork](https://help.github.com/articles/creating-a-pull-request-from-a-fork/)

# 关于本网站 

neo.org 域名隶属于 Neo 基金会，网站用于展示 Neo 项目以及 Neo 生态。本网站由 Neo Global Development (NGD) 负责运营维护，网站代码在 GitHub 上开源，允许社区成员开发和修改。

`release` 分支是与网站同步的。

### 关于所使用的浏览器

推荐使用以下浏览器及系统最新版环境浏览本网站。

Microsoft Edge、Google Chrome、Firefox、Safari、iOS、Android

我们将全力提供技术支持,保证各浏览器更新后对于本网页的流畅访问。

### 开发环境

本网站使用 `ASP.NET Core 9.0`，开发者如需本地运行调试请先安装好开发环境。

[Visual Studio 2022](https://visualstudio.microsoft.com/) 安装时需要勾选 `ASP.NET 和 Web 开发` 。

[.NET Core 9.0 SDK](https://dotnet.microsoft.com/download)

Visual Studio 扩展：WebCompiler 2022+, Bundler & Minifier 2022+


项目代码不包含数据库，首次运行网站会提示：

A database operation failed while processing the request.

Applying existing migrations for ApplicationDbContext may resolve this issue.

此时按照提示操作，点击 `Apply Migrations` 按钮即可自动创建数据库。

附：[ASP.NET Core 简介](https://docs.microsoft.com/zh-cn/aspnet/core/introduction-to-aspnet-core)

### 如何修改网站的代码

总的流程如下：

1. Fork 这个项目到自己的 GitHub 仓库，相当于拷贝一份到自己的 GitHub 账户下
2. 将自己的库 Pull 下来（这时候 Origin 是自己的地址，不是公共地址）
3. 本地修改网站代码，并完成测试
4. 提交修改（Commit）
5. Push 到自己的 GitHub，也就是当前的 Origin 地址
6. 在 GitHub 上提交 Pull request（neo-project(release分支) ← Your GitHub）

提交 Pull request 后，管理员审核通过后，就会合并到主分支中，并且发布到官网。

### 如何提交 Pull request

- [Creating a pull request](https://help.github.com/articles/creating-a-pull-request/)
- [Creating a pull request from a fork](https://help.github.com/articles/creating-a-pull-request-from-a-fork/)
