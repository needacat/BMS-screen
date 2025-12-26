<template>
  <div class="bms-card energy-management">
    <div class="card-header">
      <h3 class="card-title">
        <i class="fas fa-bolt"></i>
        能源管理
      </h3>
      <select v-model="timeRange" class="time-selector" @change="updateChart">
        <option value="day">今日</option>
        <option value="week">本周</option>
        <option value="month">本月</option>
      </select>
    </div>

    <div class="energy-content">
      <div class="energy-summary">
        <div class="energy-total">
          <div class="energy-label">总能耗</div>
          <div class="energy-value">
            <span class="value-display">{{ energyData.total.toFixed(1) }}</span>
            <span class="value-unit">kWh</span>
          </div>
          <div class="energy-trend" :class="trendClass">
            <i :class="trendIcon"></i>
            {{ Math.abs(energyData.trend) }}%
          </div>
        </div>

        <div class="energy-today">
          <div class="energy-label">今日能耗</div>
          <div class="energy-value">
            <span class="value-display">{{ energyData.today.toFixed(1) }}</span>
            <span class="value-unit">kWh</span>
          </div>
          <div class="energy-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: todayProgress + '%' }"></div>
            </div>
            <div class="progress-label">
              <span>今日目标：200 kWh</span>
              <span>{{ todayProgress }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-container" ref="chartRef"></div>

      <div class="energy-distribution">
        <h4>能耗分布</h4>
        <div class="distribution-items">
          <div v-for="item in distributionItems" :key="item.name" class="distribution-item">
            <div class="distribution-header">
              <div class="distribution-name">
                <span class="distribution-dot" :style="{ backgroundColor: item.color }"></span>
                {{ item.name }}
              </div>
              <div class="distribution-percentage">{{ item.percentage }}%</div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: item.percentage + '%', backgroundColor: item.color }"></div>
            </div>
            <div class="distribution-value">{{ item.value }} kWh</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  energyData: {
    type: Object,
    default: () => ({})
  }
})

const timeRange = ref('day')
const chartRef = ref(null)
let chartInstance = null

// 计算趋势
const trendClass = computed(() => {
  return props.energyData.trend >= 0 ? 'trend-up' : 'trend-down'
})

const trendIcon = computed(() => {
  return props.energyData.trend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
})

// 今日进度
const todayProgress = computed(() => {
  return Math.min(100, Math.round((props.energyData.today / 200) * 100))
})

// 能耗分布数据
const distributionItems = computed(() => {
  return [
    { name: '照明系统', percentage: props.energyData.distribution?.lighting || 35, value: (props.energyData.total * (props.energyData.distribution?.lighting || 35) / 100).toFixed(0), color: '#3b82f6' },
    { name: '空调系统', percentage: props.energyData.distribution?.hvac || 45, value: (props.energyData.total * (props.energyData.distribution?.hvac || 45) / 100).toFixed(0), color: '#22c55e' },
    { name: '电梯系统', percentage: props.energyData.distribution?.elevator || 12, value: (props.energyData.total * (props.energyData.distribution?.elevator || 12) / 100).toFixed(0), color: '#f59e0b' },
    { name: '其他设备', percentage: props.energyData.distribution?.other || 8, value: (props.energyData.total * (props.energyData.distribution?.other || 8) / 100).toFixed(0), color: '#a855f7' }
  ]
})

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  try {
    // 动态加载echarts
    import('echarts').then(echarts => {
      chartInstance = echarts.init(chartRef.value)

      // 生成模拟数据
      let xData = []
      let seriesData = []

      switch (timeRange.value) {
        case 'day':
          for (let i = 0; i < 24; i++) {
            xData.push(`${i}:00`)
            seriesData.push(Math.floor(Math.random() * 30) + 10)
          }
          break
        case 'week':
          const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          days.forEach(day => {
            xData.push(day)
            seriesData.push(Math.floor(Math.random() * 80) + 40)
          })
          break
        case 'month':
          for (let i = 1; i <= 30; i += 2) {
            xData.push(`${i}日`)
            seriesData.push(Math.floor(Math.random() * 120) + 60)
          }
          break
      }

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          borderColor: '#3b82f6',
          textStyle: {
            color: '#fff'
          },
          formatter: '{b}<br/>能耗: {c} kWh'
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '8%',
          top: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xData,
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 10
          }
        },
        yAxis: {
          type: 'value',
          name: 'kWh',
          nameTextStyle: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 10
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.2)'
            }
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 10
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        series: [{
          name: '能耗',
          type: 'line',
          smooth: true,
          data: seriesData,
          itemStyle: {
            color: '#3b82f6'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
            ])
          },
          lineStyle: {
            width: 2
          },
          symbol: 'circle',
          symbolSize: 4
        }]
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

// 监听时间范围变化
watch(timeRange, updateChart)
</script>

<style scoped>
.energy-management {
  grid-column: span 1;
}

.energy-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100% - 48px);
}

.energy-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.energy-total,
.energy-today {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 6px;
  padding: 10px;
}

.energy-label {
  color: #94a3b8;
  font-size: 0.8rem;
  margin-bottom: 8px;
}

.energy-value {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.value-display {
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.value-unit {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-left: 4px;
}

.energy-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
}

.trend-up {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.trend-down {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.energy-progress {
  margin-top: 10px;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin: 6px 0;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 3px;
}

.chart-container {
  flex: 1;
  min-height: 120px;
  /* 减小高度 */
  margin: 4px 0;
}

.energy-distribution h4 {
  color: white;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.distribution-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.distribution-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.distribution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.distribution-name {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e2e8f0;
  font-size: 0.75rem;
}

.distribution-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.distribution-percentage {
  color: #3b82f6;
  font-weight: 600;
  font-size: 0.8rem;
}

.distribution-value {
  color: #94a3b8;
  font-size: 0.75rem;
  text-align: right;
}

.time-selector {
  background: rgba(30, 41, 59, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 4px 10px;
  font-size: 0.8rem;
  height: 28px;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .energy-summary {
    gap: 8px;
  }

  .energy-total,
  .energy-today {
    padding: 8px;
  }

  .value-display {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .energy-summary {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .chart-container {
    min-height: 120px;
  }
}
</style>