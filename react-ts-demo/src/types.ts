// 常量对象：定义任务优先级（使用 as const 实现类似枚举的功能）
export const Priority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];

// 常量对象：定义任务状态（使用 as const 实现类似枚举的功能）
export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

// 接口：定义任务对象的类型
export interface Task {
  id: number;
  title: string;
  description?: string; // 可选属性
  priority: Priority;
  status: TaskStatus;
  createdAt: Date;
  completedAt?: Date;
}

// 类型别名：定义过滤选项
export type FilterType = 'all' | 'active' | 'completed';

// 泛型接口：定义统计数据
export interface Stats<T> {
  total: number;
  data: T[];
}
