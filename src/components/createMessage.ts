import { createApp } from 'vue'
import Message from './Message.vue'
export type MessageType = 'success' | 'error' | 'default'

// 改为函数调用形式
const createMessage = (message: string, type: MessageType, timeOut = 2000) => {
  const messageInstance = createApp(Message, {
    message,
    type
  })
  // 新建dom节点
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  messageInstance.mount(mountNode)
  setTimeout(() => {
    // 卸载
    messageInstance.unmount(mountNode)
    document.body.removeChild(mountNode)
  }, timeOut)
}

export default createMessage
