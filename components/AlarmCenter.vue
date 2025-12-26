<template>
    <div class="bms-card">
        <div class="card-header">
            <h3 class="card-title">
                <i class="fas fa-exclamation-triangle"></i>
                报警中心
                <span class="alarm-count" :class="alarmCountClass">
                    {{ unacknowledgedAlarms.length }}
                </span>
            </h3>
            <div class="alarm-actions">
                <button class="btn" @click="filterAlarms('all')" :class="{ active: filterType === 'all' }">
                    全部
                </button>
                <button class="btn" @click="filterAlarms('unacknowledged')"
                    :class="{ active: filterType === 'unacknowledged' }">
                    未处理
                </button>
                <button class="btn btn-primary" @click="acknowledgeAll" :disabled="unacknowledgedAlarms.length === 0">
                    <i class="fas fa-check-double"></i>
                    全部确认
                </button>
            </div>
        </div>

        <div class="alarm-content">
            <div class="alarm-summary">
                <div class="summary-stats">
                    <div class="stat-item">
                        <div class="stat-icon high">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">{{ highPriorityAlarms.length }}</div>
                            <div class="stat-label">高优先级</div>
                        </div>
                    </div>

                    <div class="stat-item">
                        <div class="stat-icon medium">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">{{ mediumPriorityAlarms.length }}</div>
                            <div class="stat-label">中优先级</div>
                        </div>
                    </div>

                    <div class="stat-item">
                        <div class="stat-icon low">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-value">{{ lowPriorityAlarms.length }}</div>
                            <div class="stat-label">低优先级</div>
                        </div>
                    </div>
                </div>

                <div class="alarm-chart" ref="chartRef"></div>
            </div>

            <div class="alarm-list">
                <div v-if="filteredAlarms.length === 0" class="no-alarms">
                    <i class="fas fa-check-circle"></i>
                    <p>暂无报警信息</p>
                </div>

                <div v-for="alarm in filteredAlarms" :key="alarm.id" class="alarm-item" :class="[
                    `alarm-${alarm.level}`,
                    { 'alarm-acknowledged': alarm.acknowledged }
                ]" @click="toggleAlarmDetail(alarm)">
                    <div class="alarm-icon">
                        <i :class="getAlarmIcon(alarm.type)"></i>
                    </div>

                    <div class="alarm-main">
                        <div class="alarm-header">
                            <div class="alarm-title">{{ alarm.title }}</div>
                            <div class="alarm-time">{{ alarm.time }}</div>
                        </div>

                        <div class="alarm-description">{{ alarm.description }}</div>

                        <div class="alarm-footer">
                            <div class="alarm-type">
                                <span class="type-badge">{{ getAlarmTypeText(alarm.type) }}</span>
                            </div>
                            <div class="alarm-actions">
                                <button v-if="!alarm.acknowledged" class="btn btn-small"
                                    @click.stop="acknowledgeAlarm(alarm.id)">
                                    <i class="fas fa-check"></i>
                                    确认
                                </button>
                                <span v-else class="acknowledged-label">
                                    <i class="fas fa-check-circle"></i>
                                    已处理
                                </span>
                            </div>
                        </div>
                    </div>

                    <div v-if="alarm.showDetail" class="alarm-detail">
                        <div class="detail-section">
                            <h5>详细信息</h5>
                            <div class="detail-content">
                                <p>报警ID: {{ alarm.id }}</p>
                                <p>发生时间: {{ alarm.time }}</p>
                                <p>处理建议: {{ getAlarmSuggestion(alarm) }}</p>
                            </div>
                        </div>

                        <div class="detail-actions">
                            <button class="btn btn-small" @click.stop="assignTask(alarm)">
                                <i class="fas fa-user-cog"></i>
                                分配任务
                            </button>
                            <button class="btn btn-small" @click.stop="ignoreAlarm(alarm.id)">
                                <i class="fas fa-times"></i>
                                忽略
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    alarms: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['acknowledge-alarm'])

