import type { Task, Stats } from '../types';
import { TaskStatus } from '../types';

interface StatisticsProps {
  tasks: Task[];
}

const Statistics: React.FC<StatisticsProps> = ({ tasks }) => {
  const stats: Stats<Task> = {
    total: tasks.length,
    data: tasks,
  };

  const completedTasks = tasks.filter((task) => task.status === TaskStatus.COMPLETED).length;
  const activeTasks = tasks.filter((task) => task.status !== TaskStatus.COMPLETED).length;
  const completionRate =
    stats.total > 0 ? ((completedTasks / stats.total) * 100).toFixed(1) : '0.0';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#2196F3',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.total}</div>
        <div style={{ fontSize: '14px', marginTop: '5px' }}>总任务数</div>
      </div>
      <div
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{completedTasks}</div>
        <div style={{ fontSize: '14px', marginTop: '5px' }}>已完成</div>
      </div>
      <div
        style={{
          backgroundColor: '#FF9800',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{activeTasks}</div>
        <div style={{ fontSize: '14px', marginTop: '5px' }}>进行中</div>
      </div>
      <div
        style={{
          backgroundColor: '#9C27B0',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{completionRate}%</div>
        <div style={{ fontSize: '14px', marginTop: '5px' }}>完成率</div>
      </div>
    </div>
  );
};

export default Statistics;
