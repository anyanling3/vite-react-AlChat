import React from 'react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

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
            <div style={{ order: role === 'user' ? 1 : 2, flex: 1, display: 'flex', flexDirection: 'column', alignItems: role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={styles.senderName}>{senderInfo.name}</div>
                <div style={{
                    ...styles.messageItem,
                    ...(role === 'user' ? styles.userMessage : styles.aiMessage)
                }}>
                    {role === 'assistant' ? (
                        <ReactMarkdown>{content}</ReactMarkdown>
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
    styleSheet.insertRule(keyFrames, styleSheet.cssRules.length);
} catch (e) {
    console.warn("Could not insert keyframe rule", e);
}

export default MessageItem;