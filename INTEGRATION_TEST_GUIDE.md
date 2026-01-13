# TravelCheck 前后端集成测试指南

> 完成时间：2026-01-13
> 状态：已完成配置和API集成

---

## 📋 集成概况

### 已完成工作

1. ✅ 前端代理服务器配置 (Webpack Dev Server)
2. ✅ 后端CORS配置
3. ✅ 环境变量配置 (.env.development 和 .env.production)
4. ✅ 认证API集成 (钱包签名认证流程)
5. ✅ 质押API集成
6. ✅ 打卡API集成
7. ✅ 任务API集成
8. ✅ 奖励API集成

---

## 🚀 启动指南

### 1. 启动后端服务器

```bash
cd travelcheck-backend

# 安装依赖 (如果还没安装)
pnpm install

# 复制环境变量文件
cp .env.development .env

# 启动开发服务器
pnpm run dev
```

后端将运行在 `http://localhost:3000`

验证后端健康状态:
```bash
curl http://localhost:3000/health
```

### 2. 启动前端服务器

```bash
cd travelcheck-frontend

# 安装依赖 (如果还没安装)
pnpm install

# 启动开发服务器
pnpm run dev
```

前端将运行在 `http://localhost:3001`

---

## 🔧 配置说明

### 代理配置

前端开发服务器配置了代理,所有 `/api/*` 请求会被转发到后端服务器:

**文件**: `travelcheck-frontend/webpack/webpack.dev.js`
```javascript
proxy: [
  {
    context: ['/api'],
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
]
```

### CORS配置

后端已配置CORS允许前端跨域访问:

**文件**: `travelcheck-backend/src/app.ts`
```typescript
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  })
)
```

### 环境变量

#### 前端环境变量 (`.env.development`)
```env
VITE_API_BASE_URL=http://localhost:3001/api
NODE_ENV=development
```

#### 后端环境变量 (`.env.development`)
```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

---

## 🔌 API集成详情

### 1. 认证API

**钱包连接流程**:
1. 用户点击"Connect Wallet"
2. 前端调用 MetaMask 连接钱包
3. 前端请求后端获取 nonce: `POST /api/auth/nonce`
4. 前端使用 MetaMask 签名消息
5. 前端发送签名到后端验证: `POST /api/auth/verify`
6. 后端返回 JWT token 和用户信息
7. 前端保存 token 到 localStorage

**相关文件**:
- `travelcheck-frontend/src/store/wallet.atom.ts` - 钱包状态管理
- `travelcheck-frontend/src/services/auth.service.ts` - 认证API调用
- `travelcheck-backend/src/controllers/auth.controller.ts` - 认证控制器

**API端点**:
- `POST /api/auth/nonce` - 获取签名nonce
- `POST /api/auth/verify` - 验证签名并登录
- `GET /api/auth/me` - 获取当前用户信息 (需要认证)
- `PUT /api/auth/me` - 更新用户资料 (需要认证)

### 2. 质押API

**相关文件**:
- `travelcheck-frontend/src/services/staking.service.ts`
- `travelcheck-backend/src/controllers/staking.controller.ts`

**API端点**:
- `POST /api/staking/daily` - 创建每日质押
- `GET /api/staking/my` - 获取我的质押列表
- `GET /api/staking/:id` - 获取质押详情
- `PUT /api/staking/:id/milestone` - 切换里程碑
- `POST /api/staking/:id/withdraw` - 提现质押

### 3. 打卡API

**相关文件**:
- `travelcheck-frontend/src/services/checkin.service.ts`
- `travelcheck-backend/src/controllers/checkin.controller.ts`

**API端点**:
- `POST /api/checkin/daily/submit` - 提交每日打卡
- `POST /api/checkin/daily/makeup` - 补卡
- `GET /api/checkin/daily/calendar` - 获取打卡日历
- `GET /api/checkin/stake/:stakeId` - 获取质押的打卡记录
- `GET /api/checkin/:id` - 获取打卡详情
- `GET /api/checkin/stake/:stakeId/stats` - 获取打卡统计
- `POST /api/checkin/upload` - 上传打卡图片

### 4. 任务API

**相关文件**:
- `travelcheck-frontend/src/services/task.service.ts`
- `travelcheck-backend/src/controllers/task.controller.ts`

**API端点**:
- `GET /api/tasks/attractions` - 获取景点任务列表
- `GET /api/tasks/attractions/:id` - 获取景点任务详情
- `POST /api/tasks/:id/join` - 加入景点任务
- `GET /api/tasks/attractions/featured` - 获取推荐任务
- `GET /api/tasks/attractions/search` - 搜索任务

### 5. 奖励API

**相关文件**:
- `travelcheck-frontend/src/services/reward.service.ts`
- `travelcheck-backend/src/controllers/reward.controller.ts`

**API端点**:
- `POST /api/rewards/redpacket/claim` - 领取红包
- `GET /api/rewards/redpacket/unclaimed` - 获取未领取红包
- `GET /api/rewards/lottery/chances` - 获取抽奖机会
- `POST /api/rewards/lottery/spin` - 抽奖
- `GET /api/rewards/lottery/history` - 获取抽奖历史
- `GET /api/rewards/badges` - 获取徽章列表
- `GET /api/rewards` - 获取所有奖励
- `GET /api/rewards/stats` - 获取奖励统计

---

## 🧪 测试步骤

### 1. 测试钱包连接和认证

1. 打开浏览器访问 `http://localhost:3001`
2. 确保安装了 MetaMask 插件
3. 点击页面右上角的 "Connect Wallet" 按钮
4. MetaMask 弹窗,选择账户并连接
5. 签名认证消息
6. 检查钱包地址和余额是否正确显示
7. 打开浏览器 DevTools,检查:
   - localStorage 中是否存储了 token
   - localStorage 中是否存储了 user 信息
   - Network 标签中查看 API 请求是否成功

