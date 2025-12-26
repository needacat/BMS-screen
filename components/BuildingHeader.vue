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
                <div>
                    <div class="weather-temp">25°C</div>
                    <div class="weather-desc">晴朗</div>
                </div>
            </div>

            <div class="header-actions">
                <button class="btn" @click="$emit('export')">
                    <i class="fas fa-download"></i>
                    导出报告
                </button>
                <button class="btn btn-primary" @click="$emit('settings')">
                    <i class="fas fa-cog"></i>
                    系统设置
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
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
</script>

<style scoped>
.building-header {
    background: rgba(15, 23, 42, 0.9);
    border-radius: 12px;
    padding: 20px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 30px;
}

.building-info h1 {
    color: white;
    font-size: 1.8rem;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.building-info h1 i {
    color: #3b82f6;
}

.building-subtitle {
    color: #94a3b8;
    font-size: 0.95rem;
}

.system-status {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 15px;
    border-radius: 20px;
    font-weight: 500;
    font-size: 0.9rem;
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
    gap: 8px;
    color: #94a3b8;
    font-size: 0.9rem;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 30px;
}

.weather-info {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(30, 41, 59, 0.7);
    padding: 10px 15px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.weather-info i {
    font-size: 1.8rem;
    color: #f59e0b;
}

.weather-temp {
    font-size: 1.3rem;
    font-weight: 600;
    color: white;
}

.weather-desc {
    font-size: 0.85rem;
    color: #94a3b8;
}

.header-actions {
    display: flex;
    gap: 10px;
}

@media (max-width: 1024px) {
    .building-header {
        flex-direction: column;
        gap: 20px;
        text-align: center;
    }

    .header-left,
    .header-right {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .building-header {
        padding: 15px;
    }

    .header-left {
        flex-direction: column;
        gap: 15px;
    }

    .weather-info {
        display: none;
    }
}
</style>