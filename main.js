// main.js - BMS系统入口文件
import { createApp } from 'vue'
import App from './App.vue'

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