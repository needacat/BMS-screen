<template>
    <div class="bms-card">
        <div class="card-header">
            <h3 class="card-title">
                <i class="fas fa-chart-pie"></i>
                大楼概览
            </h3>
            <div class="floor-info">
                <span class="floor-label">当前楼层：</span>
                <span class="floor-value">{{ selectedFloor }}层</span>
            </div>
        </div>

        <div class="overview-content">
            <div class="floor-plan">
                <div class="floor-plan-header">
                    <div class="floor-plan-title">楼层平面图</div>
                    <div class="occupancy-rate">
                        占用率：{{ occupancyRate }}%
                    </div>
                </div>
                <div class="floor-plan-visual">
                    <!-- 简化的楼层平面图 -->
                    <div class="plan-grid">
                        <div v-for="room in floorRooms" :key="room.id" class="plan-room" :class="{
                            'occupied': room.occupied,
                            'meeting': room.type === 'meeting',
                            'office': room.type === 'office',
                            'public': room.type === 'public'
                        }" :title="`${room.name} - ${room.occupied ? '使用中' : '空闲'}`">
                            <i v-if="room.type === 'meeting'" class="fas fa-users"></i>
                            <i v-if="room.type === 'office'" class="fas fa-desktop"></i>
                            <i v-if="room.type === 'public'" class="fas fa-walking"></i>
                        </div>
                    </div>
                </div>
                <div class="floor-legend">
                    <div class="legend-item">
                        <span class="legend-color meeting"></span>
                        <span>会议室</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color office"></span>
                        <span>办公室</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color public"></span>
                        <span>公共区域</span>
                    </div>
                </div>
            </div>

            <div class="building-stats">
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(59, 130, 246, 0.1);">
                        <i class="fas fa-users" style="color: #3b82f6;"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-label">当前人数</div>
                        <div class="stat-value">{{ buildingData.peopleCount }}</div>
                        <div class="stat-trend">
                            <i class="fas fa-arrow-up"></i>
                            较上周 +12%
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(34, 197, 94, 0.1);">
                        <i class="fas fa-door-open" style="color: #22c55e;"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-label">使用率</div>
                        <div class="stat-value">{{ occupancyRate }}%</div>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: occupancyRate + '%' }"></div>
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(168, 85, 247, 0.1);">
                        <i class="fas fa-lightbulb" style="color: #a855f7;"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-label">设备在线</div>
                        <div class="stat-value">{{ onlineDevices }}/{{ totalDevices }}</div>
                        <div class="stat-trend">
                            健康度 {{ healthRate }}%
                        </div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(245, 158, 11, 0.1);">
                        <i class="fas fa-temperature-high" style="color: #f59e0b;"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-label">平均温度</div>
                        <div class="stat-value">{{ avgTemperature }}°C</div>
                        <div class="stat-trend" :class="tempTrendClass">
                            <i :class="tempTrendIcon"></i>
                            {{ tempTrend }}°C
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    selectedFloor: {
        type: String,
        default: '1'
    },
    buildingData: {
        type: Object,
        default: () => ({})
    }
})

// 计算占用率
const occupancyRate = computed(() => {
    return Math.round((props.buildingData.occupiedArea / props.buildingData.totalArea) * 100)
})

// 设备统计（模拟数据）
const totalDevices = computed(() => {
    return props.selectedFloor === '1' ? 45 : 35
})

const onlineDevices = computed(() => {
    return props.selectedFloor === '1' ? 42 : 32
})

const healthRate = computed(() => {
    return Math.round((onlineDevices.value / totalDevices.value) * 100)
})

// 温度趋势
const avgTemperature = ref(23.5)
const tempTrend = ref(0.5)
const tempTrendIcon = computed(() => {
    return tempTrend.value >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
})
const tempTrendClass = computed(() => {
    return tempTrend.value >= 0 ? 'trend-up' : 'trend-down'
})

// 楼层房间数据
const floorRooms = ref([])

// 生成楼层房间数据
const generateFloorRooms = () => {
    const rooms = []
    const roomTypes = ['meeting', 'office', 'public']
    const roomCount = props.selectedFloor === '1' ? 16 : 12

    for (let i = 1; i <= roomCount; i++) {
        const type = roomTypes[Math.floor(Math.random() * roomTypes.length)]
        rooms.push({
            id: i,
            name: `${props.selectedFloor}${i.toString().padStart(2, '0')}`,
            type: type,
            occupied: Math.random() > 0.4
        })
    }

    return rooms
}

// 监听楼层变化
watch(() => props.selectedFloor, () => {
    floorRooms.value = generateFloorRooms()
    avgTemperature.value = (20 + Math.random() * 5).toFixed(1)
    tempTrend.value = (Math.random() - 0.5) * 2
}, { immediate: true })
</script>

<style scoped>
.overview-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    height: calc(100% - 60px);
}

.floor-plan {
    display: flex;
    flex-direction: column;
}

.floor-plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.floor-plan-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
}

.occupancy-rate {
    color: #3b82f6;
    font-weight: 600;
    font-size: 1.2rem;
}

.floor-plan-visual {
    flex: 1;
    background: rgba(15, 23, 42, 0.5);
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px;
}

.plan-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 8px;
    height: 100%;
}

.plan-room {
    background: rgba(30, 41, 59, 0.7);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    cursor: pointer;
}

.plan-room:hover {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

.plan-room.occupied {
    opacity: 0.8;
}

.plan-room.meeting {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
}

.plan-room.office {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
}

.plan-room.public {
    background: rgba(168, 85, 247, 0.2);
    color: #a855f7;
    border: 1px solid rgba(168, 85, 247, 0.3);
}

.floor-legend {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #94a3b8;
    font-size: 0.9rem;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
}

.legend-color.meeting {
    background: #3b82f6;
}

.legend-color.office {
    background: #22c55e;
}

.legend-color.public {
    background: #a855f7;
}

.building-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.stat-card {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 10px;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
}

.stat-info {
    flex: 1;
}

.stat-label {
    color: #94a3b8;
    font-size: 0.9rem;
    margin-bottom: 5px;
}

.stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: white;
    margin-bottom: 8px;
}

.stat-trend {
    font-size: 0.85rem;
    padding: 3px 8px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.trend-up {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
}

.trend-down {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
}

@media (max-width: 1200px) {
    .overview-content {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .plan-grid {
        grid-template-columns: repeat(6, 1fr);
    }
}

@media (max-width: 768px) {
    .building-stats {
        grid-template-columns: 1fr;
    }

    .plan-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>