// src/components/ChatContainer.jsx
import React, { useState } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { ROLE_USER, ROLE_ASSISTANT } from '../types';

const ChatContainer = () => {
    // 状态：存储所有消息
    const [messages, setMessages] = useState([]);
    // 状态: AI 是否正在等待响应
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    // 处理发送消息的逻辑
    const handleSendMessage = (content) => {
        // 空消息或者等待响应时不能发送
        if (!content.trim() || isWaitingForResponse) return;
        //发送前设置等待状态
        setIsWaitingForResponse(true);
        // 1. 创建用户消息对象
        const userMessage = {
            id: Date.now().toString(), // 简单生成唯一ID
            role: ROLE_USER,
            content: content,
            timestamp: Date.now(),
        };

        // 2. 更新消息列表，添加用户消息
        setMessages(prevMessages => [...prevMessages, userMessage]);

        // 3. 模拟 AI 响应 (稍后会改进)
        // 先添加一个 loading 状态的 AI 消息
        const aiLoadingMessage = {
            id: `loading-${Date.now()}`,
            role: ROLE_ASSISTANT,
            content: '', // 内容为空表示加载中
            timestamp: Date.now(),
            isLoading: true // 添加一个标志位
        };
        setMessages(prevMessages => [...prevMessages, aiLoadingMessage]);

        // 模拟网络延迟后，替换 loading 消息为实际回复
        setTimeout(() => {
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === aiLoadingMessage.id
                        ? {
                            ...msg,
                            isLoading: false, // 设置成功状态
                            // --- 修改：在冒号后添加 \n ---
                            content: `这是 AI 的回复:\n${content}...`
                            // --- ---
                        }
                        : msg
                )
            );
            // 收到完整回复后，重置等待状态
            setIsWaitingForResponse(false);
        }, 1000); // 1秒延迟
    };

    return (
        <div style={styles.chatContainer}>
            <h2 style={{ textAlign: 'center', padding: '10px', margin: 0, borderBottom: '1px solid #eee' }}>AI 助手</h2>
            {/* 消息列表区域 */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexGrow: 1,
                overflow: 'hidden'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '1000px',
                    display: 'flex',
                    flexDirection: 'column',
                    //height: '100%'
                }}>
                    <MessageList messages={messages} />
                    {/* 输入区域 */}
                    <InputArea onSend={handleSendMessage} isDisabled={isWaitingForResponse} />
                </div>
            </div>
        </div>
    );
};

// 简单的内联样式
const styles = {
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '98vh', // 至少占满整个视口高度
        width: '96vw', // 占满整个视口宽度
        margin: '0 auto', // 居中 (虽然宽度100%没效果，但保留语义)
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
};

export default ChatContainer;