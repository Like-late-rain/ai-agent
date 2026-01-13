# TravelCheck API 交互测试指南

> 后端服务器: http://localhost:3000
> 前端应用: http://localhost:3001

---

## 📋 可测试的API接口

### 认证模块 (Authentication) - `/api/auth`

#### 1. 获取Nonce ✅ (无需认证)
```bash
POST /api/auth/nonce

# 请求示例
curl -X POST http://localhost:3000/api/auth/nonce \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x1234567890123456789012345678901234567890"
  }'

# 响应
{
  "code": 200,
  "message": "Success",
  "data": {
    "nonce": "abc123xyz",
    "message": "Sign this message to authenticate with TravelCheck.\n\nNonce: abc123xyz"
  },
  "timestamp": "2026-01-13T14:30:00.000Z"
}
```

#### 2. 验证签名 ✅ (无需认证)
```bash
POST /api/auth/verify

# 请求示例
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x1234567890123456789012345678901234567890",
    "signature": "0x...",
    "nonce": "abc123xyz"
  }'

# 响应
{
  "code": 200,
  "message": "Authentication successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "walletAddress": "0x1234...",
      "nickname": null,
      "avatar": null,
      "totalCheckins": 0,
      "currentStreak": 0,
      "maxStreak": 0,
      "lotteryChances": 0,
      "badges": [],
      "createdAt": "2026-01-13T14:30:00.000Z"
    }
  }
}
```

#### 3. 获取当前用户信息 🔒 (需要认证)
```bash
GET /api/auth/me

# 请求示例
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 响应
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": "user-123",
    "walletAddress": "0x1234...",
    "nickname": "用户昵称",
    "avatar": "头像URL",
    "totalCheckins": 10,
    "currentStreak": 5,
    "maxStreak": 7,
    "lotteryChances": 3,
    "badges": ["badge-1", "badge-2"],
    "createdAt": "2026-01-13T14:30:00.000Z"
  }
}
```

#### 4. 更新用户资料 🔒 (需要认证)
```bash
PUT /api/auth/me

# 请求示例
curl -X PUT http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "新昵称",
    "avatar": "新头像URL"
  }'
```

---

### 质押模块 (Staking) - `/api/staking` 🔒

**注意**: 所有质押API都需要认证

#### 1. 创建每日质押 🔒
```bash
POST /api/staking/daily

# 请求示例
curl -X POST http://localhost:3000/api/staking/daily \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "milestone": 30,
    "mode": "sealed",
    "taskId": "task-123"
  }'

# 参数说明:
# - amount: 质押金额
# - milestone: 里程碑天数 (7/14/30天)
# - mode: 模式 ("sealed"密封 或 "flexible"灵活)
# - taskId: 景点任务ID (可选)
```

#### 2. 获取我的质押列表 🔒
```bash
GET /api/staking/my

# 请求示例
curl http://localhost:3000/api/staking/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 查询参数 (可选):
# - status: active/completed/cancelled
```

#### 3. 获取质押详情 🔒
```bash
GET /api/staking/:id

# 请求示例
curl http://localhost:3000/api/staking/stake-123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. 切换里程碑 🔒
```bash
PUT /api/staking/:id/milestone

# 请求示例
curl -X PUT http://localhost:3000/api/staking/stake-123/milestone \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newMilestone": 30
  }'
```

#### 5. 提现质押 🔒
```bash
POST /api/staking/:id/withdraw

# 请求示例
curl -X POST http://localhost:3000/api/staking/stake-123/withdraw \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 打卡模块 (Check-in) - `/api/checkin` 🔒

**注意**: 所有打卡API都需要认证

#### 1. 提交每日打卡 🔒
```bash
POST /api/checkin/daily/submit

# 请求示例
curl -X POST http://localhost:3000/api/checkin/daily/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stakeId": "stake-123",
    "content": "今天去了美丽的公园,天气很好...(至少200字)",
    "location": {
      "latitude": 39.9042,
      "longitude": 116.4074,
      "address": "北京市朝阳区"
    },
    "photos": ["photo-url-1", "photo-url-2"]
  }'
```

