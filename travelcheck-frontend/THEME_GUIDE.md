# 主题切换功能使用指南

## 概述

TravelCheck 前端应用现在支持5种不同的主题色方案，每种主题都旨在唤起不同的旅行体验。

## 可用主题

### 🌲 森林绿 (Forest Green)
- **适用场景**: 徒步、森林步道、自然探索
- **主色**: 亮绿色 (#13ec5b)
- **风格**: 清新自然

### 🌊 海洋蓝 (Ocean Blue) - 默认主题
- **适用场景**: 海景、海滩、海岸冒险
- **主色**: 深蓝色 (#1E40AF)
- **风格**: 深邃宁静

### 🌅 日落橙 (Sunset Orange)
- **适用场景**: 沙漠日落、黄金时刻、温暖目的地
- **主色**: 橙色 (#F97316)
- **风格**: 温暖活力

### 🌸 樱花粉 (Sakura Pink)
- **适用场景**: 樱花、春季旅行、文化体验
- **主色**: 粉色 (#EC4899)
- **风格**: 浪漫温馨

### 🔮 紫罗兰 (Violet Purple)
- **适用场景**: 豪华旅行、夜市、异域目的地
- **主色**: 紫色 (#8B5CF6)
- **风格**: 神秘优雅

## 如何使用

### 用户端
1. 在应用右上角找到主题切换器（位于语言切换器左侧）
2. 点击当前主题按钮打开下拉菜单
3. 从列表中选择想要的主题
4. 主题会立即应用，并保存到浏览器本地存储

### 开发端

#### 使用主题 Context

```tsx
import { useTheme } from '@/contexts/ThemeContext'

function MyComponent() {
  const { theme, themeId, setTheme, availableThemes } = useTheme()

  return (
    <div>
      <p>当前主题: {theme.name}</p>
      <button onClick={() => setTheme('forest')}>
        切换到森林绿
      </button>
    </div>
  )
}
```

#### 添加新主题

1. 在 `src/config/themes.ts` 中添加新主题配置
2. 更新 `ThemeId` 类型定义（在 `src/types/theme.types.ts`）
3. 新主题会自动出现在主题切换器中

#### 使用 CSS 变量

所有主题色都通过 CSS 变量暴露：

```css
/* 可用的 CSS 变量 */
--color-primary
--color-primary-hover
--color-background-dark
--color-card-dark
--color-border-dark
--color-text-muted
--color-glow
--color-glow-strong
```

在组件中使用：

```tsx
<div style={{ backgroundColor: 'var(--color-primary)' }}>
  动态主题色背景
</div>
```

## 技术实现

### 架构
- **状态管理**: React Context API
- **持久化**: localStorage
- **样式系统**: Tailwind CSS + CSS Variables
- **类型安全**: TypeScript

### 核心文件
- `src/types/theme.types.ts` - 主题类型定义
- `src/config/themes.ts` - 主题配置
- `src/contexts/ThemeContext.tsx` - 主题状态管理
- `src/components/common/ThemeSwitcher/` - 主题切换器组件
- `tailwind.config.js` - Tailwind 主题配置

### 工作原理

1. **初始化**: `ThemeProvider` 从 localStorage 加载已保存的主题偏好
2. **应用主题**: 将主题颜色设置为 CSS 自定义属性到 `document.documentElement`
3. **Tailwind 集成**: Tailwind 类通过 CSS 变量引用颜色
4. **实时切换**: 更改主题时，CSS 变量立即更新，所有使用这些变量的元素自动更新

## 最佳实践

1. **优先使用 Tailwind 类**: 如 `bg-primary`, `text-primary-hover` 等
2. **避免硬编码颜色**: 始终使用主题系统中的颜色
3. **使用 CSS 变量**: 对于自定义样式，使用 `var(--color-*)` 而不是硬编码十六进制值
4. **保持一致性**: 确保新组件遵循现有的主题模式

## 示例

### 主题感知按钮

```tsx
function ThemedButton() {
  return (
    <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg">
      点击我
    </button>
  )
}
```

### 主题感知卡片

```tsx
function ThemedCard() {
  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-6">
      <h2 className="text-primary">标题</h2>
      <p className="text-text-muted">描述文字</p>
    </div>
  )
}
```

## 故障排除

### 主题未应用
- 检查 `ThemeProvider` 是否正确包裹应用
- 确认 CSS 变量在 `ThemeContext` 中正确设置
- 验证 Tailwind 配置使用 CSS 变量

### 颜色不更新
- 确保使用 Tailwind 类或 CSS 变量，而不是硬编码颜色
- 检查是否需要重新编译 Tailwind

### localStorage 问题
- 检查浏览器是否允许 localStorage
- 验证 `THEME_STORAGE_KEY` 常量

## 未来改进

- [ ] 添加深色/浅色模式切换
- [ ] 支持自定义主题创建
- [ ] 添加主题预览功能
- [ ] 支持主题动画过渡效果
- [ ] 添加主题导出/导入功能
