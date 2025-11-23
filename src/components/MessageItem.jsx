import React from 'react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
// 代码块高亮模块
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';// oneLight 是另一个常用浅色主题
// 代码复制
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy } from '@icon-park/react';

const MessageItem = ({ message }) => {
    const { id, role, content, isLoading, timestamp } = message;
    // 确定发送者信息 
    const senderInfo = role === 'user' ? { name: '我', avatar: 'U' } : { name: 'AI 助手', avatar: '🤖' };

    if (isLoading) {
        return (
            <div style={{ ...styles.messageRow, ...(role === 'user' ? styles.userRow : styles.aiRow) }}>
                <div style={{
                    ...styles.avatar,
                    ...(role === 'user' ? styles.userAvatar : styles.aiAvatar)
                }}>{senderInfo.avatar}</div>
                <div>
                    <div style={styles.senderName}>{senderInfo.name}</div>
                    <div style={{ ...styles.messageItem, ...styles.aiMessage }}>
                        <div style={styles.loadingDots}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ ...styles.messageRow, ...(role === 'user' ? styles.userRow : styles.aiRow) }}>
            <div style={{
                ...styles.avatar,
                ...(role === 'user' ? styles.userAvatar : styles.aiAvatar),
                order: role === 'user' ? 2 : 1, // 用户头像排最后（靠右），AI头像排最前（靠左）
                backgroundColor: role === 'user' ? '#4532fd' : '#eee',
                color: role === 'user' ? 'white' : 'black', // 用户头像文字为白色
            }}>{senderInfo.avatar}</div>
            <div style={{
                order: role === 'user' ? 1 : 2, flex: 1,
                display: 'flex', flexDirection: 'column',
                alignItems: role === 'user' ? 'flex-end' : 'flex-start'
            }}>
                <div style={styles.senderName}>{senderInfo.name}</div>
                <div style={{
                    ...styles.messageItem,
                    ...(role === 'user' ? styles.userMessage : styles.aiMessage)
                }}>
                    {role === 'assistant' ? (
                        <ReactMarkdown
                            children={content} // 使用 children prop
                            remarkPlugins={[remarkGfm]} // 启用 GFM
                            components={{
                                // 自定义表格相关元素样式
                                table({ node, ...props }) {
                                    return (
                                        <div style={{ overflowX: 'auto', width: '100%' }}> {/* 为了防止表格溢出容器 */}
                                            <table style={markdownStyles.table} {...props} />
                                        </div>
                                    );
                                },
                                thead({ node, ...props }) {
                                    return <thead style={markdownStyles.thead} {...props} />;
                                },
                                tbody({ node, ...props }) {
                                    return <tbody style={markdownStyles.tbody} {...props} />;
                                },
                                tr({ node, ...props }) {
                                    return <tr style={markdownStyles.tr} {...props} />;
                                },
                                th({ node, ...props }) {
                                    return <th style={markdownStyles.th} {...props} />;
                                },
                                td({ node, ...props }) {
                                    return <td style={markdownStyles.td} {...props} />;
                                },
                                // 自定义代码块渲染
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const language = match && match[1] ? match[1] : ''; // 提取语言或设为空
                                    const codeString = String(children).replace(/\n$/, ''); // 获取代码字符串

                                    if (!inline && language) {
                                        // 是块级代码且有语言
                                        return (
                                            <div style={codeBlockStyles.container}>
                                                {/* 代码块标题栏 */}
                                                <div style={{ ...codeBlockStyles.header, marginBottom: 0 }}>
                                                    <span style={codeBlockStyles.languageLabel}>
                                                        {language.charAt(0).toUpperCase() + language.slice(1)} {/* 首字母大写 */}
                                                    </span>
                                                    {/*复制按钮 */}
                                                    <CopyToClipboard
                                                        text={codeString}
                                                        onCopy={() => {
                                                            toast.success('代码已复制到剪贴板！');
                                                        }}
                                                    >
                                                        <button
                                                            style={{
                                                                ...codeBlockStyles.copyButton,
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(189, 147, 249, 0.2)',
                                                                    borderColor: '#ff79c6',
                                                                },
                                                                '&:focus': {
                                                                    outline: '2px solid #ff79c6',
                                                                    outlineOffset: '1px',
                                                                }
                                                            }}
                                                            aria-label="复制代码"
                                                        >
                                                            {/* 使用 IconPark 图标 */}
                                                            <Copy theme="outline" size="16" fill="#bd93f9" />
                                                        </button>
                                                    </CopyToClipboard>
                                                </div>
                                                {/* 语法高亮的代码主体 */}
                                                <SyntaxHighlighter
                                                    {...props}
                                                    children={codeString}
                                                    style={oneDark}
                                                    language={language}
                                                    PreTag="div" // SyntaxHighlighter 内部会生成 pre 标签
                                                />
                                            </div>
                                        );
                                    } else {
                                        // 行内代码或未指定语言的块级代码
                                        return (
                                            <code {...props} className={className} style={{ ...props.style, ...codeBlockStyles.inlineCode }}>
                                                {children}
                                            </code>
                                        );
                                    }
                                }
                            }}
                        />
                    ) : (
                        <div>{content}</div>
                    )}
                </div>
                {/* 显示时间戳 */}
                {timestamp && (
                    <div style={styles.timestamp}>
                        {format(new Date(timestamp), 'MM/dd HH:mm', { locale: zhCN })}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    // 消息行的整体布局
    messageRow: {
        display: 'flex',
        marginBottom: '10px',
        width: '100%',
    },
    userRow: {
        justifyContent: 'flex-end', // 用户消息靠右
    },
    aiRow: {
        justifyContent: 'flex-start', // AI 消息靠左
    },
    //头像样式 
    avatar: {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: '#eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        flexShrink: 0, // 防止头像被压缩
    },
    // 分别为用户和AI头像设置边距
    aiAvatar: {
        marginRight: '10px',
    },
    userAvatar: {
        marginLeft: '10px',
    },
    // 发送者名称样式 
    senderName: {
        fontSize: '12px',
        color: '#666',
        marginBottom: '2px',
        paddingLeft: '5px', // 名称左边距
        paddingRight: '5px', // 名称右边距
    },
    messageItem: {
        maxWidth: '70%',
        padding: '10px 15px',
        borderRadius: '8px',
        wordWrap: 'break-word',
        lineHeight: 1.5,
        position: 'relative', // 为可能的内部绝对定位元素做准备
    },
    // 用户消息样式
    userMessage: {
        backgroundColor: '#f5f7ff',
        // color: 'black', 
    },
    // AI 消息样式 
    aiMessage: {
        backgroundColor: '#fff',
        // color: 'black', 
    },

    loadingDots: {
        display: 'flex',
        alignItems: 'center',
    },

    dot: {
        width: '8px',
        height: '8px',
        backgroundColor: '#999',
        borderRadius: '50%',
        margin: '0 2px',
        animation: 'bounce 1.5s infinite',

    },
    timestamp: {
        fontSize: '10px',
        color: '#999',
        textAlign: 'right', // 时间戳靠右对齐
        marginTop: '4px',
        paddingRight: '10px', // 右侧内边距
    },

};
const markdownStyles = {
    table: {
        borderCollapse: 'collapse', // 合并边框
        width: '100%',
        marginBottom: '1em', // 表格下方间距
        // boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // 可选：添加阴影
    },
    thead: {
        // 可以为表头添加特殊样式，这里暂不添加
    },
    tbody: {
        // 可以为表体添加特殊样式，这里暂不添加
    },
    tr: {
        // &:nth-child(even) { backgroundColor: "#f9f9f9"; } // 可选：斑马纹效果
    },
    th: {
        backgroundColor: '#f2f2f2', // 浅灰色背景
        color: '#333', // 深色文字
        fontWeight: 'bold',
        padding: '10px 12px',
        textAlign: 'left',
        borderBottom: '2px solid #ddd', // 底部粗线
        borderRight: '1px solid #ddd', // 右侧细线
        '&:last-child': { // 最后一列去除右边框
            borderRight: 'none',
        }
    },
    td: {
        padding: '8px 12px',
        borderBottom: '1px solid #ddd', // 底部细线
        borderRight: '1px solid #ddd', // 右侧细线
        verticalAlign: 'top', // 内容顶部对齐
        '&:last-child': { // 最后一列去除右边框
            borderRight: 'none',
        }
    }
};
// 定义代码块及其子元素的样式 
const codeBlockStyles = {
    container: {
        borderRadius: '6px',
        overflow: 'hidden', // 确保子元素圆角被裁剪
        marginBottom: '1em', // 与其他段落的间距
        border: '1px solid #44475a', // 与 oneDark 主题色调协调的边框
        backgroundColor: '#282a36',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 10px',
        backgroundColor: '#282a36', // 与 oneDark 背景色相近或稍浅
        color: '#f8f8f2', // 与 oneDark 文字色相近
        fontSize: '14px',
        // fontFamily: 'monospace', // 使用等宽字体
    },
    languageLabel: {
        fontWeight: 'bold',
    },
    copyButton: {
        backgroundColor: 'transparent',
        color: '#bd93f9',
        border: '1px solid #bd93f9',
        borderRadius: '4px',
        padding: '4px 4px', // 微调内边距
        cursor: 'pointer',
        fontSize: '12px',
        transition: 'all 0.2s ease-in-out', // 添加过渡效果
        display: 'flex', // 使用 Flexbox 使图标居中
        alignItems: 'center',
        justifyContent: 'center',

        '&:hover': {
            backgroundColor: 'rgba(189, 147, 249, 0.2)', // 半透明紫色背景
            borderColor: '#ff79c6', // 边框颜色变化
        },
        '&:focus': {
            outline: '2px solid #ff79c6', // 聚焦时轮廓
            outlineOffset: '1px',
        }
    },
    // 行内代码样式
    inlineCode: {
        backgroundColor: '#f6f8fa', // 浅灰色背景
        padding: '2px 4px',
        borderRadius: '3px',
        border: '1px solid #d1d5da', // 浅灰色边框
        fontSize: '85%', // 稍小的字体
        fontFamily: 'monospace', // 等宽字体
    }
};

// 确保动画样式存在
const styleSheet = document.styleSheets[0];
const keyFrames = `
  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1.0);
    }
  }
`;

try {
    if (styleSheet && styleSheet.cssRules) {
        styleSheet.insertRule(keyFrames, styleSheet.cssRules.length);
    } else {
        // Fallback: create a new style element if needed
        const style = document.createElement('style');
        style.innerHTML = keyFrames;
        document.head.appendChild(style);
    }
} catch (e) {
    console.warn("Could not insert keyframe rule", e);
}

export default MessageItem;