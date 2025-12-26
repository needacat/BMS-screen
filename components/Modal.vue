<template>
    <teleport to="body">
        <transition name="modal">
            <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
                <div class="modal-container" @click.stop>
                    <div class="modal-header">
                        <h3 class="modal-title">{{ title }}</h3>
                        <button class="modal-close" @click="closeModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div v-if="type === 'prompt'" class="prompt-body">
                            <div class="prompt-message">{{ message }}</div>
                            <input v-model="inputValue" :placeholder="placeholder" class="prompt-input" />
                        </div>
                        <div v-else>
                            {{ message }}
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button v-if="type !== 'alert'" class="modal-btn modal-btn-cancel" @click="handleCancel">
                            取消
                        </button>
                        <button class="modal-btn modal-btn-confirm" @click="handleConfirm">
                            {{ confirmText }}
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const title = ref('提示')
const message = ref('')
const type = ref('alert') // alert | confirm | prompt
const confirmText = ref('确定')
const placeholder = ref('')
const inputValue = ref('')
let resolveCallback = null

const closeModal = () => {
    visible.value = false
}

const handleOverlayClick = () => {
    closeModal()
}

const handleConfirm = () => {
    if (resolveCallback) {
        if (type.value === 'prompt') {
            resolveCallback(inputValue.value)
        } else {
            resolveCallback(true)
        }
    }
    // reset prompt value
    inputValue.value = ''
    placeholder.value = ''
    closeModal()
}

const handleCancel = () => {
    if (resolveCallback) {
        if (type.value === 'prompt') {
            resolveCallback(null)
        } else {
            resolveCallback(false)
        }
    }
    inputValue.value = ''
    placeholder.value = ''
    closeModal()
}

const showAlert = (msg, title_text = '提示') => {
    return new Promise((resolve) => {
        title.value = title_text
        message.value = msg
        type.value = 'alert'
        confirmText.value = '确定'
        visible.value = true
        resolveCallback = resolve
    })
}

const showConfirm = (msg, title_text = '确认') => {
    return new Promise((resolve) => {
        title.value = title_text
        message.value = msg
        type.value = 'confirm'
        confirmText.value = '确定'
        visible.value = true
        resolveCallback = resolve
    })
}

const showPrompt = (msg, title_text = '输入', defaultValue = '', placeholderText = '') => {
    return new Promise((resolve) => {
        title.value = title_text
        message.value = msg
        type.value = 'prompt'
        confirmText.value = '确定'
        inputValue.value = defaultValue || ''
        placeholder.value = placeholderText || ''
        visible.value = true
        resolveCallback = resolve
    })
}

const showMessage = (msg, duration = 2000) => {
    return new Promise((resolve) => {
        title.value = '消息'
        message.value = msg
        type.value = 'alert'
        confirmText.value = '关闭'
        visible.value = true
        resolveCallback = resolve

        setTimeout(() => {
            closeModal()
            resolve(true)
        }, duration)
    })
}

defineExpose({
    showAlert,
    showConfirm,
    showMessage,
    showPrompt,
    closeModal
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
}

.modal-container {
    background: rgba(30, 41, 59, 0.95);
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    min-width: 320px;
    max-width: 500px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    animation: slideUp 0.3s ease;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-title {
    color: white;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
}

.modal-close {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.modal-body {
    padding: 20px;
    color: #e2e8f0;
    font-size: 0.95rem;
    line-height: 1.5;
    word-break: break-word;
    white-space: pre-wrap;
}

.prompt-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.prompt-input {
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(15, 23, 42, 0.6);
    color: #e2e8f0;
    outline: none;
}

.prompt-input::placeholder {
    color: #94a3b8;
}

.modal-footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding: 16px 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-btn {
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    min-width: 80px;
}

.modal-btn-cancel {
    background: rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.modal-btn-cancel:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
}

.modal-btn-confirm {
    background: #3b82f6;
    color: white;
    border: 1px solid #3b82f6;
}

.modal-btn-confirm:hover {
    background: #2563eb;
    border-color: #2563eb;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
}

/* 动画 */
@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.modal-enter-to,
.modal-leave-from {
    opacity: 1;
    transform: scale(1);
}
</style>
