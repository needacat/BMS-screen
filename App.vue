<template>
  <div class="bms-dashboard">
    <BuildingHeader :building-name="buildingName" :system-status="systemStatus" :last-update="lastUpdate" />

    <div class="floor-indicator">
      <span class="floor-label">楼层选择：</span>
      <div class="floor-buttons">
        <button v-for="floor in floors" :key="floor" class="floor-btn" :class="{ active: selectedFloor === floor }"
          @click="selectFloor(floor)">
          {{ floor }}层
        </button>
      </div>
    </div>

    <div class="main-grid">
      <BuildingOverview :selected-floor="selectedFloor" :building-data="buildingData" />

      <EnergyManagement :energy-data="energyData" />

      <EnvironmentalControl :environment-data="environmentData" @temperature-change="handleTemperatureChange" />

      <EquipmentStatus :equipment-list="equipmentList" :selected-floor="selectedFloor" />

      <SecuritySystem :security-data="securityData" :selected-floor="selectedFloor" />

      <AlarmCenter :alarms="activeAlarms" @acknowledge-alarm="acknowledgeAlarm" />
    </div>

    <BuildingFooter :total-alarms="activeAlarms.length" :system-mode="systemMode" @refresh="refreshData"
      @emergency="triggerEmergency" />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import BuildingHeader from './components/BuildingHeader.vue'
import BuildingOverview from './components/BuildingOverview.vue'
import EnergyManagement from './components/EnergyManagement.vue'
import EnvironmentalControl from './components/EnvironmentalControl.vue'
import EquipmentStatus from './components/EquipmentStatus.vue'
import SecuritySystem from './components/SecuritySystem.vue'
import AlarmCenter from './components/AlarmCenter.vue'
import BuildingFooter from './components/BuildingFooter.vue'

