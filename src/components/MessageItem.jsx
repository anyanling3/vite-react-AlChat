import React from 'react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
// 代码块高亮模块
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';// oneLight 是另一个常用浅色主题
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
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            {...props}
                                            children={String(children).replace(/\n$/, '')} // 移除末尾换行符
                                            style={oneDark} // 应用主题
                                            language={match[1]} // 提取语言类型
                                            PreTag="div" // 使用 div 包裹 pre 标签，有时有助于样式
                                        />
                                    ) : (
                                        // 行内代码或未指定语言的代码块
                                        <code {...props} className={className}>
                                            {children}
                                        </code>
                                    );
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