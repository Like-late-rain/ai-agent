import { useState } from 'react';
import type { Task, FilterType, Priority } from './types';
import { Priority as PriorityConst, TaskStatus as TaskStatusConst } from './types';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import Statistics from './components/Statistics';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: '学习 TypeScript 基础',
      description: '掌握接口、类型、泛型等核心概念',
      priority: PriorityConst.HIGH,
      status: TaskStatusConst.COMPLETED,
      createdAt: new Date('2026-01-01'),
      completedAt: new Date('2026-01-02'),
    },
    {
      id: 2,
      title: '创建 React + TypeScript 项目',
      description: '使用 Vite 搭建项目脚手架',
      priority: PriorityConst.MEDIUM,
      status: TaskStatusConst.IN_PROGRESS,
      createdAt: new Date('2026-01-03'),
    },
  ]);

  const [filter, setFilter] = useState<FilterType>('all');
  const [nextId, setNextId] = useState<number>(3);

  const addTask = (title: string, description: string, priority: Priority): void => {
    const newTask: Task = {
      id: nextId,
      title,
      description: description || undefined,
      priority,
      status: TaskStatusConst.TODO,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    setNextId(nextId + 1);
  };

  const toggleTask = (id: number): void => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const newStatus =
            task.status === TaskStatusConst.COMPLETED ? TaskStatusConst.TODO : TaskStatusConst.COMPLETED;
          return {
            ...task,
            status: newStatus,
            completedAt: newStatus === TaskStatusConst.COMPLETED ? new Date() : undefined,
          };
        }
        return task;
      })
    );
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getFilteredTasks = (): Task[] => {
    switch (filter) {
      case 'active':
        return tasks.filter((task) => task.status !== TaskStatusConst.COMPLETED);
      case 'completed':
        return tasks.filter((task) => task.status === TaskStatusConst.COMPLETED);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#2196F3', fontSize: '36px', marginBottom: '10px' }}>
          📝 TypeScript 任务管理器
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          展示 TypeScript 类型系统的 React 示例应用
        </p>
      </header>

      <Statistics tasks={tasks} />

      <TaskForm onAddTask={addTask} />

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 20px',
            margin: '0 5px',
            backgroundColor: filter === 'all' ? '#2196F3' : '#e0e0e0',
            color: filter === 'all' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          全部 ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{
            padding: '8px 20px',
            margin: '0 5px',
            backgroundColor: filter === 'active' ? '#2196F3' : '#e0e0e0',
            color: filter === 'active' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          进行中 ({tasks.filter((t) => t.status !== TaskStatusConst.COMPLETED).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            padding: '8px 20px',
            margin: '0 5px',
            backgroundColor: filter === 'completed' ? '#2196F3' : '#e0e0e0',
            color: filter === 'completed' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          已完成 ({tasks.filter((t) => t.status === TaskStatusConst.COMPLETED).length})
        </button>
      </div>

      <div>
        {filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <p style={{ fontSize: '18px' }}>暂无任务</p>
            <p style={{ fontSize: '14px' }}>添加一个新任务开始吧！</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
          ))
        )}
      </div>

      <footer style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ color: '#333', marginBottom: '10px' }}>🎯 TypeScript 特性展示：</h3>
        <ul style={{ color: '#666', lineHeight: '1.8' }}>
          <li>✅ <strong>接口 (Interface)</strong>: Task 接口定义任务结构</li>
          <li>✅ <strong>枚举 (Enum)</strong>: Priority 和 TaskStatus 枚举</li>
          <li>✅ <strong>类型别名 (Type Alias)</strong>: FilterType 联合类型</li>
          <li>✅ <strong>泛型 (Generics)</strong>: Stats&lt;T&gt; 泛型接口</li>
          <li>✅ <strong>类型注解</strong>: 所有函数参数和返回值都有类型</li>
          <li>✅ <strong>可选属性</strong>: description 和 completedAt 使用 ? 标记</li>
          <li>✅ <strong>React.FC 泛型</strong>: 组件 Props 类型定义</li>
        </ul>
      </footer>
    </div>
  );
}

export default App;
