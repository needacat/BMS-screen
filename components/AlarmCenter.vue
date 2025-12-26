<template>
    <div class="bms-card alarm-center">
        <!-- 头部保持不变 -->

        <div class="alarm-content">
            <!-- 报警摘要和图表保持不变 -->

            <div class="alarm-list">
                <div v-if="filteredAlarms.length === 0" class="no-alarms">
                    <i class="fas fa-check-circle"></i>
                    <p>暂无报警信息</p>
                </div>

                <div v-for="alarm in filteredAlarms" :key="alarm.id" class="alarm-item" :class="[
                    `alarm-${alarm.level}`,
                    { 'alarm-acknowledged': alarm.acknowledged }
                ]" @click="toggleAlarmDetail(alarm)">
                    <!-- 修改这里：图标直接放在flex容器中 -->
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

                    <!-- 报警详情改为独立块 -->
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
    if (!chartRef.value) return

    try {
        import('echarts').then(echarts => {
            chartInstance = echarts.init(chartRef.value)

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
                    show: false
                },
                series: [
                    {
                        name: '报警统计',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 5,
                            borderColor: '#0f172a',
                            borderWidth: 1
                        },
                        label: {
                            show: true,
                            position: 'outside',
                            fontSize: 10,
                            color: 'rgba(255, 255, 255, 0.8)',
                            formatter: '{b}: {c}'
                        },
                        emphasis: {
                            scale: false
                        },
                        labelLine: {
                            length: 5,
                            length2: 8
                        },
                        data: [
                            { value: highPriorityAlarms.value.length, name: '高', itemStyle: { color: '#ef4444' } },
                            { value: mediumPriorityAlarms.value.length, name: '中', itemStyle: { color: '#f59e0b' } },
                            { value: lowPriorityAlarms.value.length, name: '低', itemStyle: { color: '#3b82f6' } }
                        ]
                    }
                ]
            }

            chartInstance.setOption(option)
        })
    } catch (error) {
        console.error('加载echarts失败:', error)
    }
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
.alarm-center {
    grid-column: span 1;
}

.alarm-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: calc(100% - 48px);
}

.alarm-summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    background: rgba(15, 23, 42, 0.5);
    border-radius: 6px;
    padding: 10px;
}

.summary-stats {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
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
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 3px;
    line-height: 1;
}

.stat-label {
    color: #94a3b8;
    font-size: 0.8rem;
}

.alarm-chart {
    height: 120px;
    width: 100%;
}

.alarm-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 4px;
    min-height: 0;
}

.no-alarms {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 150px;
    color: #94a3b8;
    gap: 10px;
}

.no-alarms i {
    font-size: 2.5rem;
    color: #22c55e;
}

.no-alarms p {
    font-size: 0.95rem;
}

/* 修复图标重叠的关键代码开始 */
.alarm-item {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
    position: relative;
    /* 关键：相对定位 */
    padding-left: 46px;
    /* 关键：为图标预留空间 */
    min-height: 85px;
    /* 确保有足够高度 */
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

/* 修复图标位置 */
.alarm-icon {
    position: absolute;
    top: 12px;
    left: 12px;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
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

/* 调整主内容区，移除左内边距 */
.alarm-main {
    padding: 12px 12px 12px 0;
    min-width: 0;
}

.alarm-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6px;
    gap: 10px;
}

.alarm-title {
    color: white;
    font-weight: 600;
    font-size: 0.88rem;
    flex: 1;
    line-height: 1.2;
    padding-right: 5px;
}

.alarm-time {
    color: #94a3b8;
    font-size: 0.75rem;
    white-space: nowrap;
}

.alarm-description {
    color: #e2e8f0;
    font-size: 0.8rem;
    margin-bottom: 8px;
    line-height: 1.3;
}

.alarm-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.type-badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 0.7rem;
    background: rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    white-space: nowrap;
}

.acknowledged-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #22c55e;
    font-size: 0.75rem;
    white-space: nowrap;
}

/* 确保详情区域正确显示 */
.alarm-detail {
    padding: 12px;
    background: rgba(15, 23, 42, 0.8);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    width: 100%;
    margin-top: 0;
}

.detail-section h5 {
    color: white;
    font-size: 0.85rem;
    margin-bottom: 6px;
}

.detail-content {
    color: #94a3b8;
    font-size: 0.8rem;
    line-height: 1.4;
    margin-bottom: 10px;
}

.detail-content p {
    margin-bottom: 4px;
}

.detail-actions {
    display: flex;
    gap: 8px;
}

.alarm-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 600;
    margin-left: 6px;
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
    gap: 6px;
}

.alarm-actions .btn {
    padding: 3px 8px;
    font-size: 0.75rem;
}

.alarm-actions .btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

/* 滚动条样式 */
.alarm-list::-webkit-scrollbar {
    width: 4px;
}

.alarm-list::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
}

.alarm-list::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.5);
    border-radius: 2px;
}

/* 响应式设计 */
@media (max-width: 1400px) {
    .alarm-center {
        grid-column: span 1;
    }

    .alarm-summary {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .alarm-chart {
        height: 100px;
    }

    .summary-stats {
        flex-direction: row;
        justify-content: space-between;
    }

    .stat-item {
        flex-direction: column;
        text-align: center;
        gap: 6px;
    }

    .stat-icon {
        width: 36px;
        height: 36px;
    }
}

@media (max-width: 1200px) {
    .alarm-center {
        grid-column: span 1;
    }
}

@media (max-width: 768px) {
    .alarm-center {
        grid-column: span 1;
    }

    .alarm-actions {
        flex-direction: column;
        width: 100%;
    }

    .alarm-actions .btn {
        width: 100%;
        justify-content: center;
    }

    .alarm-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .alarm-actions {
        align-self: flex-end;
    }

    /* 小屏幕调整 */
    .alarm-item {
        padding-left: 40px;
    }

    .alarm-icon {
        width: 26px;
        height: 26px;
        top: 10px;
        left: 10px;
        font-size: 0.85rem;
    }

    .alarm-main {
        padding: 10px 10px 10px 0;
    }

    .alarm-title {
        font-size: 0.82rem;
    }
}
</style>