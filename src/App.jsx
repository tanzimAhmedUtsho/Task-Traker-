import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f1f5f9',
    sidebarBg: isDarkMode ? '#1e293b' : '#ffffff',
    cardBg: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#0f172a', // Dark mode text is now bright white
    subText: isDarkMode ? '#94a3b8' : '#64748b',
    border: isDarkMode ? '#334155' : '#e2e8f0',
    accent: '#6366f1',
    accentLight: '#818cf8',
    danger: '#f43f5e'
  };

  return (
    <div style={{ ...styles.container, backgroundColor: theme.bg, color: theme.text }}>
      
      {/* বাম পাশের সাইডবার */}
      <aside style={{ ...styles.leftSidebar, backgroundColor: theme.sidebarBg, borderColor: theme.border }}>
        <div style={styles.logoSection}>
          <h2 style={{ color: theme.accent, margin: 0, fontSize: '24px', letterSpacing: '-0.5px' }}>🚀 TaskFlow</h2>
        </div>
        <nav style={styles.nav}>
          <div style={{ ...styles.navItem, backgroundColor: theme.accent + '22', color: theme.accent }}>📊 Dashboard</div>
          <div style={{ ...styles.navItem, color: theme.subText }}>📅 Calendar</div>
          <div style={{ ...styles.navItem, color: theme.subText }}>⭐ Important</div>
          <div style={{ ...styles.navItem, color: theme.subText }}>⚙️ Settings</div>
        </nav>
        
        <div style={{ ...styles.statusBox, backgroundColor: isDarkMode ? '#2c2c2c' : '#f1f5f9' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Quick Stats</h4>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>Total Tasks: {tasks.length}</p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>Completed: {completedCount}</p>
        </div>
      </aside>

      {/* প্রধান কন্টেন্ট এরিয়া */}
      <main style={styles.mainContent}>
        <header style={styles.topHeader}>
          <div style={styles.welcomeBox}>
            <h1 style={{ ...styles.welcomeText, color: theme.text }}>Welcome Back! 👋</h1>
            <p style={{ color: theme.subText, margin: '5px 0 0 0', fontSize: '15px' }}>আজকের পরিকল্পনাগুলো এখানে সাজিয়ে রাখুন।</p>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ ...styles.themeToggle, borderColor: theme.accent, color: theme.accent }}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </header>

        <section style={styles.taskSection}>
          <div style={{ ...styles.mainCard, backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <h3 style={{ marginTop: 0 }}>📝 My Tasks</h3>
            <div style={styles.inputArea}>
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="নতুন টাস্ক যোগ করুন..." 
                style={{ ...styles.input, backgroundColor: isDarkMode ? '#2c2c2c' : '#fff', color: theme.text, borderColor: theme.border }}
              />
              <button onClick={addTask} style={{ ...styles.addBtn, backgroundColor: theme.accent }}>Add Task</button>
            </div>

            <div style={styles.taskList}>
              {tasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>কোনো টাস্ক খুঁজে পাওয়া যায়নি!</div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} style={{ ...styles.taskItem, borderBottom: `1px solid ${theme.border}`, opacity: task.completed ? 0.6 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} style={{ ...styles.checkbox, accentColor: theme.accent }} />
                      <span style={{ textDecoration: task.completed ? 'line-through' : 'none', fontWeight: '500' }}>{task.text}</span>
                    </div>
                    <button onClick={() => deleteTask(task.id)} style={{ ...styles.deleteBtn, color: theme.danger }}>✕</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ডান পাশের প্যানেল */}
      <aside style={{ ...styles.rightSidebar, backgroundColor: theme.sidebarBg, borderColor: theme.border }}>
        <h3 style={styles.sideTitle}>Daily Progress</h3>
        <div style={{ ...styles.progressArea, backgroundColor: isDarkMode ? '#2c2c2c' : '#f8fafc', padding: '20px', borderRadius: '20px' }}>
          <div style={{ ...styles.circle, borderColor: theme.border, borderTopColor: theme.accent }}>
            <h2 style={{ margin: 0, color: theme.accent }}>{progress}%</h2>
          </div>
          <p style={{ marginTop: '15px', fontSize: '14px', fontWeight: '600', color: theme.subText }}>কাজ সম্পন্ন হয়েছে</p>
        </div>

        <div style={styles.reminderSection}>
          <h3 style={styles.sideTitle}>Reminders</h3>
          <div style={{...styles.reminderItem, backgroundColor: isDarkMode ? '#2c2c2c' : '#f1f5f9', borderLeft: `4px solid ${theme.accent}`}}>🔔 পানির বিরতি নিন</div>
          <div style={{...styles.reminderItem, backgroundColor: isDarkMode ? '#2c2c2c' : '#f1f5f9', borderLeft: `4px solid ${theme.accent}`}}>🔔 ১০ মিনিট হাঁটুন</div>
          <div style={{...styles.reminderItem, backgroundColor: isDarkMode ? '#2c2c2c' : '#f1f5f9', borderLeft: `4px solid ${theme.accent}`}}>🔔 চোখের আরাম দিন</div>
        </div>
      </aside>

    </div>
  );
}

const styles = {
  container: { 
    display: 'flex', 
    height: '100vh', 
    width: '100%', 
    overflow: 'hidden', // স্ক্রলবার আটকানোর জন্য
    boxSizing: 'border-box'
  },
  
  // Left Sidebar
  leftSidebar: { width: '260px', padding: '25px', display: 'flex', flexDirection: 'column', borderRight: '1px solid' },
  logoSection: { marginBottom: '35px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  navItem: { padding: '12px 15px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' },
  statusBox: { padding: '15px', borderRadius: '12px', marginTop: 'auto' },

  // Main Content
  mainContent: { flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' },
  topHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  welcomeBox: { display: 'flex', flexDirection: 'column' },
  welcomeText: { margin: 0, fontSize: '32px', fontWeight: '700', lineHeight: '1.2' },
  themeToggle: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #3b82f6', background: 'transparent', color: '#3b82f6', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  
  taskSection: { display: 'flex' }, // Removed center alignment to allow full width
  mainCard: { width: '100%', padding: '25px', borderRadius: '16px', border: '1px solid', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }, // Removed maxWidth: '750px'
  inputArea: { display: 'flex', gap: '12px', marginBottom: '25px' },
  input: { flex: 1, padding: '14px 18px', borderRadius: '14px', border: '1px solid', outline: 'none', fontSize: '15px', transition: 'all 0.2s' },
  addBtn: { padding: '0 25px', color: '#fff', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '600', transition: 'transform 0.2s' },
  taskItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5px' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '5px' },

  // Right Sidebar
  rightSidebar: { width: '300px', padding: '25px', borderLeft: '1px solid', display: 'flex', flexDirection: 'column', gap: '35px' },
  sideTitle: { fontSize: '17px', fontWeight: '600', marginBottom: '15px', margin: 0 },
  progressArea: { textAlign: 'center' },
  circle: { width: '120px', height: '120px', borderRadius: '50%', border: '10px solid', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' },
  reminderSection: { display: 'flex', flexDirection: 'column', gap: '12px' },
  reminderItem: { padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: '500' }
};

export default App;