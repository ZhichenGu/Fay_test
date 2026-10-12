# Brainstream 开场本地复现

范围：加载与标题 → Enter → 耳机提示 → 箭头 → 2033 年背景介绍 → 箭头 → 当日介绍 → 箭头 → Instructions。到此永久停留，保留原有光标、线条变形、背景动态与开场交互声音。

## 运行

当前预览：http://127.0.0.1:8765/

本项目是静态网站，无需 npm 安装或构建。以后可双击同目录的 `start.command`，再打开上面的地址。或在本目录运行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

如果提示端口已占用，通常意味着已有预览正在运行，直接打开即可。不要用 file:// 双击 index.html，浏览器会限制音频与动画资源的读取。声音在首次用户操作后启动；离开标签页时原引擎会降低/暂停声音。刷新从标题重新开始。

## 文件与后续创作

- `index.html`：页面容器与顶部导航。
- `local.css`：本地顶部栏与少量适配样式。
- `local.js`：开场状态、完成事件及后续接入接口。
- `data/timeline.json`：限定的五个开场状态及转场时长。
- `data/presets.json`：相应画面与声音参数。
- `assets/`：本地资源。
- `vendor/brainstream-engine.js`：复用并适配的原渲染引擎，具体修改见旁边的 ADAPTATIONS.md。

未来可以在 `local.js` 或新建的独立模块中监听终点事件：

```js
window.addEventListener('brainstream:ready-for-continuation', () => {
  // 此时 Instructions 已进入，后续内容由你的新模块接管。
  // 本次没有自动启动任何后续内容。
});
```

`window.BrainstreamOpening.state` 依次为 title / headphones / context / date / instructions。终点时 `locked === true`。`restart()` 重新开始；`continueWith(callback)` 只在已到终点时执行你提供的函数，并传入渲染器与音频控制器。该接口不会自动解除原时间线的停止限制；应挂载自己的原创内容，而不是恢复原作的后续叙事。

## 已知差异与范围

- 核心画面、转场和交互使用原作渲染逻辑及素材；随机变形与渐变随时间、指针位置变化，不保证任意一帧与附件逐像素一致。
- 顶部导航在本地重建。九宫格打开作品信息，FR 跳转原作法语网站；没有复现 NFB 作品目录。
- 原站在线参与者、后续选时长、倒计时、长篇叙事、社交分享与进度续播不在本次范围内。
- 附件中的会议浮窗未包含。
- 辅助信息页使用系统字体。核心手写文字没有字体替代。
- 已验证桌面 Chrome；尚未验证真实手机触控、Safari 或 Firefox。原引擎有移动布局分支，但不能将其视为已测试。
- 复用内容的出处见 SOURCES.md。后续原创时可逐步替换画面、音频和品牌元素。

检查记录见 `VERIFICATION.md`。