#### 2. 补卡 🔒
```bash
POST /api/checkin/daily/makeup

# 请求示例
curl -X POST http://localhost:3000/api/checkin/daily/makeup \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stakeId": "stake-123",
    "date": "2026-01-12",
    "content": "补卡内容...",
    "location": {...},
    "photos": [...]
  }'
```

#### 3. 获取打卡日历 🔒
```bash
GET /api/checkin/daily/calendar

# 请求示例
curl "http://localhost:3000/api/checkin/daily/calendar?stakeId=stake-123&year=2026&month=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 查询参数:
# - stakeId: 质押ID (必需)
# - year: 年份 (可选,默认当前年)
# - month: 月份 (可选,默认当前月)
```

#### 4. 检查是否可以补卡 🔒
```bash
GET /api/checkin/daily/can-makeup

# 请求示例
curl "http://localhost:3000/api/checkin/daily/can-makeup?stakeId=stake-123&date=2026-01-12" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 5. 获取质押的打卡记录 🔒
```bash
GET /api/checkin/stake/:stakeId

# 请求示例
curl http://localhost:3000/api/checkin/stake/stake-123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 任务模块 (Tasks) - `/api/tasks`

#### 1. 获取景点任务列表 ✅ (可选认证)
```bash
GET /api/tasks/attractions

# 请求示例
curl "http://localhost:3000/api/tasks/attractions?page=1&pageSize=10&difficulty=easy"

# 查询参数 (可选):
# - page: 页码 (默认1)
# - pageSize: 每页数量 (默认10)
# - difficulty: 难度 (easy/medium/hard)
# - status: 状态 (active/upcoming/completed)
```

#### 2. 获取景点任务详情 ✅ (可选认证)
```bash
GET /api/tasks/attractions/:id

# 请求示例
curl http://localhost:3000/api/tasks/attractions/task-123
```

#### 3. 加入景点任务 🔒 (需要认证)
```bash
POST /api/tasks/:id/join

# 请求示例
curl -X POST http://localhost:3000/api/tasks/task-123/join \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "milestone": 30,
    "mode": "sealed"
  }'
```

---

### 奖励模块 (Rewards) - `/api/rewards` 🔒

**注意**: 所有奖励API都需要认证

#### 1. 领取红包奖励 🔒
```bash
POST /api/rewards/redpacket/claim

# 请求示例
curl -X POST http://localhost:3000/api/rewards/redpacket/claim \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rewardId": "reward-123"
  }'
```

#### 2. 获取未领取的红包 🔒
```bash
GET /api/rewards/redpacket/unclaimed

# 请求示例
curl http://localhost:3000/api/rewards/redpacket/unclaimed \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 3. 获取抽奖机会 🔒
```bash
GET /api/rewards/lottery/chances

# 请求示例
curl http://localhost:3000/api/rewards/lottery/chances \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. 抽奖 🔒
```bash
POST /api/rewards/lottery/spin

# 请求示例
curl -X POST http://localhost:3000/api/rewards/lottery/spin \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 5. 获取抽奖历史 🔒
```bash
GET /api/rewards/lottery/history

# 请求示例
curl http://localhost:3000/api/rewards/lottery/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 6. 获取徽章列表 🔒
```bash
GET /api/rewards/badges

# 请求示例
curl http://localhost:3000/api/rewards/badges \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎯 推荐测试流程

### 1. 基础认证流程 (前端操作)

```
1. 打开前端 http://localhost:3001
2. 点击 "Connect Wallet"
3. MetaMask 弹出连接请求 → 确认连接
4. 自动调用 /api/auth/nonce 获取nonce
5. MetaMask 弹出签名请求 → 签名
6. 自动调用 /api/auth/verify 验证签名
7. 认证成功,获得JWT token
8. Token自动保存到localStorage
```

### 2. 可直接测试的接口 (无需认证)

使用 curl 或 Postman 直接测试:

✅ `POST /api/auth/nonce` - 获取nonce
✅ `GET /api/tasks/attractions` - 浏览景点任务列表
✅ `GET /api/tasks/attractions/:id` - 查看景点详情

### 3. 需要认证的接口测试步骤

#### 方法1: 使用前端获取Token

1. 在前端完成钱包连接
2. 打开浏览器开发者工具 (F12)
3. 进入 Application → Local Storage
4. 找到 `travelcheck_token` 的值
5. 复制token用于API测试

#### 方法2: 使用curl完整流程

```bash
# 步骤1: 获取nonce
NONCE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/nonce \
  -H "Content-Type: application/json" \
  -d '{"address":"YOUR_WALLET_ADDRESS"}')