// 过滤类型
const filterType = ref('unacknowledged')
const chartRef = ref(null)
let chartInstance = null

// 过滤警报
const filteredAlarms = computed(() => {
    let filtered = [...props.alarms]

    if (filterType.value === 'unacknowledged') {
        filtered = filtered.filter(alarm => !alarm.acknowledged)
    }

    return filtered.sort((a, b) => {
        const levelOrder = { high: 3, medium: 2, low: 1 }
        return levelOrder[b.level] - levelOrder[a.level]
    })
})

// 未确认警报
const unacknowledgedAlarms = computed(() => {
    return props.alarms.filter(alarm => !alarm.acknowledged)
})

// 警报计数样式
const alarmCountClass = computed(() => {
    const count = unacknowledgedAlarms.value.length
    if (count === 0) return 'alarm-none'
    if (count <= 3) return 'alarm-low'
    if (count <= 8) return 'alarm-medium'
    return 'alarm-high'
})

// 按优先级统计
const highPriorityAlarms = computed(() => {
    return props.alarms.filter(alarm => alarm.level === 'high')
})

const mediumPriorityAlarms = computed(() => {
    return props.alarms.filter(alarm => alarm.level === 'medium')
})

const lowPriorityAlarms = computed(() => {
    return props.alarms.filter(alarm => alarm.level === 'low')
})

// 获取警报图标
const getAlarmIcon = (type) => {
    const icons = {
        equipment: 'fas fa-cogs',
        security: 'fas fa-shield-alt',
        environment: 'fas fa-leaf',
        emergency: 'fas fa-exclamation',
        fire: 'fas fa-fire',
        power: 'fas fa-bolt'
    }
    return icons[type] || 'fas fa-bell'
}

// 获取警报类型文本
const getAlarmTypeText = (type) => {
    const types = {
        equipment: '设备报警',
        security: '安防报警',
        environment: '环境报警',
        emergency: '紧急报警',
        fire: '消防报警',
        power: '电力报警'
    }
    return types[type] || '系统报警'
}

// 获取处理建议
const getAlarmSuggestion = (alarm) => {
    const suggestions = {
        equipment: '请立即检查相关设备状态',
        security: '请检查安防系统及监控画面',
        environment: '检查环境参数并进行调整',
        emergency: '启动应急预案，通知相关人员',
        fire: '立即启动消防应急预案',
        power: '检查电力系统，确保备用电源'
    }
    return suggestions[alarm.type] || '请及时处理'
}

// 过滤警报
const filterAlarms = (type) => {
    filterType.value = type
}

// 确认单个警报
const acknowledgeAlarm = (alarmId) => {
    emit('acknowledge-alarm', alarmId)
}

// 确认所有警报
const acknowledgeAll = () => {
    if (confirm('确认所有未处理报警？')) {
        unacknowledgedAlarms.value.forEach(alarm => {
            emit('acknowledge-alarm', alarm.id)
        })
    }
}

// 切换详情显示
const toggleAlarmDetail = (alarm) => {
    alarm.showDetail = !alarm.showDetail
}

// 分配任务
const assignTask = (alarm) => {
    const person = prompt('请输入处理人员姓名：', '维修组-张三')
    if (person) {
        alert(`已分配给：${person}`)
        acknowledgeAlarm(alarm.id)
    }
}

// 忽略警报
const ignoreAlarm = (alarmId) => {
    if (confirm('确定要忽略此报警吗？')) {
        acknowledgeAlarm(alarmId)
    }
}

