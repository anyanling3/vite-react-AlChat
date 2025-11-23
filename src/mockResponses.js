// src/mockResponses.js

/**
 * 模拟 AI 回复数据
 * 每个对象代表一种可能的回复类型
 */
const mockResponses = [
    {
        id: 1,
        type: "greeting",
        content: "你好！我是你的 AI 助手。我可以帮助你解答问题、提供信息或协助处理任务。有什么我可以帮你的吗？"
    },
    {
        id: 2,
        type: "markdown_example",
        content: `### Markdown 示例

欢迎来到 Markdown 世界！

**这里是粗体文本**, *这里是斜体文本*。

#### 列表示例:

- 项目一
- 项目二
  - 子项目 A
  - 子项目 B
- 项目三

#### 链接与图片:

访问 [Google](https://www.google.com) 获取更多信息。
![React Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/120px-React-icon.svg.png)

#### 引用:

> 这是一段引用的文字。

#### 行内代码:

你可以使用 \`console.log()\` 来打印信息。

#### 代码块 (JavaScript):

\`\`\`javascript
function greet(name) {
  return 'Hello, ' + name + '!';
}

console.log(greet('World'));
\`\`\`

#### 代码块 (Python):

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
\`\`\`
`
    },
    {
        id: 3,
        type: "list_response",
        content: `以下是关于 React 的一些要点：

1. **组件化**: React 应用由一个个独立的组件构成。
2. **JSX**: 一种 JavaScript 的语法扩展，允许 HTML 写法。
3. **虚拟 DOM**: 提高渲染性能的关键技术。
4. **单向数据流**: 数据从父组件流向子组件。
5. **生态系统**: 拥有丰富的库和工具支持。`
    },
    {
        id: 4,
        type: "code_block_only",
        content: `下面是一个简单的排序算法实现：

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_numbers = bubble_sort(numbers)
print("排序后的数组:", sorted_numbers)
\`\`\``
    },
    {
        id: 5,
        type: "link_list",
        content: `这里有一些有用的资源链接：

- [MDN Web Docs](https://developer.mozilla.org/)
- [React 官方文档](https://react.dev/)
- [Node.js 官网](https://nodejs.org/)
- [GitHub](https://github.com/)
`
    },
    {
        id: 6,
        type: "long_text",
        content: `这是一个比较长的回复示例。它旨在测试消息气泡在容纳大量文本时的表现。

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
`
    },
    {
        id: 7,
        type: "short_acknowledgement",
        content: "明白了。"
    },
    {
        id: 8,
        type: "thinking",
        content: "让我想想..."
    },
    {
        id: 9,
        type: "error_simulation",
        content: "抱歉，我在处理你的请求时遇到了一个小问题。请再试一次，或者换个方式问我。"
    },
    {
        id: 10,
        type: "table_example", // Markdown 表格
        content: `| 特性       | 描述                     | 是否支持 |
|------------|--------------------------|----------|
| Markdown   | 轻量级标记语言           | ✅ 是     |
| 代码高亮   | 语法着色                 | ✅ 是 (需配置) |
| 表格       | 结构化数据展示           | ✅ 是     |
| 流程图     | 需要扩展插件 (如 Mermaid) | ❌ 否     |`
    }
];

export default mockResponses;