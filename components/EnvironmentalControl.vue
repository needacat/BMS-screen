<template>
  <div class="bms-card">
    <div class="card-header">
      <h3 class="card-title">
        <i class="fas fa-leaf"></i>
        环境控制
      </h3>
      <div class="mode-selector">
        <span class="mode-label">模式：</span>
        <select v-model="controlMode" @change="changeControlMode">
          <option value="auto">自动</option>
          <option value="manual">手动</option>
          <option value="eco">节能</option>
          <option value="comfort">舒适</option>
        </select>
      </div>
    </div>

    <div class="environment-content">
      <div class="env-sensors">
        <div class="env-sensor">
          <div class="sensor-icon" style="background: rgba(239, 68, 68, 0.1);">
            <i class="fas fa-thermometer-half" style="color: #ef4444;"></i>
          </div>
          <div class="sensor-info">
            <div class="sensor-label">温度</div>
            <div class="sensor-value">{{ formatTemperature(environmentData.temperature) }}</div>
            <div class="sensor-control">
              <button class="control-btn" @click="adjustTemperature(-0.5)" :disabled="controlMode === 'auto'">
                <i class="fas fa-minus"></i>
              </button>
              <span class="control-label">设定: {{ targetTemperature }}°C</span>
              <button class="control-btn" @click="adjustTemperature(0.5)" :disabled="controlMode === 'auto'">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="env-sensor">
          <div class="sensor-icon" style="background: rgba(59, 130, 246, 0.1);">
            <i class="fas fa-tint" style="color: #3b82f6;"></i>
          </div>
          <div class="sensor-info">
            <div class="sensor-label">湿度</div>
            <div class="sensor-value">{{ formatNumber(environmentData.humidity) }}%</div>
            <div class="sensor-status">
              <span class="status-indicator" :class="getHumidityStatus()">
                {{ getHumidityStatusText() }}
              </span>
            </div>
          </div>
        </div>

        <div class="env-sensor">
          <div class="sensor-icon" style="background: rgba(34, 197, 94, 0.1);">
            <i class="fas fa-wind" style="color: #22c55e;"></i>
          </div>
          <div class="sensor-info">
            <div class="sensor-label">CO₂浓度</div>
            <div class="sensor-value">{{ formatNumber(environmentData.co2) }} ppm</div>
            <div class="sensor-status">
              <span class="status-indicator" :class="getCO2Status()">
                {{ getCO2StatusText() }}
              </span>
            </div>
          </div>
        </div>

        <div class="env-sensor">
          <div class="sensor-icon" style="background: rgba(245, 158, 11, 0.1);">
            <i class="fas fa-sun" style="color: #f59e0b;"></i>
          </div>
          <div class="sensor-info">
            <div class="sensor-label">光照强度</div>
            <div class="sensor-value">{{ formatNumber(environmentData.lighting) }} lux</div>
            <div class="sensor-control">
              <div class="light-control">
                <i class="fas fa-lightbulb"></i>
                <input type="range" min="0" max="100" v-model="lightingLevel" class="light-slider"
                  @change="adjustLighting" :disabled="controlMode === 'auto'">
                <span>{{ lightingLevel }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="air-quality">
        <h4>空气质量指数</h4>
        <div class="aqi-display">
          <div class="aqi-value">{{ aqiValue }}</div>
          <div class="aqi-level" :class="aqiClass">{{ aqiLevel }}</div>
        </div>
        <div class="aqi-breakdown">
          <div class="aqi-item">
            <span class="aqi-label">PM2.5</span>
            <span class="aqi-number">{{ formatNumber(environmentData.pm25) }} μg/m³</span>
          </div>
          <div class="aqi-item">
            <span class="aqi-label">TVOC</span>
            <span class="aqi-number">0.32 mg/m³</span>
          </div>
          <div class="aqi-item">
            <span class="aqi-label">甲醛</span>
            <span class="aqi-number">0.02 mg/m³</span>
          </div>
        </div>
      </div>

      <div class="ventilation-control">
        <h4>新风系统</h4>
        <div class="ventilation-status">
          <div class="ventilation-info">
            <div class="ventilation-label">
              <i class="fas fa-fan"></i>
              运行状态
            </div>
            <div class="ventilation-value">
              <span class="status-indicator status-normal">运行中</span>
            </div>
          </div>
          <div class="ventilation-rate">
            <div class="rate-label">换气频率</div>
            <div class="rate-value">2.5 次/小时</div>
            <div class="rate-control">
              <button class="control-btn" @click="adjustVentilation(-0.5)">
                <i class="fas fa-minus"></i>
              </button>
              <span class="control-label">调节</span>
              <button class="control-btn" @click="adjustVentilation(0.5)">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  environmentData: {
    type: Object,
    default: () => ({
      temperature: 23.5,
      humidity: 65,
      co2: 420,
      pm25: 15,
      lighting: 350
    })
  }
})

const emit = defineEmits(['temperature-change'])

// 控制模式
const controlMode = ref('auto')
const targetTemperature = ref(23.5)
const lightingLevel = ref(70)