export default {
  name: 'App',
  components: {
    BuildingHeader,
    BuildingOverview,
    EnergyManagement,
    EnvironmentalControl,
    EquipmentStatus,
    SecuritySystem,
    AlarmCenter,
    BuildingFooter
  },
  setup() {
    // 楼宇信息
    const buildingName = ref('智慧大厦 - 总部大楼')
    const systemStatus = ref('normal')
    const systemMode = ref('auto')
    const lastUpdate = ref('')
    const selectedFloor = ref('1')

    // 楼层数据
    const floors = ['B2', 'B1', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

    // 楼宇数据
    const buildingData = reactive({
      totalArea: 28500,
      occupiedArea: 21400,
      peopleCount: 856,
      meetingRooms: 12,
      officeRooms: 156
    })

    // 能源数据
    const energyData = reactive({
      total: 2456.8,
      today: 156.3,
      trend: 2.5,
      distribution: {
        lighting: 35,
        hvac: 45,
        elevator: 12,
        other: 8
      }
    })

    // 环境数据
    const environmentData = reactive({
      temperature: 23.5,
      humidity: 65,
      co2: 420,
      pm25: 15,
      lighting: 350
    })

    // 设备列表
    const equipmentList = reactive([
      { id: 1, name: '中央空调主机', type: 'hvac', status: 'normal', floor: 'B2', lastMaintenance: '2024-03-15' },
      { id: 2, name: '电梯系统', type: 'elevator', status: 'normal', floor: 'B1', lastMaintenance: '2024-03-10' },
      { id: 3, name: '消防泵组', type: 'fire', status: 'warning', floor: 'B1', lastMaintenance: '2024-02-28' },
      { id: 4, name: '给水系统', type: 'water', status: 'normal', floor: 'B2', lastMaintenance: '2024-03-05' },
      { id: 5, name: '照明控制', type: 'lighting', status: 'normal', floor: '1', lastMaintenance: '2024-03-12' },
      { id: 6, name: '变配电系统', type: 'power', status: 'alarm', floor: 'B2', lastMaintenance: '2024-02-20' }
    ])

    // 安防数据
    const securityData = reactive({
      cameras: 24,
      onlineCameras: 22,
      accessPoints: 18,
      activeAlerts: 2,
      fireAlarms: 0,
      securityPatrols: 4
    })

    // 报警数据
    const activeAlarms = reactive([
      { id: 1, type: 'equipment', level: 'high', title: '变配电系统异常', description: 'B2层变电室温度过高', time: '14:30', acknowledged: false },
      { id: 2, type: 'security', level: 'medium', title: '门禁异常', description: '5层安全门未正常关闭', time: '14:15', acknowledged: false },
      { id: 3, type: 'environment', level: 'low', title: 'CO₂浓度偏高', description: '3层会议室CO₂浓度超过阈值', time: '13:45', acknowledged: true }
    ])

    // 选择楼层
    const selectFloor = (floor) => {
      selectedFloor.value = floor
      updateLastUpdate()
    }

    // 处理温度变化
    const handleTemperatureChange = (newTemp) => {
      environmentData.temperature = newTemp
      console.log(`温度调整为: ${newTemp}°C`)
    }

    // 确认报警
    const acknowledgeAlarm = (alarmId) => {
      const alarm = activeAlarms.find(a => a.id === alarmId)
      if (alarm) {
        alarm.acknowledged = true
      }
    }

    // 刷新数据
    const refreshData = () => {
      // 模拟数据更新
      buildingData.peopleCount = Math.floor(800 + Math.random() * 100)
      energyData.today = Math.floor(150 + Math.random() * 20)
      environmentData.temperature = (22 + Math.random() * 3).toFixed(1)

      // 随机切换一个设备状态
      const randomIndex = Math.floor(Math.random() * equipmentList.length)
      const statuses = ['normal', 'warning', 'alarm']
      equipmentList[randomIndex].status = statuses[Math.floor(Math.random() * statuses.length)]

      updateLastUpdate()
      alert('数据已刷新！')
    }

    // 触发紧急情况
    const triggerEmergency = () => {
      if (confirm('确定要触发紧急预案吗？')) {
        systemMode.value = 'emergency'
        systemStatus.value = 'alarm'

        // 添加紧急报警
        activeAlarms.unshift({
          id: Date.now(),
          type: 'emergency',
          level: 'high',
          title: '紧急预案启动',
          description: '系统已进入紧急模式',
          time: new Date().toLocaleTimeString(),
          acknowledged: false
        })

        alert('紧急预案已启动！')
      }
    }

    // 更新最后更新时间
    const updateLastUpdate = () => {
      lastUpdate.value = new Date().toLocaleTimeString()
    }

    // 初始化
    onMounted(() => {
      updateLastUpdate()

      // 模拟实时数据更新
      setInterval(() => {
        // 随机波动环境数据
        environmentData.temperature = (parseFloat(environmentData.temperature) + (Math.random() - 0.5) * 0.2).toFixed(1)
        environmentData.co2 = Math.max(350, Math.min(500, environmentData.co2 + (Math.random() - 0.5) * 5))

        updateLastUpdate()
      }, 3000)
    })

    return {
      buildingName,
      systemStatus,
      systemMode,
      lastUpdate,
      selectedFloor,
      floors,
      buildingData,
      energyData,
      environmentData,
      equipmentList,
      securityData,
      activeAlarms,
      selectFloor,
      handleTemperatureChange,
      acknowledgeAlarm,
      refreshData,
      triggerEmergency
    }
  }
}
</script>

<style scoped>
.bms-dashboard {
  min-height: 100vh;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.floor-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
  padding: 8px 12px;
  background: rgba(30, 41, 59, 0.7);
  border-radius: 8px;
}

.floor-label {
  color: #94a3b8;
  font-size: 0.9rem;
  white-space: nowrap;
}

.floor-buttons {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
  flex: 1;
}

.floor-btn {
  background: rgba(51, 65, 85, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  border-radius: 6px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  min-width: 48px;
  text-align: center;
  flex-shrink: 0;
  white-space: nowrap;
}

.floor-btn:hover {
  background: rgba(71, 85, 105, 0.9);
  transform: translateY(-1px);
}

.floor-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  /* 改为等宽三列 */
  grid-template-rows: auto auto;
  gap: 12px;
  flex: 1;
  margin-bottom: 12px;
  min-height: 600px;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .main-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
  }

  .bms-dashboard {
    padding: 10px;
    gap: 10px;
  }
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .floor-indicator {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .floor-buttons {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .main-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, auto);
    gap: 10px;
  }

  .bms-dashboard {
    padding: 8px;
    gap: 8px;
  }

  .floor-btn {
    padding: 4px 8px;
    font-size: 0.75rem;
    min-width: 44px;
  }
}
</style>