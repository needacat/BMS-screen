// 全局弹窗服务
let modalInstance = null

export const useModal = (instance) => {
    if (instance) {
        modalInstance = instance
    }
    return modalInstance
}

// 替代 alert
export const showAlert = (message, title = '提示') => {
    if (!modalInstance) {
        console.warn('[modal] modalInstance not registered — showAlert fallback skipped:', message)
        return Promise.resolve()
    }
    return modalInstance.showAlert(message, title)
}

// 替代 confirm
export const showConfirm = (message, title = '确认') => {
    if (!modalInstance) {
        console.warn('[modal] modalInstance not registered — showConfirm fallback returns true by default:', message)
        return Promise.resolve(true)
    }
    return modalInstance.showConfirm(message, title)
}

// 显示消息（自动关闭）
export const showMessage = (message, duration = 2000) => {
    if (!modalInstance) {
        console.warn('[modal] modalInstance not registered — showMessage fallback skipped:', message)
        return Promise.resolve()
    }
    return modalInstance.showMessage(message, duration)
}

// 替代 prompt（简化版，只返回确认或取消）
export const showPrompt = async (message, title = '输入', defaultValue = '', placeholder = '') => {
    if (!modalInstance) {
        console.warn('[modal] modalInstance not registered — showPrompt fallback returns null by default:', message)
        return Promise.resolve(null)
    }
    return modalInstance.showPrompt(message, title, defaultValue, placeholder)
}
