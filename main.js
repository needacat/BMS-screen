// main.js - BMS系统入口文件
import { createApp } from 'vue'
import App from './App.vue'

// 提前创建并注册全局 Modal 实例，保证在任意组件调用 modal API 时可用
import Modal from './components/Modal.vue'
import { useModal } from './utils/modal.js'
// 挂载一个独立的 modal 根节点到 body
const modalRoot = document.createElement('div')
document.body.appendChild(modalRoot)
const modalApp = createApp(Modal)
const modalInstance = modalApp.mount(modalRoot)
useModal(modalInstance)

// 创建Vue应用实例
const app = createApp(App)

// 全局配置
app.config.globalProperties.$filters = {
    formatNumber(value, decimals = 0) {
        const num = parseFloat(value)
        if (isNaN(num)) return decimals > 0 ? '0.' + '0'.repeat(decimals) : '0'
        return num.toFixed(decimals)
    },
    formatPercentage(value) {
        const num = parseFloat(value)
        if (isNaN(num)) return '0%'
        return `${num.toFixed(1)}%`
    },
    formatTemperature(value) {
        const num = parseFloat(value)
        if (isNaN(num)) return '0.0°C'
        return `${num.toFixed(1)}°C`
    }
}

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
    console.error('Vue错误:', err, '组件:', instance, '信息:', info)
    // 在实际应用中，这里可以发送错误到服务器
}

// 开发环境下的性能警告
if (process.env.NODE_ENV === 'development') {
    app.config.performance = true
}

// 挂载应用
app.mount('#app')

console.log('✅ BMS楼宇管理系统已启动')