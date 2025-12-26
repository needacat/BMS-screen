<template>
    <div class="bms-card">
        <div class="card-header">
            <h3 class="card-title">
                <i class="fas fa-cogs"></i>
                设备状态
            </h3>
            <div class="equipment-filter">
                <select v-model="filterType" class="filter-selector">
                    <option value="all">全部设备</option>
                    <option value="hvac">空调系统</option>
                    <option value="lighting">照明系统</option>
                    <option value="elevator">电梯系统</option>
                    <option value="fire">消防系统</option>
                    <option value="water">给排水系统</option>
                    <option value="power">变配电系统</option>
                </select>
            </div>
        </div>

        <div class="equipment-content">
            <div class="equipment-summary">
                <div class="summary-item">
                    <div class="summary-label">设备总数</div>
                    <div class="summary-value">{{ totalEquipment }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">在线设备</div>
                    <div class="summary-value" style="color: #22c55e;">{{ onlineEquipment }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">报警设备</div>
                    <div class="summary-value" style="color: #ef4444;">{{ alarmEquipment }}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">健康度</div>
                    <div class="summary-value" style="color: #3b82f6;">{{ healthRate }}%</div>
                </div>
            </div>

            <div class="equipment-list">
                <div v-for="equipment in filteredEquipment" :key="equipment.id" class="equipment-item"
                    @click="showEquipmentDetail(equipment)">
                    <div class="equipment-icon">
                        <i :class="getEquipmentIcon(equipment.type)"></i>
                    </div>
                    <div class="equipment-info">
                        <div class="equipment-name">{{ equipment.name }}</div>
                        <div class="equipment-meta">
                            <span class="equipment-floor">
                                <i class="fas fa-layer-group"></i>
                                {{ equipment.floor }}层
                            </span>
                            <span class="equipment-type">
                                {{ getEquipmentTypeText(equipment.type) }}
                            </span>
                        </div>
                    </div>
                    <div class="equipment-status">
                        <span class="status-indicator" :class="`status-${equipment.status}`">
                            {{ getStatusText(equipment.status) }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="maintenance-info">
                <h4>维护信息</h4>
                <div class="maintenance-list">
                    <div class="maintenance-item">
                        <div class="maintenance-title">
                            <i class="fas fa-tools"></i>
                            <span>最近维护</span>
                        </div>
                        <div class="maintenance-detail">
                            <span>{{ recentMaintenance?.equipment }}</span>
                            <span class="maintenance-date">{{ recentMaintenance?.date }}</span>
                        </div>
                    </div>
                    <div class="maintenance-item">
                        <div class="maintenance-title">
                            <i class="fas fa-calendar-alt"></i>
                            <span>下次维护</span>
                        </div>
                        <div class="maintenance-detail">
                            <span>{{ nextMaintenance?.equipment }}</span>
                            <span class="maintenance-date">{{ nextMaintenance?.date }}</span>
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
    equipmentList: {
        type: Array,
        default: () => []
    },
    selectedFloor: {
        type: String,
        default: '1'
    }
})

const filterType = ref('all')

// 设备统计
const totalEquipment = computed(() => {
    return filteredEquipment.value.length
})

const onlineEquipment = computed(() => {
    return filteredEquipment.value.filter(e => e.status === 'normal').length
})

const alarmEquipment = computed(() => {
    return filteredEquipment.value.filter(e => e.status === 'alarm').length
})

const healthRate = computed(() => {
    if (totalEquipment.value === 0) return 100
    return Math.round((onlineEquipment.value / totalEquipment.value) * 100)
})

// 过滤设备
const filteredEquipment = computed(() => {
    let filtered = [...props.equipmentList]

    // 按楼层筛选
    if (props.selectedFloor !== 'all') {
        filtered = filtered.filter(e => e.floor === props.selectedFloor)
    }

    // 按类型筛选
    if (filterType.value !== 'all') {
        filtered = filtered.filter(e => e.type === filterType.value)
    }

    return filtered
})

// 维护信息
const recentMaintenance = computed(() => {
    const equipment = props.equipmentList
        .filter(e => e.lastMaintenance)
        .sort((a, b) => new Date(b.lastMaintenance) - new Date(a.lastMaintenance))[0]

    return equipment ? {
        equipment: equipment.name,
        date: equipment.lastMaintenance
    } : null
})

const nextMaintenance = computed(() => {
    // 模拟计算下次维护时间
    return {
        equipment: '中央空调主机',
        date: '2024-04-15'
    }
})

// 获取设备图标
const getEquipmentIcon = (type) => {
    const icons = {
        hvac: 'fas fa-temperature-low',
        lighting: 'fas fa-lightbulb',
        elevator: 'fas fa-elevator',
        fire: 'fas fa-fire-extinguisher',
        water: 'fas fa-water',
        power: 'fas fa-bolt'
    }
    return icons[type] || 'fas fa-cog'
}

// 获取设备类型文本
const getEquipmentTypeText = (type) => {
    const types = {
        hvac: '空调系统',
        lighting: '照明系统',
        elevator: '电梯系统',
        fire: '消防系统',
        water: '给排水系统',
        power: '变配电系统'
    }
    return types[type] || '其他设备'
}

// 获取状态文本
const getStatusText = (status) => {
    const statusMap = {
        normal: '正常',
        warning: '警告',
        alarm: '报警',
        offline: '离线'
    }
    return statusMap[status] || '未知'
}

// 显示设备详情
const showEquipmentDetail = (equipment) => {
    alert(`设备详情:\n名称: ${equipment.name}\n类型: ${getEquipmentTypeText(equipment.type)}\n楼层: ${equipment.floor}层\n状态: ${getStatusText(equipment.status)}\n最后维护: ${equipment.lastMaintenance}`)
}

// 监听楼层变化
watch(() => props.selectedFloor, () => {
    console.log(`切换到${props.selectedFloor}层设备`)
})
</script>

<style scoped>
.equipment-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: calc(100% - 60px);
}