// 格式化数字，避免toFixed错误
const formatNumber = (value) => {
  const num = parseFloat(value)
  if (isNaN(num)) return '0'
  return Math.round(num)
}

// 格式化温度
const formatTemperature = (value) => {
  const num = parseFloat(value)
  if (isNaN(num)) return '0.0'
  return num.toFixed(1)
}

// 调整温度
const adjustTemperature = (delta) => {
  if (controlMode.value !== 'auto') {
    targetTemperature.value = parseFloat((targetTemperature.value + delta).toFixed(1))
    emit('temperature-change', targetTemperature.value)
  }
}

// 调整照明
const adjustLighting = () => {
  console.log(`照明亮度调整为: ${lightingLevel.value}%`)
}

// 调整新风
const adjustVentilation = (delta) => {
  console.log(`换气频率调整: ${delta}`)
}

// 改变控制模式
const changeControlMode = () => {
  console.log(`控制模式改为: ${controlMode.value}`)
}

// 湿度状态
const getHumidityStatus = () => {
  const humidity = parseFloat(props.environmentData.humidity)
  if (isNaN(humidity)) return 'status-normal'
  if (humidity < 40) return 'status-warning'
  if (humidity > 70) return 'status-warning'
  return 'status-normal'
}

const getHumidityStatusText = () => {
  const humidity = parseFloat(props.environmentData.humidity)
  if (isNaN(humidity)) return '正常'
  if (humidity < 40) return '偏低'
  if (humidity > 70) return '偏高'
  return '正常'
}

// CO2状态
const getCO2Status = () => {
  const co2 = parseFloat(props.environmentData.co2)
  if (isNaN(co2)) return 'status-normal'
  if (co2 > 800) return 'status-alarm'
  if (co2 > 600) return 'status-warning'
  return 'status-normal'
}

const getCO2StatusText = () => {
  const co2 = parseFloat(props.environmentData.co2)
  if (isNaN(co2)) return '良好'
  if (co2 > 800) return '严重'
  if (co2 > 600) return '偏高'
  return '良好'
}

// AQI计算
const aqiValue = computed(() => {
  const pm25 = parseFloat(props.environmentData.pm25)
  if (isNaN(pm25)) return 25
  if (pm25 <= 35) return Math.floor(pm25 * 50 / 35)
  if (pm25 <= 75) return 50 + Math.floor((pm25 - 35) * 50 / 40)
  if (pm25 <= 115) return 100 + Math.floor((pm25 - 75) * 50 / 40)
  return 150 + Math.floor((pm25 - 115) * 50 / 65)
})

const aqiLevel = computed(() => {
  const value = aqiValue.value
  if (value <= 50) return '优'
  if (value <= 100) return '良'
  if (value <= 150) return '轻度污染'
  if (value <= 200) return '中度污染'
  return '重度污染'
})

const aqiClass = computed(() => {
  const value = aqiValue.value
  if (value <= 50) return 'aqi-excellent'
  if (value <= 100) return 'aqi-good'
  if (value <= 150) return 'aqi-moderate'
  if (value <= 200) return 'aqi-unhealthy'
  return 'aqi-hazardous'
})
</script>

<style scoped>
.environment-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100% - 60px);
}

.env-sensors {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.env-sensor {
  background: rgba(30, 41, 59, 0.9);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.sensor-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.sensor-info {
  flex: 1;
}

.sensor-label {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.sensor-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
}

.sensor-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.control-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.3);
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-label {
  font-size: 0.85rem;
  color: #94a3b8;
  min-width: 80px;
  text-align: center;
}

.light-control {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.light-control i {
  color: #f59e0b;
}

.light-slider {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.light-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #f59e0b;
  cursor: pointer;
}

.sensor-status {
  margin-top: 8px;
}

.air-quality {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
  padding: 15px;
}

.air-quality h4 {
  color: white;
  font-size: 1rem;
  margin-bottom: 15px;
}

.aqi-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.aqi-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
}

.aqi-level {
  padding: 6px 15px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.9rem;
}

.aqi-excellent {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.aqi-good {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.aqi-moderate {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.aqi-unhealthy {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.aqi-hazardous {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.aqi-breakdown {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.aqi-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.aqi-label {
  color: #94a3b8;
  font-size: 0.85rem;
}

.aqi-number {
  color: #e2e8f0;
  font-size: 0.9rem;
  font-weight: 500;
}

.ventilation-control h4 {
  color: white;
  font-size: 1rem;
  margin-bottom: 15px;
}

.ventilation-status {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
  padding: 15px;
}

.ventilation-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.ventilation-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e2e8f0;
  font-size: 0.9rem;
}

.ventilation-label i {
  color: #3b82f6;
}

.ventilation-rate {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rate-label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.rate-value {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
}

.rate-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mode-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.mode-selector select {
  background: rgba(30, 41, 59, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .env-sensors {
    grid-template-columns: 1fr;
  }

  .aqi-breakdown {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .aqi-breakdown {
    grid-template-columns: 1fr;
  }
}
</style>