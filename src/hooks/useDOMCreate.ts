import { onUnmounted } from 'vue'

function useDOMCreate (nodeId: string) {
  // 手动添加dom节点
  const node = document.createElement('div')
  node.id = nodeId
  document.body.appendChild(node)
  onUnmounted(() => {
    // 组件卸载 销毁dom节点
    document.body.removeChild(node)
  })
}

export default useDOMCreate