**预期结果**:
- 钱包连接成功
- 地址显示为 `0x1234...5678` 格式
- 余额正确显示
- 后端返回用户数据和 JWT token

### 2. 测试质押功能

1. 导航到 "Stake" 页面 (`/stake`)
2. 填写质押表单:
   - 选择类型: Daily Task
   - 输入金额: 100 TCK
   - 选择里程碑: 30 days
   - 选择模式: Sealed
3. 点击 "Create Stake" 按钮
4. 检查:
   - API 请求是否发送成功
   - 是否显示成功提示
   - 质押列表是否更新

**预期结果**:
- 质押创建成功
- 返回质押ID和详情
- 列表显示新创建的质押

### 3. 测试打卡功能

1. 从质押列表选择一个质押,点击 "Check In"
2. 导航到打卡页面 (`/checkin/:stakeId`)
3. 填写打卡内容 (至少200字)
4. 允许地理位置权限
5. 点击 "Submit Check-in"
6. 检查:
   - GPS 坐标是否获取成功
   - 打卡是否提交成功
   - 是否跳转回日历页面

**预期结果**:
- 打卡成功
- 日历显示今日已打卡
- 统计数据更新

### 4. 测试景点任务

1. 导航到 "Attractions" 页面 (`/attractions`)
2. 查看任务列表
3. 使用筛选器切换不同状态
4. 点击任务卡片查看详情
5. 点击 "Join Task" 加入任务

**预期结果**:
- 任务列表正确显示
- 筛选功能正常
- 可以成功加入任务

### 5. 测试奖励功能

1. 导航到 "Rewards" 页面 (`/rewards`)
2. 切换到"红包"标签
   - 查看红包列表
   - 点击领取红包
3. 切换到"抽奖"标签
   - 查看抽奖机会
   - 点击抽奖
4. 切换到"徽章"标签
   - 查看已获得的徽章

**预期结果**:
- 红包领取成功
- 抽奖正常运行
- 徽章正确显示

---

## 🐛 常见问题排查

