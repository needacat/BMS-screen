<!-- src/components/NumberFlop.vue -->
<template>
    <div class="number-flop-container">
        <div v-for="(digit, index) in displayDigits" :key="index" class="number-flop-digit" :style="{
            height: `${height}px`,
            lineHeight: `${height}px`,
            fontSize: `${height * 0.7}px`
        }">
            <div class="number-flop-item" :style="{ transform: `translateY(-${digit * 10}%)` }">
                <span v-for="n in 10" :key="n">{{ (n - 1) % 10 }}</span>
            </div>
        </div>
        <span v-if="unit" class="number-flop-unit">{{ unit }}</span>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    value: {
        type: [Number, String],
        default: 0
    },
    height: {
        type: Number,
        default: 50
    },
    duration: {
        type: Number,
        default: 800
    },
    unit: {
        type: String,
        default: ''
    },
    decimals: {
        type: Number,
        default: 0
    }
})

const displayValue = ref(0)
const animationFrame = ref(null)

// 格式化数字为指定位数
const formatNumber = (num) => {
    const number = parseFloat(num)
    if (isNaN(number)) return '0'

    if (props.decimals > 0) {
        return number.toFixed(props.decimals)
    }
    return Math.round(number).toString()
}

// 将数字拆分为单个数字
const displayDigits = computed(() => {
    const numStr = formatNumber(displayValue.value)
    return numStr.split('').map(char => {
        return char === '.' ? '.' : parseInt(char)
    })
})

// 动画函数
const animateToValue = (targetValue) => {
    const startValue = displayValue.value
    const endValue = parseFloat(targetValue)
    const startTime = Date.now()

    const animate = () => {
        const currentTime = Date.now()
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / props.duration, 1)

        // 使用缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        displayValue.value = startValue + (endValue - startValue) * easeOutQuart

        if (progress < 1) {
            animationFrame.value = requestAnimationFrame(animate)
        }
    }

    if (animationFrame.value) {
        cancelAnimationFrame(animationFrame.value)
    }
    animationFrame.value = requestAnimationFrame(animate)
}

// 监听value变化
watch(() => props.value, (newValue) => {
    const numValue = parseFloat(newValue)
    if (!isNaN(numValue)) {
        animateToValue(numValue)
    }
}, { immediate: true })

// 组件挂载时初始化
onMounted(() => {
    const numValue = parseFloat(props.value)
    if (!isNaN(numValue)) {
        displayValue.value = numValue
    }
})

// 组件卸载时清理
onUnmounted(() => {
    if (animationFrame.value) {
        cancelAnimationFrame(animationFrame.value)
    }
})
</script>

<style scoped>
.number-flop-container {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Arial', 'Microsoft YaHei', sans-serif;
    font-weight: bold;
    color: #fff;
}

.number-flop-digit {
    position: relative;
    width: auto;
    min-width: 0.6em;
    overflow: hidden;
    text-align: center;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    margin: 0 1px;
}

.number-flop-item {
    display: flex;
    flex-direction: column;
    transition: transform v-bind('duration + "ms"') cubic-bezier(0.22, 0.61, 0.36, 1);
}

.number-flop-item span {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.number-flop-unit {
    margin-left: 5px;
    font-size: 0.6em;
    opacity: 0.8;
}
</style>