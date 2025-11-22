// 定义消息的角色类型
export const ROLE_USER = 'user';
export const ROLE_ASSISTANT = 'assistant';

// 定义消息的基本结构
/**
 * @typedef {Object} Message
 * @property {string} id - 消息的唯一标识符
 * @property {string} role - 消息发送者角色 ('user' | 'assistant')
 * @property {string} content - 消息内容
 * @property {number} timestamp - 消息发送的时间戳 (毫秒)
 */