echo $NONCE_RESPONSE

# 步骤2: 使用MetaMask或其他工具签名message

# 步骤3: 验证签名获取token
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "address":"YOUR_WALLET_ADDRESS",
    "signature":"YOUR_SIGNATURE",
    "nonce":"NONCE_FROM_STEP1"
  }')

echo $TOKEN_RESPONSE

# 步骤4: 提取token
TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.data.token')

# 步骤5: 使用token测试其他接口
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔍 前端页面交互测试

### 1. 首页 (Home Page) - `/`
- ✅ 查看应用介绍
- ✅ 连接钱包按钮
- ✅ 导航到其他页面

### 2. 质押页面 (Stake Page) - `/stake`
- 🔒 需要先连接钱包
- ✅ 创建新质押
- ✅ 查看我的质押列表
- ✅ 查看质押详情
- ✅ 切换里程碑
- ✅ 提现质押

### 3. 打卡日历 (Calendar Page) - `/calendar/:stakeId`
- 🔒 需要先连接钱包
- ✅ 查看月度打卡日历
- ✅ 查看打卡统计
- ✅ 点击日期进入打卡页面

### 4. 打卡页面 (Check-in Page) - `/checkin/:stakeId`
- 🔒 需要先连接钱包
- ✅ 填写打卡内容 (至少200字)
- ✅ 获取GPS位置
- ✅ 上传照片 (可选)
- ✅ 提交打卡

### 5. 我的打卡记录 (My Check-ins) - `/my-checkins`
- 🔒 需要先连接钱包
- ✅ 查看所有打卡记录
- ✅ 筛选不同质押的打卡
- ✅ 查看打卡详情

### 6. 景点任务 (Attractions) - `/attractions`
- ✅ 浏览景点任务列表 (无需登录)
- ✅ 筛选任务 (难度、状态)
- ✅ 查看任务详情
- 🔒 加入任务 (需要认证)

### 7. 奖励页面 (Rewards) - `/rewards`
- 🔒 需要先连接钱包
- ✅ 查看可领取的红包
- ✅ 领取红包奖励
- ✅ 查看抽奖机会
- ✅ 进行抽奖
- ✅ 查看我的徽章

### 8. 个人资料 (Profile) - `/profile`
- 🔒 需要先连接钱包
- ✅ 查看个人信息
- ✅ 编辑昵称和头像
- ✅ 查看统计数据

---

## 📊 API状态说明

### 图例
- ✅ **可测试** - API已实现,可以直接测试
- 🔒 **需要认证** - 需要JWT token
- ⚠️ **部分实现** - 核心功能已实现,部分功能待完善
- ❌ **未实现** - 接口定义存在但功能未实现

### 当前状态
目前所有列出的接口都是 **✅ 可测试** 状态,只是部分需要认证。

---

## 🐛 常见问题

### 1. 401 Unauthorized 错误
**原因**: Token无效或已过期
**解决**: 重新连接钱包获取新token

### 2. 签名验证失败
**原因**: 消息格式不匹配
**解决**: 已修复,确保使用最新代码

### 3. CORS 错误
**原因**: 跨域配置问题
**解决**: 确保后端CORS配置正确

### 4. 404 Not Found
**原因**: API路径错误
**解决**: 检查URL是否包含 `/api` 前缀

---

## 🚀 快速开始

### 启动服务

```bash
# 终端1: 启动后端
cd travelcheck-backend
pnpm run dev

# 终端2: 启动前端
cd travelcheck-frontend
pnpm run dev
```

### 测试健康检查

```bash
curl http://localhost:3000/health
```

### 开始交互

1. 打开浏览器: http://localhost:3001
2. 连接MetaMask钱包
3. 开始探索应用!

---

**文档版本**: v1.0
**更新时间**: 2026-01-13
**维护者**: TravelCheck Team
