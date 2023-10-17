/*
 * @Author: lipengcheng
 * @Date: 2023-10-17 11:33:18
 * @LastEditTime: 2023-10-17 15:06:24
 * @Description: 
 */

import path from "path";
import fs from "fs";

class BuildObj {
  //编译主进程代码
  buildMain() {
    require("esbuild").buildSync({
      entryPoints: ["./src/main/mainEntry.ts"],
      bundle: true,
      platform: "node",
      minify: true, // 生成压缩后的代码
      outfile: "./dist/mainEntry.js",
      external: ["electron"],
    });
  }
  //为生产环境准备package.json
  preparePackageJson() {
    /* 用户安装我们的产品后，在启动我们的应用程序时，实际上是通过 Electron 启动一个 Node.js 的项目，所以我们要为这个项目准备一个 package.json 文件，
      这个文件是以当前项目的 package.json 文件为蓝本制作而成的。里面注明了主进程的入口文件，移除了一些对最终用户没用的配置节。
    */
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    let electronConfig = localPkgJson.devDependencies.electron.replace("^", "") // 删掉 Electron 的版本号前面的"^"符号
    localPkgJson.main = "mainEntry.js";
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.devDependencies = { electron: electronConfig };
    let tarJsonPath = path.join(process.cwd(), "dist", "package.json");
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
    fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"));
  }
  // 调用electron-builder提供的 API 以生成安装包
  buildInstaller() {
    let options = {
      config: {
        directories: {
          output: path.join(process.cwd(), "release"), // 指定安装包存放位置
          app: path.join(process.cwd(), "dist"), // 静态文件目录配置项
        },
        files: ["**"],
        extends: null,
        productName: "LPC", // 项目名，生成的安装文件的前缀名
        appId: "com.lpc.desktop", // 包名
        asar: true, // 是否需要把输出目录下的文件合并成一个 asar 文件。
        nsis: {
          oneClick: true, // 是否一键安装
          perMachine: true,
          // installerIcon: "./build/icons/aaa.ico", // 安装图标
          // uninstallerIcon: "./build/icons/bbb.ico", // 卸载图标
          allowToChangeInstallationDirectory: false, // 是否允许修改安装目录
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: "LpcDesktopName", // 图标名称
        },
        publish: [{ provider: "generic", url: "http://localhost:5173/" }],
      },
      project: process.cwd(),
    };
    return require("electron-builder").build(options);
  }
}
/* 
  electron-builder干了啥
  首先 electron-builder 会收集应用程序的配置信息。比如应用图标、应用名称、应用 id、附加资源等信息。有些配置信息可能开发者并没有提供，这时 electron-builder 会使用默认的值
  然后 electron-builder 会根据用户配置信息：asar 的值为 true 或 false，来判断是否需要把输出目录下的文件合并成一个 asar 文件。
  然后 electron-builder 会把 Electron 可执行程序及其依赖的动态链接库及二进制资源拷贝到安装包生成目录下的 win-ia32-unpacked 子目录内。
  然后 electron-builder 还会检查用户是否在配置信息中指定了 extraResources 配置项，如果有，则把相应的文件按照配置的规则，拷贝到对应的目录中。
  然后 electron-builder 会根据配置信息使用一个二进制资源修改器修改 electron.exe 的文件名和属性信息（版本号、版权信息、应用程序的图标等）。

  如果开发者在配置信息中指定了签名信息，那么接下来 electron-builder 会使用一个应用程序签名工具来为可执行文件签名。
  接着 electron-builder 会使用 7z 压缩工具，把子目录 win-ia32-unpacked 下的内容压缩成一个名为 yourProductName-1.3.6-ia32.nsis.7z 的压缩包。

  接下来 electron-builder 会使用 NSIS 工具生成卸载程序的可执行文件，这个卸载程序记录了 win-ia32-unpacked 目录下所有文件的相对路径，当用户卸载我们的应用时，卸载程序会根据这些相对路径删除我们的文件，同时它也会记录一些安装时使用的注册表信息，在卸载时清除这些注册表信息。
  最后 electron-builder 会使用 NSIS 工具生成安装程序的可执行文件，然后把压缩包和卸载程序当作资源写入这个安装程序的可执行文件中。当用户执行安装程序时，这个可执行文件会读取自身的资源，并把这些资源释放到用户指定的安装目录下。
*/
export let buildPlugin = () => {
  return {
    name: "build-plugin",
    closeBundle: () => {
      let buildObj = new BuildObj();
      buildObj.buildMain();
      buildObj.preparePackageJson();
      buildObj.buildInstaller();
    },
  };
};

