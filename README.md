# Chat Application with Code Highlighting and Copy Functionality

## 整体设计思路

本项目旨在创建一个具备代码高亮显示和复制功能的聊天应用。它不仅支持文本消息的发送与接收，还能够对代码片段进行语法高亮，并提供一键复制到剪贴板的功能。为了增强用户体验，当用户复制代码时，会通过全局提示告知操作结果。

### 技术实现相关方案梳理

#### 核心功能
- **消息展示**：采用Markdown格式展示文本和代码内容，使得消息更加丰富。
- **代码高亮**：使用`react-syntax-highlighter`库为代码块添加语法高亮，支持多种编程语言。
- **复制代码**：集成`react-copy-to-clipboard`插件，允许用户轻松地将代码复制到剪贴板中，并通过`react-toastify`提供即时反馈。

#### AI辅助实践思路（如果适用）
在本项目中，虽然没有直接涉及到AI辅助开发的具体案例，但假设未来有计划引入AI助手来自动化某些流程或优化用户体验，则可能考虑以下几点：
- 利用自然语言处理技术理解用户的查询意图，从而提供更智能的回答。
- 通过机器学习算法分析用户行为模式，以个性化推荐相关内容或者改进UI/UX设计。

### 技术选型

- **渲染层（DOM）**：标准HTML DOM结合React组件化思想构建界面。
- **核心框架**：React v19.1作为前端框架，提供了强大的组件管理和状态管理能力。
- **其他依赖**：
  - `react-markdown`用于解析并渲染Markdown格式的消息。
  - `remark-gfm`支持GitHub Flavored Markdown特性。
  - `react-syntax-highlighter`负责代码块的语法高亮。
  - `react-toastify`用于全局提示信息。
  - `react-copy-to-clipboard`简化了复制文本的操作。

## 快速运行项目的方法

### 前置条件
确保你的环境中已经安装了Node.js (建议版本>=14.x) 和 npm 或 yarn。

### 步骤
1. 克隆仓库至本地：
   ```bash
   git clone https://github.com/[your-repo-name].git
   cd [your-repo-name]
