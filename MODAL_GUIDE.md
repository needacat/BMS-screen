## 自定义弹窗组件使用指南

### 概述
已为项目添加了自定义 Modal 弹窗组件，替代浏览器原生的 `alert`、`confirm` 和 `prompt`。

### 组件位置
- **Modal 组件**: `components/Modal.vue`
- **弹窗服务**: `utils/modal.js`

### 使用方法

#### 1. 在 App.vue 中已集成 Modal 组件
```vue
<Modal ref="modalRef" />
```

#### 2. 在各个需要弹窗的组件中使用

##### 替代 alert（弹出提示）
```javascript
import { showAlert } from '@/utils/modal'

// 使用方式
await showAlert('操作成功！', '成功提示')
```

##### 替代 confirm（确认对话框）
```javascript
import { showConfirm } from '@/utils/modal'

// 使用方式
const result = await showConfirm('确定要删除吗？', '确认删除')
if (result) {
  // 用户点击了确定
} else {
  // 用户点击了取消
}
```

##### 显示消息（自动关闭）
```javascript
import { showMessage } from '@/utils/modal'

// 使用方式 - 2秒后自动关闭
await showMessage('操作已完成', 2000)
```

### 现有弹窗使用位置
项目中已使用浏览器弹窗的位置：

1. **AlarmCenter.vue** (报警中心)
   - Line 186: `confirm('确认所有未处理报警？')`
   - Line 200: `prompt('请输入处理人员姓名：')`
   - Line 202: `alert('已分配给：...')`
   - Line 209: `confirm('确定要忽略此报警吗？')`

2. **App.vue** (主应用)
   - Line 159: `alert('数据已刷新！')`
   - Line 164: `confirm('确定要触发紧急预案吗？')`
   - Line 179: `alert('紧急预案已启动！')`

3. **SecuritySystem.vue** (安防系统)
   - Line 184: `alert('正在调取摄像头：...')`
   - Line 186: `alert('摄像头处于离线状态')`

4. **EquipmentStatus.vue** (设备状态)
   - Line 206: `alert('设备详情：...')`

5. **BuildingHeader.vue** (楼宇头部)
   - Line 78: `alert('数据导出功能正在开发中...')`
   - Line 83: `alert('系统设置功能正在开发中...')`

6. **BuildingFooter.vue** (楼宇底部)
   - Line 124: `alert('系统日志：...')`
   - Line 136: `confirm('确定要启动紧急预案吗？')`

### 迁移步骤

1. 在需要使用弹窗的组件中导入服务：
```javascript
import { showAlert, showConfirm, showMessage } from '@/utils/modal'
```

2. 将原有的弹窗调用替换为新的异步调用：
```javascript
// 旧方式
if (confirm('确认吗？')) {
  doSomething()
}

// 新方式
const confirmed = await showConfirm('确认吗？')
if (confirmed) {
  doSomething()
}
```

### Modal 组件特性
- ✅ 自定义样式，与系统主题统一
- ✅ 支持动画过渡效果
- ✅ 点击背景自动关闭
- ✅ ESC 键关闭
- ✅ Promise 基础的异步 API
- ✅ 自动消息（可设置显示时长）
- ✅ 响应式设计

### 注意事项
- Modal 组件使用 `teleport` 将弹窗挂载到 body，避免 CSS 堆叠上下文问题
- 所有弹窗方法都返回 Promise，支持 async/await
- 建议逐步替换各个组件中的弹窗调用
