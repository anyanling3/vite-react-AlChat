import React, { useState, useEffect, useRef } from 'react';
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
// 引入 IconPark 图标
import { Copy, Redo } from '@icon-park/react';
import { ROLE_USER, ROLE_ASSISTANT } from '../types';

// 打字机效果常量 q
const STREAMING_SPEED = 20; // 毫秒/字符

const MessageItem = ({ message, onRegenerate }) => {
    const { id, role, content, isLoading, timestamp, streamedContent = '' } = message;
    // 确定发送者信息
    const senderInfo = role === 'user' ? { name: '我', avatar: 'U' } : { name: 'AI 助手', avatar: '🤖' };

    // 用于控制打字机效果的状态 ---
    const [displayedContent, setDisplayedContent] = useState('');
    const displayTimerRef = useRef(null); // <-- 使用 ref 来存储定时器 ID

    // 处理打字机效果的副作用 ---
    useEffect(() => {
        // 清除之前的定时器，防止累积
        if (displayTimerRef.current) {
            clearTimeout(displayTimerRef.current);
            displayTimerRef.current = null;
        }

        let isActive = true; // 用于防止组件卸载后的状态更新

        // 如果是 AI 消息，且不在 loading 状态，并且有 streamedContent 需要显示
        if (role === ROLE_ASSISTANT && !isLoading && streamedContent) {

            const typeNextCharacter = () => {
                // 再次检查组件是否仍然挂载
                if (!isActive) return;

                setDisplayedContent(prevContent => {
                    const nextIndex = prevContent.length + 1;
                    const newContent = streamedContent.substring(0, nextIndex);

                    // 如果还有内容要显示，则安排下一次更新
                    if (nextIndex < streamedContent.length) {
                        displayTimerRef.current = setTimeout(typeNextCharacter, STREAMING_SPEED);
                    }

                    return newContent;
                });
            };

            // 启动第一个定时器，仅当当前显示内容少于待显示内容时
            if (displayedContent.length < streamedContent.length) {
                displayTimerRef.current = setTimeout(typeNextCharacter, STREAMING_SPEED);
            }
        }

        // 清理函数：组件卸载时清除定时器并设置 isActive 为 false
        return () => {
            isActive = false;
            if (displayTimerRef.current) {
                clearTimeout(displayTimerRef.current);
                displayTimerRef.current = null;
            }
        };
    }, [streamedContent, role, isLoading]); // 依赖项主要是 streamedContent, role, isLoading

    // 如果消息加载完成并且没有 streamedContent (可能是旧的非流式消息或错误情况)，则直接显示 content 
    useEffect(() => {

        if (role === ROLE_ASSISTANT && !isLoading && !streamedContent && content) {
            setDisplayedContent(content); // 直接显示完整内容
        }

        if (role === ROLE_ASSISTANT && !isLoading && !streamedContent && !content) {
            // 如果两者都为空，可能是个占位符或特殊情况，可以留空或显示默认文本
            setDisplayedContent(""); // 默认已经是空的
        }
    }, [role, isLoading, streamedContent, content]); // 依赖项


    // Loading 状态的渲染
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

    // AI 消息内容渲染逻辑 
    const renderAiContent = () => {
        // 优先渲染正在流式传输的内容 (displayedContent)
        const contentToShow = displayedContent || content || '';

        return (
            <ReactMarkdown
                children={contentToShow} // 使用正在显示的内容
                remarkPlugins={[remarkGfm]}
                components={{
                    table({ node, ...props }) {
                        return (
                            <div style={{ overflowX: 'auto', width: '100%' }}>
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
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match && match[1] ? match[1] : '';
                        const codeString = String(children).replace(/\n$/, '');

                        if (!inline && language) {
                            return (
                                <div style={codeBlockStyles.container}>
                                    <div style={{ ...codeBlockStyles.header, marginBottom: 0 }}>
                                        <span style={codeBlockStyles.languageLabel}>
                                            {language.charAt(0).toUpperCase() + language.slice(1)}
                                        </span>
                                        <CopyToClipboard
                                            text={codeString}
                                            onCopy={() => {
                                                toast.success('代码已复制到剪贴板！');
                                            }}
                                        >
                                            <button
                                                style={codeBlockStyles.copyButton}
                                                aria-label="复制代码"
                                            >
                                                <Copy theme="outline" size="16" fill="#bd93f9" />
                                            </button>
                                        </CopyToClipboard>
                                    </div>
                                    <SyntaxHighlighter
                                        {...props}
                                        children={codeString}
                                        style={oneDark}
                                        language={language}
                                        PreTag="div"
                                    />
                                </div>
                            );
                        } else {
                            return (
                                <code {...props}
                                    className={className}
                                    style={{ ...props.style, ...codeBlockStyles.inlineCode }}
                                >
                                    {children}
                                </code>
                            );
                        }
                    }
                }}
            />
        );
    };



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
                    {/* --- 修改：根据角色渲染不同内容 --- */}
                    {role === 'assistant' ? (
                        renderAiContent() // 调用新的 AI 内容渲染函数
                    ) : (
                        // 用户消息保持原样，但应用 whitespace 样式
                        <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
                    )}
                </div>
                {/* AI 消息的快捷操作按钮 */}
                {role === 'assistant' && (
                    <div style={styles.actionButtonsContainer}>
                        {/* 复制内容按钮 */}
                        <CopyToClipboard
                            text={content}
                            onCopy={() => toast.success('消息内容已复制到剪贴板！')}
                        >
                            <button
                                style={styles.actionButton}
                                aria-label="复制内容"
                            >
                                <Copy theme="outline" size="16" fill="#666" />
                                <span style={styles.actionButtonText}>复制</span>
                            </button>
                        </CopyToClipboard>

                        {/* --- 修改按钮：使用 Redo 图标 --- */}
                        <button
                            style={styles.actionButton}
                            onClick={() => {
                                console.log("Regenerate button clicked for message ID:", id);
                                console.log("onRegenerate function:", onRegenerate); // 调试日志
                                if (onRegenerate) { // 检查函数是否存在
                                    onRegenerate(id); // 调用父组件传递的函数
                                } else {
                                    console.error("onRegenerate function is not passed correctly to MessageItem!");
                                    toast.error("重新生成功能暂时不可用");
                                }
                            }}
                            aria-label="重新生成"
                            disabled={isLoading} // 如果正在加载，禁用按钮
                        >
                            {/* 使用 Redo 组件替换原来的 Refresh */}
                            <Redo theme="outline" size="16" fill="#666" /> {/* <--- 修改点 2 */}
                            <span style={styles.actionButtonText}>重新生成</span>
                        </button>
                    </div>
                )}
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
    actionButtonsContainer: {
        display: 'flex',
        gap: '10px', // 按钮之间的间距
        marginTop: '5px', // 与消息内容的间距
        alignSelf: 'flex-start', // 靠左对齐
    },
    actionButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px', // 图标和文字的间距
        padding: '4px 8px',
        fontSize: '12px',
        color: '#666',
        backgroundColor: 'transparent',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: '#f5f5f5',
            borderColor: '#bbb',
        },
        '&:focus': {
            outline: '2px solid #007bff',
            outlineOffset: '1px',
        }
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