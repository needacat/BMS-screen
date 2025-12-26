<template>
    <div class="footer-container">
        <div class="footer">
            <div class="last-update">
                <i class="fas fa-clock"></i>
                <span>最后更新: {{ lastUpdate }}</span>
            </div>
            <div class="footer-actions">
                <button class="refresh-btn" @click="$emit('refresh')">
                    <i class="fas fa-sync-alt"></i>
                    刷新数据
                </button>
                <div class="system-status">
                    <span class="status-dot" :class="{ 'active': systemActive }"></span>
                    系统状态: {{ systemActive ? '正常' : '异常' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    name: 'Footer',
    props: {
        lastUpdate: {
            type: String,
            default: ''
        }
    },
    emits: ['refresh'],
    setup() {
        const systemActive = ref(true)

        // 模拟系统状态检查
        setInterval(() => {
            systemActive.value = Math.random() > 0.1
        }, 10000)

        return {
            systemActive
        }
    }
}
</script>

<style scoped>
.footer-container {
    width: 100%;
    margin-top: auto;
    position: sticky;
    bottom: 0;
    z-index: 100;
    background: rgba(12, 26, 45, 0.9);
    backdrop-filter: blur(10px);
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.9rem;
    color: #a0a0a0;
    flex-wrap: wrap;
    gap: 15px;
}

.last-update {
    display: flex;
    align-items: center;
    gap: 10px;
}

.last-update i {
    color: #4fc3f7;
}

.footer-actions {
    display: flex;
    align-items: center;
    gap: 20px;
}

.refresh-btn {
    background: rgba(79, 195, 247, 0.2);
    color: #4fc3f7;
    border: none;
    border-radius: 6px;
    padding: 8px 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    white-space: nowrap;
}

.refresh-btn:hover {
    background: rgba(79, 195, 247, 0.3);
    transform: translateY(-1px);
}

.refresh-btn:active {
    transform: translateY(0);
}

.system-status {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #f44336;
    transition: background-color 0.3s ease;
}

.status-dot.active {
    background-color: #4caf50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .footer {
        flex-direction: column;
        text-align: center;
        gap: 10px;
        padding: 10px 15px;
    }

    .last-update {
        justify-content: center;
    }

    .footer-actions {
        justify-content: center;
        flex-wrap: wrap;
        gap: 15px;
    }
}

@media (max-width: 480px) {
    .footer-actions {
        flex-direction: column;
        gap: 10px;
    }

    .refresh-btn {
        width: 100%;
        justify-content: center;
    }
}
</style>