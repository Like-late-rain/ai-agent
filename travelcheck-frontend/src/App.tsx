/**
 * @file 根组件
 * @description 应用的根组件，配置路由和全局状态
 */

const App = () => {
  return (
    <div className="min-h-screen bg-background-dark">
      <div className="container py-8">
        <h1 className="text-4xl font-bold text-gradient">TravelCheck</h1>
        <p className="mt-4 text-text-muted">区块链旅行打卡DApp - 探索世界，链上记录</p>
        <div className="mt-8 card">
          <h2 className="text-2xl font-semibold mb-4">欢迎使用 TravelCheck</h2>
          <p className="text-text-muted">项目正在开发中...</p>
        </div>
      </div>
    </div>
  )
}

export default App
