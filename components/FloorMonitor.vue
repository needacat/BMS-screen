<template>
    <div class="header">
        <div class="logo">
            <div class="logo-icon">
                <i class="fas fa-building"></i>
            </div>
            <div class="logo-text">
                <h1>建筑自动化系统 (BAS)</h1>
                <p>实时监控与控制面板 | 智慧建筑管理中心</p>
            </div>
        </div>
        <div class="system-info">
            <div class="info-item">
                <h3>系统状态</h3>
                <p class="status-active">运行正常</p>
            </div>
            <div class="info-item">
                <h3>在线设备</h3>
                <p>{{ onlineDevices }}/{{ totalDevices }}</p>
            </div>
            <div class="info-item">
                <h3>当前模式</h3>
                <p>{{ systemMode }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header',
    props: {
        systemMode: {
            type: String,
            default: '自动模式'
        },
        onlineDevices: {
            type: Number,
            default: 0
        },
        totalDevices: {
            type: Number,
            default: 0
        }
    }
}
</script>