.equipment-summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    background: rgba(15, 23, 42, 0.5);
    border-radius: 10px;
    padding: 15px;
}

.summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.summary-label {
    color: #94a3b8;
    font-size: 0.85rem;
    margin-bottom: 5px;
}

.summary-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
}

.equipment-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.equipment-item {
    display: flex;
    align-items: center;
    gap: 15px;
    background: rgba(15, 23, 42, 0.5);
    border-radius: 10px;
    padding: 12px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.equipment-item:hover {
    background: rgba(30, 41, 59, 0.7);
    transform: translateX(5px);
}

.equipment-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(59, 130, 246, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: #3b82f6;
}

.equipment-info {
    flex: 1;
}

.equipment-name {
    color: white;
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 0.95rem;
}

.equipment-meta {
    display: flex;
    gap: 15px;
    color: #94a3b8;
    font-size: 0.85rem;
}

.equipment-floor {
    display: flex;
    align-items: center;
    gap: 4px;
}

.equipment-floor i {
    font-size: 0.8rem;
}

.equipment-status {
    min-width: 70px;
    text-align: center;
}

.maintenance-info h4 {
    color: white;
    font-size: 1rem;
    margin-bottom: 15px;
}

.maintenance-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.maintenance-item {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 10px;
    padding: 12px 15px;
}

.maintenance-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #94a3b8;
    font-size: 0.9rem;
    margin-bottom: 8px;
}

.maintenance-title i {
    color: #f59e0b;
}

.maintenance-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.maintenance-detail span:first-child {
    color: white;
    font-weight: 500;
    font-size: 0.95rem;
}

.maintenance-date {
    color: #3b82f6;
    font-size: 0.9rem;
    font-weight: 500;
}

.filter-selector {
    background: rgba(30, 41, 59, 0.7);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 5px 12px;
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .equipment-summary {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }

    .equipment-meta {
        flex-direction: column;
        gap: 5px;
    }
}
</style>