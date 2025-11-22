// src/components/MessageList.jsx
import React, { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import '../styles/ChatStyles.css';

const MessageList = ({ messages }) => {
    const messagesEndRef = useRef(null);

    // 自动滚动到底部的逻辑
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 当消息列表更新时，执行滚动
    useEffect(() => {
        scrollToBottom();
    }, [messages]); // 依赖于 messages 数组的变化

    return (
        <div style={styles.messageList} className="custom-scrollbar">
            {messages.length > 0 ? (
                messages.map((message) => (
                    <MessageItem key={message.id} message={message} />
                ))
            ) : (
                <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                    开始对话吧...
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

const styles = {
    messageList: {
        flexGrow: 1, // 占据剩余空间
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px', // 消息之间的间距
        overflowX: 'hidden', // 隐藏水平滚动条
        // overflowY: 'auto',   // 关键：当内容超出时显示垂直滚动条
    },
};

export default MessageList;