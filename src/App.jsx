import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('Work');
  const [greeting, setGreeting] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    // This ensures the app takes up the full width of the browser, 
    // removing any default constraints from index.css or parent containers.
    const style = document.createElement('style');
    style.textContent = `
      body, html, #root {
        margin: 0 !important;
        padding: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input, completed: false, important: activeTab === 'important', category }]);
      setInput('');
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const toggleImportant = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, important: !task.important } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleReminderClick = (text) => {
    setToast(`Reminder set: ${text} ⏰`);
    setTimeout(() => setToast(''), 3000);
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const getCategoryColor = (cat) => {
    const colors = { Work: '#6366f1', Personal: '#10b981', Urgent: '#f43f5e' };
    return colors[cat] || '#6366f1';
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const remainingCount = tasks.length - completedCount;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const getMotivation = (p) => {
    if (tasks.length === 0) return "আজকের লিস্ট তৈরি করুন! ✨";
    if (p === 0) return "কাজ শুরু করার সময় হয়েছে! 🚀";
    if (p < 50) return "ভালোই এগোচ্ছেন! 💪";
    if (p < 100) return "প্রায় শেষ করে ফেলেছেন! ✨";
    return "চমৎকার! সব শেষ। 🏆";
  };

  // Calendar Logic
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date());

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const monthName = viewDate.toLocaleString('default', { month: 'long' });

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const goToToday = () => setViewDate(new Date());

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f1f5f9',
    sidebarBg: isDarkMode ? '#1e293b' : '#ffffff',
    cardBg: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#0f172a',
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
          <div 
            onClick={() => setActiveTab('dashboard')}
            style={{ 
              ...styles.navItem, 
              backgroundColor: activeTab === 'dashboard' ? theme.accent + '22' : 'transparent', 
              color: activeTab === 'dashboard' ? theme.accent : theme.subText 
            }}
          >
            📊 Dashboard
          </div>
          <div 
            onClick={() => setActiveTab('calendar')}
            style={{ 
              ...styles.navItem, 
              backgroundColor: activeTab === 'calendar' ? theme.accent + '22' : 'transparent', 
              color: activeTab === 'calendar' ? theme.accent : theme.subText 
            }}
          >
            📅 Calendar
          </div>
          <div 
            onClick={() => setActiveTab('important')}
            style={{ 
              ...styles.navItem, 
              backgroundColor: activeTab === 'important' ? '#f59e0b22' : 'transparent', 
              color: activeTab === 'important' ? '#f59e0b' : theme.subText 
            }}
          >
            ⭐ Important
          </div>
          <div 
            onClick={() => setActiveTab('settings')}
            style={{ 
              ...styles.navItem, 
              backgroundColor: activeTab === 'settings' ? theme.accent + '22' : 'transparent', 
              color: activeTab === 'settings' ? theme.accent : theme.subText 
            }}
          >
            ⚙️ Settings
          </div>
        </nav>
        
        <div style={{ ...styles.statusBox, backgroundColor: isDarkMode ? '#2c2c2c' : '#f1f5f9' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Quick Stats</h4>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>Total Tasks: {tasks.length}</p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>Completed: {completedCount}</p>
        </div>

        <div style={{ ...styles.userProfile, borderTop: `1px solid ${theme.border}` }}>
          <div style={styles.avatar}>TU</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap' }}>Tanzim Ahmed Utsho</div>
            <div style={{ fontSize: '12px', color: theme.subText, whiteSpace: 'nowrap' }}>Pro Plan</div>
          </div>
        </div>
      </aside>

      {/* প্রধান কন্টেন্ট এরিয়া */}
      <main style={styles.mainContent}>
        <header style={styles.topHeader}>
          <div style={styles.welcomeBox}>
            <h1 style={{ ...styles.welcomeText, color: theme.text }}>{greeting}, Tanzim! 👋</h1>
            <p style={{ color: theme.subText, margin: '5px 0 0 0', fontSize: '15px' }}>আপনার আজকের লক্ষ্যগুলো পূরণ করার সময় হয়েছে।</p>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={styles.searchContainer}>
              <span style={{ opacity: 0.5 }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ ...styles.searchInput, color: theme.text }}
              />
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ ...styles.themeToggle, borderColor: theme.accent, color: theme.accent }}>
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <section style={styles.taskSection}>
            <div style={{ ...styles.mainCard, backgroundColor: theme.cardBg, borderColor: theme.border, boxShadow: isDarkMode ? '0 10px 40px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>📝 My Tasks</h3>
              <button onClick={clearCompleted} style={{ ...styles.clearBtn, color: theme.danger }}>Clear Completed</button>
            </div>
            
            <div style={styles.inputArea}>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={{ ...styles.select, backgroundColor: isDarkMode ? '#2c2c2c' : '#f8fafc', color: theme.text, borderColor: theme.border }}
              >
                <option value="Work">💼 Work</option>
                <option value="Personal">🏠 Personal</option>
                <option value="Urgent">🔥 Urgent</option>
              </select>
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
              {tasks.filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                  {searchQuery ? 'No matching tasks found' : 'কোনো টাস্ক খুঁজে পাওয়া যায়নি!'}
                </div>
              ) : (
                tasks.filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase())).map(task => (
                  <div key={task.id} style={{ ...styles.taskItem, borderBottom: `1px solid ${theme.border}`, opacity: task.completed ? 0.6 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} style={{ ...styles.checkbox, accentColor: theme.accent }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none', fontWeight: '500' }}>{task.text}</span>
                        <span style={{ fontSize: '11px', color: getCategoryColor(task.category), fontWeight: '700', textTransform: 'uppercase' }}>{task.category}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => toggleImportant(task.id)} style={{ ...styles.starBtn, color: task.important ? '#f59e0b' : theme.subText }}>
                        {task.important ? '★' : '☆'}
                      </button>
                      <button onClick={() => deleteTask(task.id)} style={{ ...styles.deleteBtn, color: theme.danger }}>✕</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          </section>
        )}

        {activeTab === 'calendar' && (
          <section style={styles.taskSection}>
            <div style={{ ...styles.mainCard, backgroundColor: theme.cardBg, borderColor: theme.border, boxShadow: isDarkMode ? '0 10px 40px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0 }}>{monthName} {viewDate.getFullYear()}</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={prevMonth} style={styles.calNavBtn}>‹</button>
                  <button onClick={goToToday} style={styles.calNavBtn}>Today</button>
                  <button onClick={nextMonth} style={styles.calNavBtn}>›</button>
                </div>
              </div>
              
              <div style={styles.calendarGrid}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} style={{ textAlign: 'center', fontWeight: '700', color: theme.accent, paddingBottom: '15px' }}>{day}</div>
                ))}
                {blanks.map(i => <div key={`b-${i}`} />)}
                {calendarDays.map(day => {
                  const isToday = day === today.getDate() && viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear();
                  return (
                    <div 
                      key={day} 
                      style={{ 
                        ...styles.calendarDay, 
                        backgroundColor: isToday ? theme.accent : 'transparent',
                        color: isToday ? '#fff' : theme.text,
                        borderColor: theme.border
                      }}
                    >
                      <span style={{ fontSize: '16px', fontWeight: isToday ? '700' : '500' }}>{day}</span>
                      {day % 5 === 0 && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isToday ? '#fff' : theme.accent, marginTop: '4px' }} />}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '40px', padding: '20px', borderRadius: '15px', backgroundColor: isDarkMode ? '#2c2c2c' : '#f8fafc' }}>
                <h4 style={{ margin: '0 0 15px 0' }}>Upcoming Schedule</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={styles.scheduleItem}>
                    <span style={{ color: theme.accent, fontWeight: 'bold' }}>10:00 AM</span>
                    <span>Team Standup Meeting</span>
                  </div>
                  <div style={styles.scheduleItem}>
                    <span style={{ color: theme.accent, fontWeight: 'bold' }}>02:30 PM</span>
                    <span>Project Design Review</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'important' && (
          <section style={styles.taskSection}>
            <div style={{ ...styles.mainCard, backgroundColor: theme.cardBg, borderColor: theme.border, boxShadow: isDarkMode ? '0 10px 40px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.04)' }}>
              <h3 style={{ marginTop: 0, color: '#f59e0b', fontSize: '24px' }}>⭐ Important Tasks</h3>
              <div style={styles.inputArea}>
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="একটি গুরুত্বপূর্ণ টাস্ক লিখুন..." 
                  style={{ ...styles.input, backgroundColor: isDarkMode ? '#2c2c2c' : '#fff', color: theme.text, borderColor: theme.border }}
                />
                <button onClick={addTask} style={{ ...styles.addBtn, backgroundColor: '#f59e0b' }}>Add Starred</button>
              </div>
              <div style={styles.taskList}>
                {tasks.filter(t => t.important && t.text.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                    {searchQuery ? 'No matching important tasks' : 'কোনো গুরুত্বপূর্ণ টাস্ক নেই!'}
                  </div>
                ) : (
                  tasks.filter(t => t.important && t.text.toLowerCase().includes(searchQuery.toLowerCase())).map(task => (
                    <div key={task.id} style={{ ...styles.taskItem, borderBottom: `1px solid ${theme.border}`, opacity: task.completed ? 0.6 : 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} style={{ ...styles.checkbox, accentColor: '#f59e0b' }} />
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none', fontWeight: '500' }}>{task.text}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => toggleImportant(task.id)} style={{ ...styles.starBtn, color: '#f59e0b' }}>★</button>
                        <button onClick={() => deleteTask(task.id)} style={{ ...styles.deleteBtn, color: theme.danger }}>✕</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'settings' && (
          <section style={styles.taskSection}>
            <div style={{ ...styles.mainCard, backgroundColor: theme.cardBg, borderColor: theme.border, boxShadow: isDarkMode ? '0 10px 40px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.04)' }}>
              <h3 style={{ marginTop: 0, fontSize: '24px' }}>⚙️ Settings</h3>
              
              <div style={styles.settingsGroup}>
                <h4 style={{ ...styles.settingsSubTitle, color: theme.accent }}>Appearance</h4>
                <div style={styles.settingsItem}>
                  <span>Interface Theme</span>
                  <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ ...styles.themeToggle, borderColor: theme.accent, color: theme.accent, margin: 0 }}>
                    Switch to {isDarkMode ? 'Light' : 'Dark'}
                  </button>
                </div>
              </div>

              <div style={styles.settingsGroup}>
                <h4 style={{ ...styles.settingsSubTitle, color: theme.accent }}>Notifications</h4>
                <div style={styles.settingsItem}>
                  <span>Email Alerts</span>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: theme.accent }} />
                </div>
                <div style={styles.settingsItem}>
                  <span>Task Reminders</span>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: theme.accent }} />
                </div>
              </div>

              <div style={styles.settingsGroup}>
                <h4 style={{ ...styles.settingsSubTitle, color: theme.accent }}>Privacy & Security</h4>
                <div style={styles.settingsItem}>
                  <span>Two-Factor Authentication</span>
                  <span style={{ fontSize: '13px', color: theme.subText, cursor: 'pointer', textDecoration: 'underline' }}>Enable</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ডান পাশের প্যানেল */}
      <aside style={{ ...styles.rightSidebar, backgroundColor: theme.sidebarBg, borderColor: theme.border }}>
        <h3 style={styles.sideTitle}>Daily Progress</h3>
        <div style={{ ...styles.progressArea, backgroundColor: isDarkMode ? '#2c2c2c' : '#f8fafc', padding: '25px 20px', borderRadius: '24px', textAlign: 'center' }}>
          <div style={{ ...styles.circle, borderColor: theme.border, borderTopColor: theme.accent }}>
            <h2 style={{ margin: 0, color: theme.accent }}>{progress}%</h2>
          </div>
          <p style={{ marginTop: '15px', fontSize: '15px', fontWeight: '700', color: theme.text }}>{getMotivation(progress)}</p>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', borderTop: `1px solid ${theme.border}`, paddingTop: '15px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: theme.accent }}>{completedCount}</div>
              <div style={{ fontSize: '11px', color: theme.subText, textTransform: 'uppercase' }}>Done</div>
            </div>
            <div style={{ width: '1px', backgroundColor: theme.border }}></div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: theme.subText }}>{remainingCount}</div>
              <div style={{ fontSize: '11px', color: theme.subText, textTransform: 'uppercase' }}>Left</div>
            </div>
          </div>
        </div>

        <div style={styles.reminderSection}>
          <h3 style={styles.sideTitle}>Reminders</h3>
          {[
            { icon: '🔔', text: 'পানির বিরতি নিন' },
            { icon: '🧘', text: '১০ মিনিট হাঁটুন' },
            { icon: '👁️', text: 'চোখের আরাম দিন' }
          ].map((rem, index) => (
            <div 
              key={index} 
              onClick={() => handleReminderClick(rem.text)}
              style={{
                ...styles.reminderItem, 
                backgroundColor: isDarkMode ? '#2c2c2c' : '#f1f5f9', 
                borderLeft: `4px solid ${theme.accent}`,
                color: theme.text
              }}
            >
              {rem.icon} {rem.text}
            </div>
          ))}
        </div>
      </aside>

      {/* Toast Notification */}
      {toast && (
        <div style={{ ...styles.toast, backgroundColor: theme.accent }}>
          {toast}
        </div>
      )}

    </div>
  );
}

const styles = {
  container: { 
    display: 'flex', 
    height: '100vh', 
    width: '100%', 
    overflow: 'hidden', // স্ক্রলবার আটকানোর জন্য
    boxSizing: 'border-box',
    margin: 0,
    padding: 0
  },
  
  // Left Sidebar
  leftSidebar: { width: '260px', padding: '25px', display: 'flex', flexDirection: 'column', borderRight: '1px solid' },
  logoSection: { marginBottom: '35px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  navItem: { padding: '12px 15px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' },
  statusBox: { padding: '15px', borderRadius: '12px', marginTop: 'auto' },
  userProfile: { marginTop: '20px', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' },

  // Main Content
  mainContent: { flex: 1, padding: '40px 25px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' },
  topHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  welcomeBox: { display: 'flex', flexDirection: 'column' },
  welcomeText: { margin: 0, fontSize: '32px', fontWeight: '700', lineHeight: '1.2' },
  themeToggle: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #3b82f6', background: 'transparent', color: '#3b82f6', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  searchContainer: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(0,0,0,0.05)', padding: '8px 15px', borderRadius: '20px' },
  searchInput: { border: 'none', background: 'none', outline: 'none', fontSize: '14px', width: '150px' },

  taskSection: { display: 'flex' }, // Removed center alignment to allow full width
  mainCard: { 
    width: '100%', 
    padding: '30px', 
    borderRadius: '20px', 
    border: '1px solid', 
    transition: 'all 0.3s ease'
  },
  inputArea: { display: 'flex', gap: '12px', marginBottom: '25px' },
  select: { padding: '0 15px', borderRadius: '14px', border: '1px solid', outline: 'none', cursor: 'pointer', fontWeight: '600' },
  input: { flex: 1, padding: '14px 18px', borderRadius: '14px', border: '1px solid', outline: 'none', fontSize: '15px', transition: 'all 0.2s' },
  addBtn: { padding: '0 25px', color: '#fff', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '600', transition: 'transform 0.2s' },
  starBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '5px' },
  taskItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5px' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '5px' },
  clearBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },

  // Calendar Styles
  calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' },
  calendarDay: { height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '1px solid', cursor: 'pointer', transition: '0.2s' },
  calNavBtn: { padding: '8px 15px', borderRadius: '10px', border: 'none', backgroundColor: '#6366f122', color: '#6366f1', cursor: 'pointer', fontWeight: '600' },
  scheduleItem: { display: 'flex', gap: '20px', padding: '10px', borderBottom: '1px solid #eeeeee22' },

  // Settings Styles
  settingsGroup: { marginBottom: '35px' },
  settingsSubTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '15px' },
  settingsItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eeeeee11' },

  // Right Sidebar
  rightSidebar: { width: '300px', padding: '25px', borderLeft: '1px solid', display: 'flex', flexDirection: 'column', gap: '35px' },
  sideTitle: { fontSize: '17px', fontWeight: '600', marginBottom: '15px', margin: 0 },
  progressArea: { textAlign: 'center' },
  circle: { width: '120px', height: '120px', borderRadius: '50%', border: '10px solid', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' },
  reminderSection: { display: 'flex', flexDirection: 'column', gap: '12px' },
  reminderItem: { 
    padding: '14px', 
    borderRadius: '12px', 
    fontSize: '14px', 
    fontWeight: '500', 
    cursor: 'pointer', 
    transition: 'transform 0.2s, box-shadow 0.2s',
    ":hover": { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
  },
  toast: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    padding: '12px 24px',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: '600',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    zIndex: 1000,
    animation: 'slideIn 0.3s ease-out'
  }
};

export default App;