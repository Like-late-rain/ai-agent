# TravelCheck 部署文档

> 完整的部署和运行指南
> 更新时间：2024-01-06

---

## 📋 目录

- [环境要求](#环境要求)
- [前端部署](#前端部署)
- [后端部署](#后端部署)
- [智能合约部署](#智能合约部署)
- [配置说明](#配置说明)
- [测试指南](#测试指南)
- [常见问题](#常见问题)

---

## 🔧 环境要求

### 基础环境
```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git >= 2.30.0
```

### 开发工具
```bash
# 安装Node.js（推荐使用nvm）
nvm install 18
nvm use 18

# 验证安装
node --version  # v18.x.x
npm --version   # 9.x.x
```

### Web3环境
```bash
# MetaMask浏览器扩展
# 支持的浏览器：Chrome, Firefox, Brave, Edge

# 可选：安装Hardhat全局工具
npm install -g hardhat
```

---

## 🎨 前端部署

### 1. 安装依赖

```bash
cd travelcheck-frontend
npm install
```

### 2. 环境配置

创建`.env`文件：

```env
# API配置
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Web3配置
VITE_CHAIN_ID=1337
VITE_RPC_URL=http://127.0.0.1:8545

# 合约地址（部署后填入）
VITE_TCK_TOKEN_ADDRESS=0x...
VITE_STAKING_ADDRESS=0x...
VITE_BADGE_ADDRESS=0x...
```

### 3. 开发模式运行

```bash
npm run dev
```

访问：`http://localhost:3001`

### 4. 生产构建

```bash
npm run build
```

构建产物在`dist/`目录。

### 5. 生产部署

#### 使用Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/travelcheck-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 使用Vercel
```bash
npm install -g vercel
vercel deploy --prod
```

#### 使用Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 🚀 后端部署

### 1. 安装依赖

```bash
cd travelcheck-backend
npm install
```

### 2. 环境配置

创建`.env`文件：

```env
# 服务器配置
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# 数据库配置（未来使用）
# DATABASE_URL=postgresql://user:password@localhost:5432/travelcheck

# 文件存储路径
DATA_DIR=./data
UPLOAD_DIR=./uploads

# Web3配置
WEB3_PROVIDER_URL=http://127.0.0.1:8545
```

### 3. 开发模式运行

```bash
npm run dev
```

访问：`http://localhost:3000`

### 4. 生产构建

```bash
npm run build
```

### 5. 生产运行

```bash
npm start
```

### 6. 使用PM2管理进程

```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start dist/index.js --name travelcheck-api

# 查看状态
pm2 status

# 查看日志
pm2 logs travelcheck-api

# 重启应用
pm2 restart travelcheck-api

# 开机自启
pm2 startup
pm2 save
```

---

## ⛓️ 智能合约部署

### 1. 安装依赖

```bash
cd travelcheck-contracts
npm install
```

### 2. 环境配置

创建`.env`文件：

```env
# 部署账户私钥（警告：不要提交到Git）
PRIVATE_KEY=0x...

# RPC节点
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY

# Etherscan API（用于合约验证）
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

### 3. 编译合约

```bash
npx hardhat compile
```

### 4. 运行测试

```bash
npx hardhat test
```

### 5. 本地测试网部署

```bash
# 启动本地节点
npx hardhat node

# 新终端：部署合约
npx hardhat run scripts/deploy.js --network localhost
```

### 6. 测试网部署（Sepolia）

```bash
# 确保账户有Sepolia测试ETH
# 获取测试ETH：https://sepoliafaucet.com/

npx hardhat run scripts/deploy.js --network sepolia
```

### 7. 主网部署（生产环境）

```bash
# ⚠️ 警告：确保充分测试后再部署到主网

npx hardhat run scripts/deploy.js --network mainnet
```

### 8. 验证合约

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS "CONSTRUCTOR_ARG1" "CONSTRUCTOR_ARG2"
```

### 部署输出示例

```
Deploying TravelCheck contracts...

Deploying with account: 0x...
Account balance: 10.0 ETH

Deploying TravelCheck Token...
✅ TCK Token deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

Deploying Staking Contract...
✅ Staking Contract deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

Deploying Badge NFT Contract...
✅ Badge NFT Contract deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

============================================================
Deployment Summary
============================================================
TCK Token:           0x5FbDB2315678afecb367f032d93F642f64180aa3
Staking Contract:    0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Badge NFT Contract:  0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
============================================================
```

---

## ⚙️ 配置说明

### 前端配置文件

**`travelcheck-frontend/.env`**
```env
# 必填配置
VITE_API_BASE_URL=http://localhost:3000/api
VITE_CHAIN_ID=1337

# 合约地址（部署后填入）
VITE_TCK_TOKEN_ADDRESS=0x5FbDB...
VITE_STAKING_ADDRESS=0xe7f17...
VITE_BADGE_ADDRESS=0x9fE46...
```

### 后端配置文件

**`travelcheck-backend/.env`**
```env
PORT=3000
JWT_SECRET=change-this-to-secure-random-string
CORS_ORIGIN=http://localhost:3001
```

### 合约配置文件

**`travelcheck-contracts/hardhat.config.js`**
- 网络配置
- Gas优化设置
- Solidity版本

---

## 🧪 测试指南

### 前端测试

```bash
cd travelcheck-frontend

# 运行Lint
npm run lint

# 格式化代码
npm run format

# 类型检查
npm run type-check
```

### 后端测试

```bash
cd travelcheck-backend

# 运行Lint
npm run lint

# 格式化代码
npm run format

# 运行测试（未来）
# npm test
```

### 智能合约测试

```bash
cd travelcheck-contracts

# 运行所有测试
npx hardhat test

# 查看测试覆盖率
npx hardhat coverage

# Gas报告
REPORT_GAS=true npx hardhat test
```

---

## 🔍 健康检查

### 前端检查
```bash
curl http://localhost:3001
# 应返回HTML页面
```

### 后端检查
```bash
curl http://localhost:3000/api/health
# 应返回：{"status":"ok"}
```

### 合约检查
```javascript
// 使用ethers.js检查合约
const provider = new ethers.JsonRpcProvider("http://localhost:8545");
const tckToken = new ethers.Contract(TOKEN_ADDRESS, ABI, provider);
const name = await tckToken.name();
console.log(name); // "TravelCheck Token"
```

---

## 📝 常见问题

### 前端问题

**Q: 钱包连接失败**
```
A: 确保已安装MetaMask，并且网络配置正确
   - 检查Chain ID是否匹配
   - 检查RPC URL是否可访问
   - 尝试切换网络后重新连接
```

**Q: API请求失败**
```
A: 检查后端是否正常运行
   - 验证API_BASE_URL配置
   - 检查CORS设置
   - 查看浏览器控制台错误信息
```

### 后端问题

**Q: 端口已被占用**
```
A: 更改端口或停止占用进程
   # 查找占用进程
   lsof -i :3000
   # 停止进程
   kill -9 <PID>
```

**Q: JWT验证失败**
```
A: 确保JWT_SECRET配置正确
   - 前后端使用相同的secret
   - 检查token是否过期
   - 验证token格式
```

### 智能合约问题

**Q: 合约部署失败**
```
A: 检查账户余额和Gas设置
   - 确保账户有足够ETH支付Gas
   - 增加Gas Limit
   - 检查网络连接
```

**Q: 合约交互失败**
```
A: 验证合约地址和ABI
   - 确认合约地址正确
   - 检查ABI是否最新
   - 验证函数参数类型
```

---

## 🚦 生产环境清单

### 部署前检查

- [ ] 所有测试通过
- [ ] 代码已经过审计（智能合约）
- [ ] 环境变量已正确配置
- [ ] 数据库备份（如使用）
- [ ] SSL证书已配置
- [ ] 域名DNS已配置
- [ ] 监控告警已设置

### 部署后验证

- [ ] 前端页面可正常访问
- [ ] 钱包连接功能正常
- [ ] API接口响应正常
- [ ] 智能合约功能正常
- [ ] 日志记录正常
- [ ] 性能指标正常

---

## 📞 技术支持

### 文档链接
- React文档：https://react.dev
- Koa文档：https://koajs.com
- Hardhat文档：https://hardhat.org
- Ethers.js文档：https://docs.ethers.org

### 社区支持
- GitHub Issues：提交问题和建议
- 技术文档：查看详细API文档

---

## 📄 许可证

MIT License

---

*最后更新：2024-01-06*
*文档版本：v1.0*
