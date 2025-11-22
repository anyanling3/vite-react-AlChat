import React from 'react';
import { ROLE_USER, ROLE_ASSISTANT } from '../types';

const MessageItem = ({ message }) => {
    const { role, content, isLoading } = message;

    // 根据角色决定样式
    const isUser = role === ROLE_USER;
    const bubbleStyle = isUser ? styles.userBubble : styles.aiBubble;
    const containerStyle = isUser ? styles.userContainer : styles.aiContainer;
    const avatarSrc = isUser ? 'https://api.dicebear.com/7.x/miniavs/svg?seed=1' : 'https://api.dicebear.com/7.x/bottts/svg?seed=2'; // 使用 DiceBear 生成随机头像

    return (
        <div style={containerStyle}>
            {/* 头像 */}
            <img src={avatarSrc} alt={`${role} avatar`} style={styles.avatar} />

            {/* 消息气泡 */}
            <div style={bubbleStyle}>
                {/* 角色名称 */}
                <div style={styles.roleName}>{isUser ? 'You' : 'AI Assistant'}</div>

                {/* 消息内容 */}
                <div style={styles.content}>
                    {isLoading ? (
                        <span style={{ fontStyle: 'italic', color: '#999' }}>AI 正在思考...</span>
                    ) : (
                        content
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    // 用户消息容器 (靠右)
    userContainer: {
        display: 'flex',
        justifyContent: 'flex-start',   //靠右
        alignItems: 'flex-start',
        flexDirection: 'row-reverse', // 反转顺序：气泡 -> 头像
    },
    // AI 消息容器 (靠左)
    aiContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start', // 顶部对齐
    },
    // 头像样式
    avatar: {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        margin: '0 0 4px 10px',
    },
    // 用户气泡样式
    userBubble: {
        backgroundColor: '#f5f7ff',
        color: '#222',
        padding: '8px 10px',
        borderRadius: '8px 4px 8px 8px', // 圆角，右下角尖角
        maxWidth: '70%',
        wordWrap: 'break-word', // 长单词换行
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',

    },
    // AI 气泡样式
    aiBubble: {
        backgroundColor: '#fff',
        color: '#222',
        border: '1px solid #eee',
        padding: '8px 10px',
        margin: '0 0 0 10px',
        borderRadius: '4px 8px 8px 8px', // 圆角，左下角尖角
        maxWidth: '70%',
        wordWrap: 'break-word', // 长单词换行
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
    // 角色名称
    roleName: {
        fontSize: '0.8em',
        fontWeight: 'bold',
        marginBottom: '4px',
        opacity: 0.8,
    },
    // 消息内容
    content: {
        fontSize: '1em',
        lineHeight: '1.4',
    },
};

export default MessageItem;