// 初始化图表
const initChart = () => {
    if (!chartRef.value || !window.echarts) return

    chartInstance = window.echarts.init(chartRef.value)

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            borderColor: '#3b82f6',
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            top: '5%',
            left: 'center',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.7)'
            }
        },
        series: [
            {
                name: '报警统计',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#0f172a',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '14',
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: highPriorityAlarms.value.length, name: '高优先级', itemStyle: { color: '#ef4444' } },
                    { value: mediumPriorityAlarms.value.length, name: '中优先级', itemStyle: { color: '#f59e0b' } },
                    { value: lowPriorityAlarms.value.length, name: '低优先级', itemStyle: { color: '#3b82f6' } }
                ]
            }
        ]
    }

    chartInstance.setOption(option)
}

// 更新图表
const updateChart = () => {
    if (chartInstance) {
        chartInstance.dispose()
        initChart()
    }
}

// 窗口大小变化处理
const handleResize = () => {
    if (chartInstance) {
        chartInstance.resize()
    }
}

onMounted(() => {
    initChart()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    if (chartInstance) {
        chartInstance.dispose()
    }
    window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.alarm-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: calc(100% - 60px);
}

.alarm-summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    background: rgba(15, 23, 42, 0.5);
    border-radius: 10px;
    padding: 15px;
}

.summary-stats {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 15px;
}

.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.stat-icon.high {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
}

.stat-icon.medium {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
}

.stat-icon.low {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
}

.stat-info {
    flex: 1;
}

.stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: white;
    margin-bottom: 5px;
}

.stat-label {
    color: #94a3b8;
    font-size: 0.9rem;
}

.alarm-chart {
    height: 150px;
}

.alarm-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.no-alarms {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #94a3b8;
    gap: 15px;
}

.no-alarms i {
    font-size: 3rem;
    color: #22c55e;
}

.no-alarms p {
    font-size: 1.1rem;
}

.alarm-item {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
}

.alarm-item:hover {
    background: rgba(30, 41, 59, 0.7);
}

.alarm-item.alarm-high {
    border-left-color: #ef4444;
}

.alarm-item.alarm-medium {
    border-left-color: #f59e0b;
}

.alarm-item.alarm-low {
    border-left-color: #3b82f6;
}

.alarm-item.alarm-acknowledged {
    opacity: 0.7;
}

.alarm-icon {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
}

.alarm-high .alarm-icon {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
}

.alarm-medium .alarm-icon {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
}

.alarm-low .alarm-icon {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
}

.alarm-main {
    padding: 15px 15px 15px 70px;
}

.alarm-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
}

.alarm-title {
    color: white;
    font-weight: 600;
    font-size: 1rem;
    flex: 1;
}

.alarm-time {
    color: #94a3b8;
    font-size: 0.85rem;
    white-space: nowrap;
}

.alarm-description {
    color: #e2e8f0;
    font-size: 0.9rem;
    margin-bottom: 15px;
    line-height: 1.4;
}

.alarm-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.type-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    background: rgba(255, 255, 255, 0.1);
    color: #94a3b8;
}

.acknowledged-label {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #22c55e;
    font-size: 0.85rem;
}

.alarm-detail {
    padding: 15px;
    background: rgba(15, 23, 42, 0.8);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-section h5 {
    color: white;
    font-size: 0.95rem;
    margin-bottom: 10px;
}

.detail-content {
    color: #94a3b8;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 15px;
}

.detail-actions {
    display: flex;
    gap: 10px;
}

.alarm-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-left: 8px;
}

.alarm-count.alarm-none {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
}

.alarm-count.alarm-low {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
}

.alarm-count.alarm-medium {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
}

.alarm-count.alarm-high {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}

.alarm-actions {
    display: flex;
    gap: 8px;
}

.alarm-actions .btn {
    padding: 4px 10px;
    font-size: 0.85rem;
}

.alarm-actions .btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

@media (max-width: 1200px) {
    .alarm-summary {
        grid-template-columns: 1fr;
    }

    .alarm-chart {
        height: 120px;
    }
}

@media (max-width: 768px) {
    .alarm-actions {
        flex-direction: column;
    }

    .alarm-actions .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>