### 1. 连接钱包失败

**问题**: 点击"Connect Wallet"没有反应

**排查步骤**:
1. 检查是否安装了 MetaMask
2. 打开浏览器控制台查看错误信息
3. 检查 `travelcheck-frontend/src/utils/web3.ts` 中的错误处理

### 2. API 请求失败

**问题**: API 请求返回 404 或 500 错误

**排查步骤**:
1. 确认后端服务器是否正在运行
2. 检查后端控制台是否有错误信息
3. 使用 curl 或 Postman 测试 API 端点
4. 检查 API 路径是否正确 (应该以 `/api` 开头)
5. 检查请求头中是否包含正确的 Authorization token

### 3. CORS 错误

**问题**: 浏览器控制台显示 CORS 错误

**排查步骤**:
1. 检查后端 `.env` 文件中的 `CORS_ORIGIN` 配置
2. 确认前端运行在 `http://localhost:3001`
3. 重启后端服务器

### 4. 认证失败

**问题**: 登录后 token 无效或接口返回 401

**排查步骤**:
1. 检查 localStorage 中是否存储了 token
2. 检查 `JWT_SECRET` 配置是否正确
3. 检查 token 是否过期
4. 重新连接钱包并登录

### 5. 代理不工作

**问题**: 前端无法访问后端 API

**排查步骤**:
1. 检查 `webpack.dev.js` 中的代理配置
2. 重启前端开发服务器
3. 查看 Network 标签中请求的实际 URL

---

## 📊 API 测试工具

### 使用 curl 测试 API

#### 1. 健康检查
```bash
curl http://localhost:3000/health
```

#### 2. 获取 nonce
```bash
curl -X POST http://localhost:3000/api/auth/nonce \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x1234567890123456789012345678901234567890"}'
```

#### 3. 获取用户信息 (需要 token)
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. 创建质押 (需要 token)
```bash
curl -X POST http://localhost:3000/api/staking/daily \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "milestone": 30,
    "mode": "sealed"
  }'
```

### 使用浏览器 DevTools

1. 打开 Chrome DevTools (F12)
2. 切换到 "Network" 标签
3. 筛选 "Fetch/XHR" 请求
4. 观察 API 请求和响应
5. 检查请求头、请求体和响应数据

---

## 📝 下一步工作

### Stage 9: 智能合约开发

在前后端联调完成后,下一步是开发智能合约:

1. **Hardhat 项目初始化**
   - 安装 Hardhat 和相关依赖
   - 配置 Hardhat 网络

2. **TCK 代币合约 (ERC-20)**
   - 实现铸造和销毁功能
   - 实现转账功能
   - 实现授权机制

3. **质押合约**
   - 实现质押逻辑
   - 实现利息计算
   - 实现提现功能

4. **徽章 NFT 合约 (ERC-721)**
   - Soulbound 实现
   - 徽章铸造
   - 元数据 URI

5. **合约测试和部署**
   - 编写单元测试
   - 部署到测试网
   - 前端集成合约调用

### Stage 10: 部署文档

1. 环境配置说明
2. 前端部署步骤
3. 后端部署步骤
4. 智能合约部署
5. 测试指南
6. 常见问题 FAQ

---

## 🎉 成就总结

### 已完成

- ✅ 完整的前后端架构
- ✅ 钱包签名认证流程
- ✅ RESTful API 设计
- ✅ TypeScript 类型安全
- ✅ 统一的错误处理
- ✅ 开发环境配置
- ✅ API 代理配置
- ✅ CORS 配置

### 技术栈

**前端**:
- React 18
- TypeScript
- Jotai (状态管理)
- Axios (HTTP 客户端)
- Ethers.js (Web3)
- Webpack 5
- TailwindCSS

**后端**:
- Node.js
- Koa 2
- TypeScript
- JWT 认证
- Ethers.js (签名验证)

---

**文档版本**: v1.0
**更新时间**: 2026-01-13
**生成工具**: Claude Code
