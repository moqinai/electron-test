/*
 * @Author: lipengcheng
 * @Date: 2023-10-16 15:17:22
 * @LastEditTime: 2023-10-17 14:35:57
 * @Description: 
 */
//plugins\devPlugin.ts
import { ViteDevServer } from "vite";


export let devPlugin = () => {
  return {
    name: "dev-plugin",
    configureServer(server: ViteDevServer) {
      require("esbuild").buildSync({
        entryPoints: ["./src/main/mainEntry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/mainEntry.js",
        external: ["electron"],
        // 编译平台 platform 设置为 node，排除的模块 external 设置为 electron，正是这两个设置使我们在主进程代码中可以通过 import 的方式导入 electron 内置的模块。
      });
      server.httpServer.once("listening", () => {
        let { spawn } = require("child_process");
        let addressInfo = server.httpServer.address()
        // let httpAddress = `http://localhost:${addressInfo?.port}` // 本地调试用这个
        let httpAddress = `http://${addressInfo?.address}:${addressInfo?.port}`;
        let electronProcess = spawn(require("electron").toString(), ["./dist/mainEntry.js", httpAddress], {
          // 通过 Node.js child_process 模块的 spawn 方法启动 electron 子进程的
          // 可以使用spawn方法第三个参数的env属性附加环境变量
          cwd: process.cwd(), // cwd 属性用于设置当前的工作目录，process.cwd() 返回的值就是当前项目的根目录
          stdio: "inherit", // stdio 用于设置 electron 进程的控制台输出，这里设置 inherit 可以让 electron 子进程的控制台输出数据同步到主进程的控制台。
        });
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};

export let getReplacer = () => {
  // 把一些常用的 Node 模块和 electron 的内置模块提供给了 vite-plugin-optimizer 插件，以后想要增加新的内置模块只要修改这个方法即可
  let externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
  let result = {};
  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}');export { ${item} as default }`,
    });
  }
  result["electron"] = () => {
    let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
    return {
      find: new RegExp(`^electron$`),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
    };
  };
  return result;
};
