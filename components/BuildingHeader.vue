<template>
    <header class="building-header">
        <div class="header-left">
            <div class="building-info">
                <h1>
                    <i class="fas fa-building"></i>
                    {{ buildingName }}
                </h1>
                <p class="building-subtitle">楼宇智能管理系统 - 实时监控中心</p>
            </div>

            <div class="system-status">
                <div class="status-badge" :class="`status-${systemStatus}`">
                    <i class="fas fa-circle"></i>
                    {{ getStatusText(systemStatus) }}
                </div>
                <div class="time-info">
                    <i class="fas fa-clock"></i>
                    最后更新: {{ lastUpdate }}
                </div>
            </div>
        </div>

        <div class="header-right">
            <div class="weather-info">
                <i class="fas fa-sun"></i>
                <div class="weather-details">
                    <div class="weather-temp">25°C</div>
                    <div class="weather-desc">晴朗</div>
                </div>
            </div>

            <div class="header-actions">
                <button class="btn" @click="handleExport">
                    <i class="fas fa-download"></i>
                    导出报告
                </button>
                <button class="btn btn-primary" @click="handleSettings">
                    <i class="fas fa-cog"></i>
                    系统设置
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { showAlert } from '../utils/modal.js'

const props = defineProps({
    buildingName: {
        type: String,
        default: '智慧大厦'
    },
    systemStatus: {
        type: String,
        default: 'normal'
    },
    lastUpdate: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['export', 'settings'])

const getStatusText = (status) => {
    const statusMap = {
        normal: '运行正常',
        warning: '注意警告',
        alarm: '系统报警',
        offline: '离线状态'
    }
    return statusMap[status] || '未知状态'
}

const handleExport = async () => {
    await showAlert('数据导出功能正在开发中...', '提示')
    emit('export')
}

const handleSettings = async () => {
    await showAlert('系统设置功能正在开发中...', '提示')
    emit('settings')
}
</script>

<style scoped>
.building-header {
    background: rgba(15, 23, 42, 0.9);
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    flex-wrap: wrap;
    gap: 12px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
    min-width: 0;
}

.building-info {
    min-width: 0;
}

.building-info h1 {
    color: white;
    font-size: 1.4rem;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.building-info h1 i {
    color: #3b82f6;
    font-size: 1.3rem;
}

.building-subtitle {
    color: #94a3b8;
    font-size: 0.85rem;
    white-space: nowrap;
}

.system-status {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 120px;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: 500;
    font-size: 0.8rem;
    white-space: nowrap;
}

.status-normal {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-warning {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-alarm {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
    animation: pulse 2s infinite;
}

.time-info {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #94a3b8;
    font-size: 0.8rem;
    white-space: nowrap;
}

.time-info i {
    color: #3b82f6;
    font-size: 0.8rem;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.weather-info {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(30, 41, 59, 0.7);
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    min-width: 0;
}

.weather-info i {
    font-size: 1.4rem;
    color: #f59e0b;
}

.weather-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.weather-temp {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    line-height: 1;
}

.weather-desc {
    font-size: 0.75rem;
    color: #94a3b8;
}

.header-actions {
    display: flex;
    gap: 8px;
}

@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.6;
    }

    100% {
        opacity: 1;
    }
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .building-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .header-left,
    .header-right {
        width: 100%;
        justify-content: space-between;
    }

    .weather-info {
        display: none;
    }
}

@media (max-width: 768px) {
    .building-header {
        padding: 10px 12px;
    }

    .header-left {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .building-info h1 {
        font-size: 1.2rem;
    }

    .system-status {
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    }

    .header-actions {
        width: 100%;
        justify-content: space-between;
    }

    .header-actions .btn {
        flex: 1;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .header-right {
        flex-direction: column;
        width: 100%;
        gap: 10px;
    }

    .header-actions {
        flex-direction: column;
    }
}
</style>