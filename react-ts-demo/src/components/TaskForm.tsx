import { useState } from 'react';
import type { Priority as PriorityType } from '../types';
import { Priority } from '../types';

interface TaskFormProps {
  onAddTask: (title: string, description: string, priority: PriorityType) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<PriorityType>(Priority.MEDIUM);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title, description, priority);
      setTitle('');
      setDescription('');
      setPriority(Priority.MEDIUM);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}
    >
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="任务标题"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <textarea
          placeholder="任务描述（可选）"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box',
            minHeight: '60px',
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <select
          value={priority}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setPriority(e.target.value as PriorityType)
          }
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        >
          <option value={Priority.LOW}>低优先级</option>
          <option value={Priority.MEDIUM}>中优先级</option>
          <option value={Priority.HIGH}>高优先级</option>
        </select>
      </div>
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        添加任务
      </button>
    </form>
  );
};

export default TaskForm;
