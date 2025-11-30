// src/components/ChatContainer.jsx
import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { ROLE_USER, ROLE_ASSISTANT } from '../types';
import mockResponses from '../mockResponses';
import { toast } from 'react-toastify';

const ChatContainer = () => {
    // 状态：存储所有消息
    const [messages, setMessages] = useState([]);
    // 状态: AI 是否正在等待响应
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    // 定义 localStorage 键名 
    const LOCAL_STORAGE_KEY = 'chat_messages';

    // useEffect 用于加载和保存消息
    useEffect(() => {
        // 1. 组件挂载时，尝试从 localStorage 加载消息
        const savedMessages = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages);
                // 可选：验证加载的数据结构是否符合预期
                if (Array.isArray(parsedMessages)) {
                    setMessages(parsedMessages);
                    console.log("Messages loaded from localStorage");
                } else {
                    console.warn("Invalid data format in localStorage for key:", LOCAL_STORAGE_KEY);
                }
            } catch (error) {
                console.error("Failed to parse messages from localStorage:", error);
                // 如果解析失败，可以选择清空无效数据或使用默认空数组
                // localStorage.removeItem(LOCAL_STORAGE_KEY); // 可选：清除损坏的数据
            }
        }
        // 依赖数组为空，只在组件挂载时执行一次
    }, []);

    // 2. 当 messages 状态改变时，保存到 localStorage
    useEffect(() => {
        try {
            // 只保存非 Loading 状态的消息
            // 过滤掉临时的 loading 消息，避免保存不必要的状态
            const messagesToSave = messages.filter(msg => !msg.isLoading);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messagesToSave));
            console.log("Messages saved to localStorage");
        } catch (error) {
            console.error("Failed to save messages to localStorage:", error);
            // 如果存储空间满了或其他原因导致保存失败，可以选择通知用户
        }

        // 依赖数组包含 messages，每当 messages 变化时都会执行
    }, [messages]);
    const updateMessages = (newMessagesOrUpdater) => {
        setMessages(newMessagesOrUpdater);
    };

    // 处理发送消息的逻辑
    const handleSendMessage = async (content) => {
        // 空消息或者等待响应时不能发送
        if (!content.trim() || isWaitingForResponse) return;

        //发送前设置等待状态
        setIsWaitingForResponse(true);

        // 创建用户消息对象
        const userMessage = {
            id: Date.now().toString(), // 简单生成唯一ID
            role: ROLE_USER,
            content: content,
            timestamp: Date.now(),
        };

        // 更新消息列表，添加用户消息
        updateMessages(prevMessages => [...prevMessages, userMessage]);

        // 创建一个带有 streamedContent 的初始 AI 消息
        const aiStreamingMessage = {
            id: `streaming-${Date.now()}`,
            role: ROLE_ASSISTANT,
            content: '', // 最终完整内容，流式结束后填充
            streamedContent: '', // 当前正在流式传输的内容
            timestamp: Date.now(),
            isLoading: false
        };
        updateMessages(prevMessages => [...prevMessages, aiStreamingMessage]);

        try {
            // 1. 获取模拟回复
            const randomIndex = Math.floor(Math.random() * mockResponses.length);
            const selectedResponse = mockResponses[randomIndex];
            const fullResponseText = `这是 AI 的回复:\n\n${selectedResponse.content}`;

            // 2. 模拟流式接收
            await simulateStreamingResponse(aiStreamingMessage.id, fullResponseText);

        } catch (error) {
            console.error("Error during streaming simulation:", error);
            // 处理错误，例如显示错误消息
            updateMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === aiStreamingMessage.id
                        ? { ...msg, streamedContent: "抱歉，回复时出现了错误。", content: "抱歉，回复时出现了错误。" }
                        : msg
                )
            );
        } finally {
            setIsWaitingForResponse(false);
        }
    };

    // 模拟流式响应的辅助函数
    const simulateStreamingResponse = (messageId, fullText) => {
        return new Promise((resolve) => { // 返回 Promise 以便 await
            let index = 0;
            const interval = setInterval(() => {
                if (index <= fullText.length) {
                    const currentChunk = fullText.substring(0, index);
                    updateMessages(prevMessages =>
                        prevMessages.map(msg =>
                            msg.id === messageId
                                ? { ...msg, streamedContent: currentChunk }
                                : msg
                        )
                    );
                    index++;
                } else {
                    // 流式传输完成
                    clearInterval(interval);
                    // 更新最终的 content 字段
                    updateMessages(prevMessages =>
                        prevMessages.map(msg =>
                            msg.id === messageId
                                ? { ...msg, content: fullText } // 设置最终内容
                                : msg
                        )
                    );
                    resolve(); // 解析 Promise
                }
            }, 20); // 每 20ms 发送一个字符，模拟流速
        });
    };
    // 处理重新生成的函数 
    const handleRegenerate = async (aiMessageIdToRegenerate) => {
        console.log(`Attempting to regenerate message with ID: ${aiMessageIdToRegenerate}`);

        // 1找到需要重新生成的消息对象
        const messageToRegenerate = messages.find(msg => msg.id === aiMessageIdToRegenerate && msg.role === ROLE_ASSISTANT);
        if (!messageToRegenerate) {
            console.warn("Message to regenerate not found or not an AI message.");
            toast.warn("无法找到要重新生成的消息。");
            return;
        }

        // 找到触发该 AI 消息的上一条用户消息
        let triggerUserMessage = null;
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (msg.id === aiMessageIdToRegenerate) continue; // 跳过要重新生成的 AI 消息本身
            if (msg.role === ROLE_USER) {
                triggerUserMessage = msg;
                break;
            }
        }

        if (!triggerUserMessage) {
            console.warn("No triggering user message found for regeneration.");
            return;
        }

        // 设置等待状态 
        setIsWaitingForResponse(true);

        try {
            // 重置目标消息为流式初始状态
            updateMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === aiMessageIdToRegenerate
                        ? { ...msg, streamedContent: '', content: '', isLoading: false } // 重置内容
                        : msg
                )
            );

            // 模拟获取新的 AI 回复 
            const randomIndex = Math.floor(Math.random() * mockResponses.length);
            const selectedResponse = mockResponses[randomIndex];
            const fullResponseText = `这是 AI 的回复 (已重新生成):\n\n${selectedResponse.content}`;

            // 模拟流式接收新回复 
            await simulateStreamingResponse(aiMessageIdToRegenerate, fullResponseText);

        } catch (error) {
            console.error("Error during regeneration streaming simulation:", error);
            updateMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === aiMessageIdToRegenerate
                        ? { ...msg, streamedContent: "抱歉，重新生成时出现了错误。", content: "抱歉，重新生成时出现了错误。" }
                        : msg
                )
            );
        } finally {
            setIsWaitingForResponse(false);
        }
    };
    // 添加一个清除历史记录的功能
    const clearHistory = () => {
        if (window.confirm("确定要清除所有聊天记录吗？")) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            setMessages([]); // 清空状态
            console.log("Chat history cleared.");
        }
    };

    return (
        <div style={styles.chatContainer}>
            <h2 style={{
                textAlign: 'center',
                padding: '10px',
                margin: 0,
                borderBottom: '1px solid #eee'
            }}>AI 助手
                {/* 清除按钮 */}
                <button onClick={clearHistory} style={{
                    float: 'right',
                    marginRight: '10px',
                    padding: '4px 12px',
                    backgroundColor: '#f3f1ff',
                    color: '#4632ff',
                    border: '1px solid #4632ff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                }}>
                    清除历史
                </button>
            </h2>

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
                    <MessageList messages={messages} onRegenerate={handleRegenerate} />
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