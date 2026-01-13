# 个人中心页面集成后端API修复方案

## 问题描述

个人中心页面 (`ProfilePage.tsx`) 目前使用硬编码的Mock数据,没有调用后端API获取真实的用户数据。

**当前问题**:
- 第22-34行使用硬编码的用户数据
- 第36-43行使用硬编码的统计数据
- 编辑个人资料功能只显示alert,没有调用后端API

## 修复方案

### 1. 使用真实的用户数据

**修改导入部分** (第6-13行):
```typescript
// 添加以下导入
import { useAtom, useSetAtom } from "jotai";
import { updateUserAtom, userAtom } from "@/store/user.atom";
```

**替换Mock数据** (第22-34行):
```typescript
// 删除这部分:
const [user] = useState<User>({
  id: "user1",
  walletAddress: address || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  // ... 其他硬编码数据
});

// 改为:
const [user] = useAtom(userAtom);
const updateUser = useSetAtom(updateUserAtom);
```

### 2. 添加编辑功能状态

```typescript
const [isEditing, setIsEditing] = useState(false);
const [nickname, setNickname] = useState(user?.nickname || "");
const [avatar, setAvatar] = useState(user?.avatar || "");
```

### 3. 实现编辑个人资料功能

**修改handleEditProfile** (第45-47行):
```typescript
const handleEditProfile = () => {
  setIsEditing(true);
};

const handleSaveProfile = async () => {
  try {
    // 调用后端API更新用户资料
    // 注意: 需要先创建API服务函数
    // await updateUserProfile({ nickname, avatar });

    // 更新本地状态
    updateUser({ nickname, avatar });
    setIsEditing(false);
  } catch (error) {
    console.error("Failed to update profile:", error);
    alert("更新失败,请重试");
  }
};

const handleCancelEdit = () => {
  setNickname(user?.nickname || "");
  setAvatar(user?.avatar || "");
  setIsEditing(false);
};
```

**修改handleChangeAvatar** (第49-51行):
```typescript
const handleChangeAvatar = () => {
  const newAvatar = prompt("输入新的头像URL:");
  if (newAvatar) {
    setAvatar(newAvatar);
    updateUser({ avatar: newAvatar });
  }
};
```

### 4. 添加未登录状态处理

在组件开头添加:
```typescript
if (!user) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-xl text-text-muted mb-4">
          请先连接钱包
        </p>
        <Button onClick={() => window.location.href = "/"}>
          连接钱包
        </Button>
      </div>
    </div>
  );
}
```

### 5. 修改用户信息显示部分

在用户信息区域 (第122-160行) 添加编辑模式:
```typescript
{isEditing ? (
  <div className="mb-4">
    <input
      type="text"
      value={nickname}
      onChange={(e) => setNickname(e.target.value)}
      className="text-2xl font-bold bg-background-card text-white border border-primary rounded px-3 py-1"
      placeholder="输入昵称"
    />
  </div>
) : (
  <h2 className="text-2xl font-bold text-white mb-2">
    {user.nickname || "Anonymous"}
  </h2>
)}

// ... 在按钮区域:
<div className="mt-4 space-x-2">
  {isEditing ? (
    <>
      <Button onClick={handleSaveProfile}>保存</Button>
      <Button variant="outline" onClick={handleCancelEdit}>取消</Button>
    </>
  ) : (
    <Button variant="outline" onClick={handleEditProfile}>
      {t("profile.editProfile")}
    </Button>
  )}
</div>
```

### 6. （可选）集成后端API调用

如果要完全集成后端API,需要创建一个新的API服务函数:

**创建文件**: `src/services/profile.service.ts`
```typescript
import { STORAGE_KEYS } from '@/constants/config'
import type { User } from '@/types/models.types'
import { setItem } from '@/utils/storage'
import api, { extractData } from './api'

/**
 * 更新用户资料
 */
export async function updateUserProfile(data: {
  nickname?: string
  avatar?: string
}): Promise<User> {
  const response = await api.put<never, never, typeof data>('/api/auth/me', data)
  const user = extractData<User>(response)

  // 更新localStorage中的用户数据
  setItem(STORAGE_KEYS.USER, user)

  return user
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<User> {
  const response = await api.get<never>('/api/auth/me')
  const user = extractData<User>(response)

  // 更新localStorage中的用户数据
  setItem(STORAGE_KEYS.USER, user)

  return user
}
```

然后在ProfilePage中使用:
```typescript
import { updateUserProfile } from '@/services/profile.service'

const handleSaveProfile = async () => {
  try {
    const updatedUser = await updateUserProfile({ nickname, avatar });
    updateUser(updatedUser);
    setIsEditing(false);
  } catch (error) {
    console.error("Failed to update profile:", error);
    alert("更新失败,请重试");
  }
};
```

## 完整修改清单

- [ ] 修改导入语句,添加jotai和user.atom
- [ ] 替换Mock用户数据为真实数据源
- [ ] 添加编辑模式状态管理
- [ ] 实现handleSaveProfile和handleCancelEdit函数
- [ ] 修改handleChangeAvatar实现
- [ ] 添加未登录状态处理
- [ ] 修改UI支持编辑模式
- [ ] (可选) 创建profile.service.ts并集成后端API
- [ ] 测试编辑功能
- [ ] 测试数据持久化

## 测试步骤

1. 连接钱包并登录
2. 进入个人中心页面
3. 验证显示的是真实的用户数据
4. 点击"编辑资料"按钮
5. 修改昵称
6. 点击"保存"
7. 验证数据已更新(刷新页面查看是否保留)
8. 点击头像编辑按钮
9. 输入新的头像URL
10. 验证头像已更新

## 相关文件

- `src/pages/ProfilePage/ProfilePage.tsx` - 个人中心页面组件
- `src/store/user.atom.ts` - 用户状态管理
- `src/services/profile.service.ts` - (需要创建) API服务

## 后端API

个人资料更新使用以下后端API:

```
PUT /api/auth/me
Authorization: Bearer <token>

Request Body:
{
  "nickname": "新昵称",
  "avatar": "新头像URL"
}

Response:
{
  "code": 200,
  "message": "Profile updated successfully",
  "data": {
    "id": "user-123",
    "walletAddress": "0x...",
    "nickname": "新昵称",
    "avatar": "新头像URL",
    // ... 其他用户字段
  }
}
```

---

**创建时间**: 2026-01-13
**优先级**: 中
**影响范围**: 个人中心页面
