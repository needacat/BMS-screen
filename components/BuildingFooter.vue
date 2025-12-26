<template>
    <footer class="building-footer">
        <div class="footer-info">
            <div class="footer-item">
                <i class="fas fa-building"></i>
                <span>智慧大厦 BMS v2.1</span>
            </div>

            <div class="footer-item">
                <i class="fas fa-server"></i>
                <span>服务器状态: </span>
                <span class="status-indicator" :class="serverStatusClass">
                    {{ serverStatus }}
                </span>
            </div>

            <div class="footer-item">
                <i class="fas fa-network-wired"></i>
                <span>网络延迟: </span>
                <span class="latency" :class="latencyClass">{{ networkLatency }}ms</span>
            </div>

            <div class="footer-item">
                <i class="fas fa-clock"></i>
                <span>系统时间: {{ currentTime }}</span>
            </div>

            <div class="footer-item">
                <i class="fas fa-user-shield"></i>
                <span>操作员: {{ operator }}</span>
            </div>
        </div>

        <div class="footer-controls">
            <button class="btn" @click="handleRefresh" :disabled="isRefreshing">
                <i class="fas fa-sync-alt" :class="{ 'fa-spin': isRefreshing }"></i>
                {{ isRefreshing ? '刷新中...' : '刷新数据' }}
            </button>

            <button class="btn" @click="showSystemLog">
                <i class="fas fa-clipboard-list"></i>
                系统日志
            </button>

            <button class="btn" :class="{ 'btn-primary': isNightMode }" @click="toggleNightMode">
                <i class="fas" :class="isNightMode ? 'fa-sun' : 'fa-moon'"></i>
                {{ isNightMode ? '日间模式' : '夜间模式' }}
            </button>

            <button class="btn btn-alarm" @click="handleEmergency">
                <i class="fas fa-exclamation-triangle"></i>
                紧急预案
            </button>
        </div>
    </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { showAlert, showConfirm } from '../utils/modal.js'

const props = defineProps({
    totalAlarms: {
        type: Number,
        default: 0
    },
    systemMode: {
        type: String,
        default: 'auto'
    }
})

const emit = defineEmits(['refresh', 'emergency'])

// 状态数据
const serverStatus = ref('normal')
const networkLatency = ref(45)
const currentTime = ref('')
const operator = ref('管理员')
const isRefreshing = ref(false)
const isNightMode = ref(false)

// 服务器状态样式
const serverStatusClass = computed(() => {
    if (serverStatus.value === 'normal') return 'status-normal'
    if (serverStatus.value === 'warning') return 'status-warning'
    return 'status-alarm'
})

// 网络延迟样式
const latencyClass = computed(() => {
    if (networkLatency.value < 50) return 'latency-good'
    if (networkLatency.value < 100) return 'latency-normal'
    return 'latency-poor'
})

// 刷新数据
const handleRefresh = () => {
    if (isRefreshing.value) return

    isRefreshing.value = true
    emit('refresh')

    // 模拟刷新过程
    setTimeout(() => {
        isRefreshing.value = false

        // 随机更新一些状态
        networkLatency.value = Math.floor(Math.random() * 80) + 20
        updateServerStatus()
    }, 1500)
}

// 显示系统日志
const showSystemLog = async () => {
    const logs = [
        '14:30:22 系统启动完成',
        '14:25:18 数据库备份成功',
        '14:15:45 用户登录: 管理员',
        '14:10:30 安全扫描完成',
        '14:05:15 系统更新检查',
        '14:00:00 定时数据归档'
    ]

    await showAlert('系统日志:\n\n' + logs.join('\n'), '系统日志')
}

// 切换夜间模式
const toggleNightMode = () => {
    isNightMode.value = !isNightMode.value
    document.body.classList.toggle('night-mode', isNightMode.value)
    console.log(`切换到${isNightMode.value ? '夜间' : '日间'}模式`)
}

// 紧急预案
const handleEmergency = async () => {
    const ok = await showConfirm('确定要启动紧急预案吗？', '确认')
    if (ok) {
        emit('emergency')
    }
}

// 更新服务器状态
const updateServerStatus = () => {
    const random = Math.random()
    if (random > 0.95) {
        serverStatus.value = 'alarm'
    } else if (random > 0.85) {
        serverStatus.value = 'warning'
    } else {
        serverStatus.value = 'normal'
    }
}

// 更新时间
const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

// 初始化
onMounted(() => {
    updateTime()
    updateServerStatus()

    // 每秒更新时间
    const timeInterval = setInterval(updateTime, 1000)

    // 每30秒更新一次网络延迟
    const latencyInterval = setInterval(() => {
        networkLatency.value = Math.floor(Math.random() * 80) + 20
    }, 30000)

    // 每5分钟检查一次服务器状态
    const statusInterval = setInterval(updateServerStatus, 300000)

    // 保存清理函数
    onUnmounted(() => {
        clearInterval(timeInterval)
        clearInterval(latencyInterval)
        clearInterval(statusInterval)
    })
})
</script>

<style scoped>
.building-footer {
    background: rgba(15, 23, 42, 0.9);
    border-radius: 8px;
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.2);
}

.footer-info {
    display: flex;
    align-items: center;
    gap: 16px;
    color: #94a3b8;
    font-size: 0.8rem;
    flex-wrap: wrap;
    flex: 1;
}

.footer-item {
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
}

.footer-item i {
    color: #3b82f6;
    font-size: 0.8rem;
}

.latency {
    font-weight: 500;
    padding: 2px 6px;
    border-radius: 8px;
    font-size: 0.75rem;
    white-space: nowrap;
}

.latency-good {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
}

.latency-normal {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
}

.latency-poor {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
}

.footer-controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.btn {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s ease;
    font-size: 0.8rem;
    white-space: nowrap;
}

.btn:hover:not(:disabled) {
    background: rgba(59, 130, 246, 0.3);
    transform: translateY(-1px);
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-primary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.btn-primary:hover:not(:disabled) {
    background: #2563eb;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
}

.btn-alarm {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
}

.btn-alarm:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.3);
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
}

.fa-spin {
    animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .building-footer {
        flex-direction: column;
        gap: 10px;
    }

    .footer-info {
        justify-content: space-between;
        width: 100%;
    }

    .footer-controls {
        justify-content: center;
        width: 100%;
    }
}

@media (max-width: 768px) {
    .footer-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        width: 100%;
    }

    .footer-controls {
        width: 100%;
    }

    .btn {
        flex: 1;
        justify-content: center;
        min-width: 100px;
    }
}

@media (max-width: 480px) {
    .footer-controls {
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }

    .building-footer {
        padding: 8px 10px;
    }
}

/* 夜间模式样式 */
.night-mode {
    filter: invert(90%) hue-rotate(180deg);
}

.night-mode img,
.night-mode video,
.night-mode .chart-container {
    filter: invert(90%) hue-rotate(180deg);
}
</style>