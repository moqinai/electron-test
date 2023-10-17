/*
 * @Author: lipengcheng
 * @Date: 2023-10-17 14:21:50
 * @LastEditTime: 2023-10-17 14:39:21
 * @Description: 
 */
import { protocol } from "electron";
import fs from "fs";
import path from "path";

// 为自定义的app协议提供特权
// 在主进程app ready前，通过 protocol 对象的 registerSchemesAsPrivileged 方法为名为 app 的 scheme 注册了特权（可以使用 FetchAPI、绕过内容安全策略等）
let schemeConfig = { standard: true, supportFetchAPI: true, bypassCSP: true, corsEnabled: true, stream: true };
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: schemeConfig }]);

export class CustomScheme {
  //根据文件扩展名获取mime-type
  private static getMimeType(extension: string) {
    let mimeType = "";
    if (extension === ".js") {
      mimeType = "text/javascript";
    } else if (extension === ".html") {
      mimeType = "text/html";
    } else if (extension === ".css") {
      mimeType = "text/css";
    } else if (extension === ".svg") {
      mimeType = "image/svg+xml";
    } else if (extension === ".json") {
      mimeType = "application/json";
    }
    return mimeType;
  }
  //注册自定义app协议
  static registerScheme() {
    // 在app ready之后，通过 protocol 对象的 handle 方法为名为 app 的 scheme 注册了一个回调函数。当我们加载类似app://index.html这样的路径时，这个回调函数将被执行。
    protocol.handle("app", (request) => {
      // 传入参数 request 和 callback，我们可以通过 request.url 获取到请求的文件路径，可以通过 callback 做出响应。
      let pathName = new URL(request.url).pathname;
      let extension = path.extname(pathName).toLowerCase();
      if (extension == '') {
        pathName = 'index.html'
        extension = '.html'
      }
      let tarFile = path.join(__dirname, pathName);
      return new Response(fs.readFileSync(tarFile), {
        headers: { "content-type": this.getMimeType(extension) }, // getMimeType方法 获取文件的content-type
        // data: fs.createReadStream(tarFile), // 为目标文件的可读数据流。
        status: 200
      })

      // callback({
      //   statusCode: 200,
      //   headers: { "content-type": this.getMimeType(extension) }, // getMimeType方法 获取文件的content-type
      //   data: fs.createReadStream(tarFile), // 为目标文件的可读数据流。
      // })
    })
  }
}
