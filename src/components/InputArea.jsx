// src/components/InputArea.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../styles/ChatStyles.css';

const InputArea = ({ onSend, isDisabled = false }) => {
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef(null); // 引用 textarea 元素

    // 处理 textarea 高度自适应
    useEffect(() => {
        const adjustHeight = () => {
            const textarea = textareaRef.current;
            if (textarea) {
                textarea.style.height = 'auto'; // 重置高度
                const scrollHeight = textarea.scrollHeight;
                // 设置新高度，限制在 min 和 max 之间
                const newHeight = Math.min(Math.max(scrollHeight, 65), 300);
                textarea.style.height = `${newHeight}px`;
            }
        };

        adjustHeight(); // 组件挂载或 inputValue 变化时调整
    }, [inputValue]); // 依赖 inputValue

    const handleSubmit = (e) => {
        e.preventDefault(); // 阻止表单默认提交行为
        if (isDisabled) return;  // 禁用输入框时返回
        onSend(inputValue);
        setInputValue(''); // 清空输入框
        // 提交后可能需要重置高度
        if (textareaRef.current) {
            textareaRef.current.style.height = '65px';
        }
    };

    const handleKeyDown = (e) => {
        // 在禁用状态下阻止 Enter 键 
        if (isDisabled && e.key === 'Enter') {
            e.preventDefault();
            return;
        }
        // 按 Enter 发送 (但允许 Shift+Enter 换行)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 阻止换行
            handleSubmit(e);
        }
    };

    return (

        <form onSubmit={handleSubmit} style={styles.inputForm}>
            <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isDisabled ? "AI 正在思考..." : "输入消息..."} // 禁用时显示提示
                style={styles.textarea}
                className='custom-scrollba'
                disabled={isDisabled}   // 禁用时禁用输入框
            />
            {/* 按钮放在 textarea 下方，并右对齐*/}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="submit"
                    style={styles.sendButton}
                    disabled={isDisabled || !inputValue.trim()}
                >
                    {isDisabled ? "等待" : "发送"}
                </button>
            </div>
        </form>
    );
};

const styles = {
    inputForm: {
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        borderTop: '1px solid #eee',
        backgroundColor: '#fafafa',
    },
    textarea: {
        resize: 'none', // 禁止用户手动调整大小
        padding: '10px',
        fontSize: '1.2em',
        border: '1px solid #ddd',
        borderRadius: '8px',
        outline: 'none', // 移除聚焦时的默认轮廓
        height: '65px',
        // overflowY: 'auto', // 超出时滚动
        boxSizing: 'border-box', // 包含 padding 和 border 在宽度/高度内
    },
    sendButton: {
        padding: '8px 16px',
        backgroundColor: '#4632ff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1em',
    },
};

export default InputArea;
