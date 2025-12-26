<template>
    <div class="bms-card security-system">
        <div class="card-header">
            <h3 class="card-title">
                <i class="fas fa-shield-alt"></i>
                安防系统
            </h3>
            <div class="security-mode">
                <span class="mode-label">模式：</span>
                <span class="mode-value" :class="securityModeClass">{{ securityMode }}</span>
            </div>
        </div>

        <div class="security-content">
            <div class="security-overview">
                <div class="overview-item">
                    <div class="overview-icon" style="color: #3b82f6;">
                        <i class="fas fa-video"></i>
                    </div>
                    <div class="overview-info">
                        <div class="overview-value">{{ securityData.cameras }}</div>
                        <div class="overview-label">监控摄像头</div>
                        <div class="overview-status">
                            <span class="status-indicator" :class="cameraStatusClass">
                                {{ securityData.onlineCameras }} 在线
                            </span>
                        </div>
                    </div>
                </div>

                <div class="overview-item">
                    <div class="overview-icon" style="color: #22c55e;">
                        <i class="fas fa-door-closed"></i>
                    </div>
                    <div class="overview-info">
                        <div class="overview-value">{{ securityData.accessPoints }}</div>
                        <div class="overview-label">门禁点位</div>
                        <div class="overview-status">
                            <span class="status-indicator status-normal">全部正常</span>
                        </div>
                    </div>
                </div>

                <div class="overview-item">
                    <div class="overview-icon" style="color: #ef4444;">
                        <i class="fas fa-fire-extinguisher"></i>
                    </div>
                    <div class="overview-info">
                        <div class="overview-value">{{ securityData.fireAlarms }}</div>
                        <div class="overview-label">火警报警</div>
                        <div class="overview-status">
                            <span class="status-indicator status-normal">无报警</span>
                        </div>
                    </div>
                </div>

                <div class="overview-item">
                    <div class="overview-icon" style="color: #f59e0b;">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <div class="overview-info">
                        <div class="overview-value">{{ securityData.securityPatrols }}</div>
                        <div class="overview-label">巡逻人员</div>
                        <div class="overview-status">
                            <span class="status-indicator status-normal">执勤中</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="camera-grid">
                <h4>实时监控</h4>
                <div class="cameras">
                    <div v-for="camera in floorCameras" :key="camera.id" class="camera-item"
                        @click="showCameraFeed(camera)">
                        <div class="camera-preview">
                            <div class="camera-placeholder">
                                <i class="fas fa-video"></i>
                                <span>摄像头 {{ camera.id }}</span>
                            </div>
                            <div class="camera-status" :class="camera.status">
                                <i class="fas fa-circle"></i>
                            </div>
                        </div>
                        <div class="camera-info">
                            <div class="camera-name">{{ camera.name }}</div>
                            <div class="camera-location">
                                <i class="fas fa-map-marker-alt"></i>
                                {{ camera.location }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="access-control">
                <h4>门禁控制</h4>
                <div class="access-list">
                    <div v-for="door in floorDoors" :key="door.id" class="access-item">
                        <div class="door-info">
                            <div class="door-name">{{ door.name }}</div>
                            <div class="door-status">
                                <span class="status-indicator" :class="door.status">
                                    {{ door.status === 'open' ? '开启' : '关闭' }}
                                </span>
                            </div>
                        </div>
                        <div class="door-control">
                            <button class="btn btn-small" :class="{ 'btn-primary': door.status === 'closed' }"
                                @click="toggleDoor(door)">
                                {{ door.status === 'open' ? '关闭' : '开启' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { showAlert } from '../utils/modal.js'

const props = defineProps({
    securityData: {
        type: Object,
        default: () => ({})
    },
    selectedFloor: {
        type: String,
        default: '1'
    }
})

// 安防模式
const securityMode = computed(() => {
    return props.selectedFloor === '1' ? '标准模式' : '普通模式'
})

const securityModeClass = computed(() => {
    return securityMode.value === '标准模式' ? 'mode-standard' : 'mode-normal'
})

// 摄像头状态
const cameraStatusClass = computed(() => {
    const onlineRate = props.securityData.onlineCameras / props.securityData.cameras
    if (onlineRate >= 0.9) return 'status-normal'
    if (onlineRate >= 0.7) return 'status-warning'
    return 'status-alarm'
})

// 楼层摄像头数据
const floorCameras = computed(() => {
    const cameraCount = props.selectedFloor === '1' ? 4 : 3

    return Array.from({ length: cameraCount }, (_, i) => ({
        id: i + 1,
        name: `${props.selectedFloor}层摄像头${i + 1}`,
        location: getCameraLocation(i),
        status: Math.random() > 0.2 ? 'online' : 'offline'
    }))
})

// 获取摄像头位置
const getCameraLocation = (index) => {
    const locations = ['大堂入口', '电梯厅', '走廊', '安全通道', '会议室前厅']
    return locations[index % locations.length]
}

// 楼层门禁数据
const floorDoors = computed(() => {
    const doorCount = props.selectedFloor === '1' ? 3 : 2

    return Array.from({ length: doorCount }, (_, i) => ({
        id: i + 1,
        name: `${props.selectedFloor}层${['A', 'B', 'C'][i]}安全门`,
        status: Math.random() > 0.5 ? 'open' : 'closed'
    }))
})

// 显示摄像头画面
const showCameraFeed = async (camera) => {
    if (camera.status === 'online') {
        await showAlert(`正在调取摄像头: ${camera.name}\n位置: ${camera.location}`, '摄像头')
    } else {
        await showAlert(`摄像头 ${camera.name} 处于离线状态`, '摄像头离线')
    }
}

// 开关门禁
const toggleDoor = (door) => {
    door.status = door.status === 'open' ? 'closed' : 'open'
    console.log(`${door.name} 已${door.status === 'open' ? '开启' : '关闭'}`)
}

// 监听楼层变化
watch(() => props.selectedFloor, () => {
    console.log(`更新${props.selectedFloor}层安防数据`)
})
</script>

<style scoped>
.security-system {
    grid-column: span 1;
}

.security-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: calc(100% - 48px);
}

.security-overview {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.overview-item {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 6px;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.overview-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
}

.overview-info {
    flex: 1;
    min-width: 0;
}

.overview-value {
    font-size: 1.4rem;
    font-weight: 700;
    color: white;
    margin-bottom: 4px;
    line-height: 1;
}

.overview-label {
    color: #94a3b8;
    font-size: 0.75rem;
    margin-bottom: 6px;
    white-space: nowrap;
}

.camera-grid h4,
.access-control h4 {
    color: white;
    font-size: 0.9rem;
    margin-bottom: 8px;
}

.cameras {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 12px;
}

.camera-item {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
}

.camera-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.camera-preview {
    position: relative;
    height: 80px;
    background: rgba(30, 41, 59, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
}

.camera-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #94a3b8;
}

.camera-placeholder i {
    font-size: 1.2rem;
    color: #3b82f6;
}

.camera-placeholder span {
    font-size: 0.75rem;
}

.camera-status {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 12px;
    height: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.camera-status.online i {
    color: #22c55e;
    animation: pulse 2s infinite;
    font-size: 0.8rem;
}

.camera-status.offline i {
    color: #ef4444;
    font-size: 0.8rem;
}

.camera-info {
    padding: 8px;
}

.camera-name {
    color: white;
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.camera-location {
    color: #94a3b8;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 4px;
}

.access-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.access-item {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 6px;
    padding: 8px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.door-info {
    flex: 1;
    min-width: 0;
}

.door-name {
    color: white;
    font-weight: 600;
    font-size: 0.85rem;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.btn-small {
    padding: 4px 10px;
    font-size: 0.75rem;
    white-space: nowrap;
}

.security-mode {
    display: flex;
    align-items: center;
    gap: 6px;
}

.mode-label {
    color: #94a3b8;
    font-size: 0.8rem;
}

.mode-value {
    padding: 3px 10px;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 500;
}

.mode-standard {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
}

.mode-normal {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
}

@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

/* 响应式设计 */
@media (max-width: 1400px) {
    .security-overview {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }

    .overview-item {
        padding: 8px;
        gap: 8px;
    }

    .overview-value {
        font-size: 1.3rem;
    }
}

@media (max-width: 1200px) {
    .cameras {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .camera-preview {
        height: 70px;
    }
}

@media (max-width: 768px) {
    .security-overview {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .access-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .door-control {
        align-self: flex-end;
    }
}
</style>