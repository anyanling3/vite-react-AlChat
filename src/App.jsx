import React from 'react';
import ChatContainer from './components/ChatContainer';
// import './App.css'; // 可用于全局样式调整

function App() {
    return (
        <div className="App">
            {/* 可以在这里添加头部、侧边栏等 */}
            <ChatContainer />
        </div>
    );
}

export default App;

