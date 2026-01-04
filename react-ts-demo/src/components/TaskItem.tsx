import type { Task, Priority as PriorityType, TaskStatus as TaskStatusType } from '../types';
import { Priority, TaskStatus } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const getPriorityColor = (priority: PriorityType): string => {
    switch (priority) {
      case Priority.HIGH:
        return '#ff4444';
      case Priority.MEDIUM:
        return '#ffaa00';
      case Priority.LOW:
        return '#44ff44';
      default:
        return '#cccccc';
    }
  };

  const getStatusText = (status: TaskStatusType): string => {
    switch (status) {
      case TaskStatus.TODO:
        return '待办';
      case TaskStatus.IN_PROGRESS:
        return '进行中';
      case TaskStatus.COMPLETED:
        return '已完成';
    }
  };

  return (
    <div
      style={{
        padding: '15px',
        margin: '10px 0',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: task.status === TaskStatus.COMPLETED ? '#f0f0f0' : '#fff',
        borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: '0 0 8px 0',
              textDecoration: task.status === TaskStatus.COMPLETED ? 'line-through' : 'none',
              color: task.status === TaskStatus.COMPLETED ? '#888' : '#333',
            }}
          >
            {task.title}
          </h3>
          {task.description && (
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
              {task.description}
            </p>
          )}
          <div style={{ fontSize: '12px', color: '#888' }}>
            <span
              style={{
                backgroundColor: getPriorityColor(task.priority),
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                marginRight: '8px',
              }}
            >
              {task.priority.toUpperCase()}
            </span>
            <span>{getStatusText(task.status)}</span>
            <span style={{ marginLeft: '8px' }}>
              创建于: {task.createdAt.toLocaleString('zh-CN')}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onToggle(task.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: task.status === TaskStatus.COMPLETED ? '#ffa500' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {task.status === TaskStatus.COMPLETED ? '恢复' : '完成'}
          </button>
          <button
            onClick={() => onDelete(task.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
