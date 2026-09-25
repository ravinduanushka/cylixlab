import { useState, useEffect, useMemo } from 'react';

// SVG Icons matching user's reference UI
const CalendarIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const AllTasksIcon = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7z" />
    <path d="M5.45 5.11L2 12v0h20v0l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const UpcomingArrowIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const AlertTriangleIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const PlusIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CheckCircleIcon = ({ size = 17, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const SearchIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const CloseIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Format helper
const getTodayString = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const TodoListManager = () => {
  // Navigation filter: 'all' | 'today' | 'upcoming' | 'overdue' | 'completed' | 'Personal' | 'Work' | 'Study'
  const [activeFilter, setActiveFilter] = useState('all');

  // Search state for real-time task search
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle calendar view on the right side
  const [showCalendar, setShowCalendar] = useState(false);

  // Calendar month/year navigation state
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(() => getTodayString());

  // Add Task Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(getTodayString());
  const [newTaskCategory, setNewTaskCategory] = useState('Personal');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  // Tasks State with LocalStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('cylixlab_task_manager_tasks');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cylixlab_task_manager_tasks', JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  const todayStr = getTodayString();

  // Filter tasks based on active sidebar item, completed status, selected calendar date, and search query
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Sidebar Category / Status Filter
      let matchesFilter = true;
      if (activeFilter === 'all') matchesFilter = true;
      else if (activeFilter === 'today') matchesFilter = task.dueDate === todayStr;
      else if (activeFilter === 'upcoming') matchesFilter = task.dueDate > todayStr;
      else if (activeFilter === 'overdue') matchesFilter = task.dueDate < todayStr && !task.completed;
      else if (activeFilter === 'completed') matchesFilter = task.completed === true;
      else if (['Personal', 'Work', 'Study'].includes(activeFilter)) {
        matchesFilter = task.category === activeFilter;
      } else if (activeFilter.startsWith('date:')) {
        const targetDate = activeFilter.replace('date:', '');
        matchesFilter = task.dueDate === targetDate;
      }

      if (!matchesFilter) return false;

      // 2. Real-time Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title?.toLowerCase().includes(q);
        const matchesDesc = task.description?.toLowerCase().includes(q);
        const matchesCat = task.category?.toLowerCase().includes(q);
        return Boolean(matchesTitle || matchesDesc || matchesCat);
      }

      return true;
    });
  }, [tasks, activeFilter, todayStr, searchQuery]);

  // Section heading name based on active filter
  const activeTitle = useMemo(() => {
    switch (activeFilter) {
      case 'all':
        return 'All Tasks';
      case 'today':
        return 'Today';
      case 'upcoming':
        return 'Upcoming';
      case 'overdue':
        return 'Overdue';
      case 'completed':
        return 'Completed Tasks';
      default:
        if (activeFilter.startsWith('date:')) {
          return `Tasks for ${activeFilter.replace('date:', '')}`;
        }
        return activeFilter;
    }
  }, [activeFilter]);

  // Task Actions
  const handleToggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const taskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      dueDate: newTaskDueDate || todayStr,
      category: newTaskCategory,
      priority: newTaskPriority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [taskItem, ...prev]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskDueDate(getTodayString());
    setIsAddModalOpen(false);
  };

  // Calendar month navigation
  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  const calMonthName = useMemo(() => {
    return new Date(calYear, calMonth, 1).toLocaleString('default', { month: 'long' });
  }, [calYear, calMonth]);

  // Calendar days generation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, dateStr: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, dateStr });
    }
    return days;
  }, [calYear, calMonth]);

  // Tasks for the currently selected calendar date
  const selectedDateTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate === selectedDate);
  }, [tasks, selectedDate]);

  return (
    <div className={`tm-outer-container ${showCalendar ? 'expanded-with-calendar' : ''}`}>
      <div className={`tm-card-wrapper ${showCalendar ? 'with-calendar' : ''}`}>
        {/* ========================================================
            1. LEFT SIDEBAR
           ======================================================== */}
        <aside className="tm-sidebar">
          {/* Top Show/Hide Calendar Button */}
          <button
            type="button"
            className={`tm-calendar-btn ${showCalendar ? 'active' : ''}`}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <CalendarIcon size={16} color={showCalendar ? '#ffffff' : '#2563eb'} />
            <span>{showCalendar ? 'Hide Calendar' : 'Show Calendar'}</span>
          </button>

          {/* TASKS Section */}
          <div className="tm-nav-section">
            <h5 className="tm-nav-header">TASKS</h5>
            <nav className="tm-nav-list">
              <button
                type="button"
                className={`tm-nav-item ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                <AllTasksIcon size={18} color={activeFilter === 'all' ? '#2563eb' : '#64748b'} />
                <span>All Tasks</span>
              </button>

              <button
                type="button"
                className={`tm-nav-item ${activeFilter === 'today' ? 'active' : ''}`}
                onClick={() => setActiveFilter('today')}
              >
                <CalendarIcon size={17} color={activeFilter === 'today' ? '#2563eb' : '#64748b'} />
                <span>Today</span>
              </button>

              <button
                type="button"
                className={`tm-nav-item ${activeFilter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveFilter('upcoming')}
              >
                <UpcomingArrowIcon size={17} color={activeFilter === 'upcoming' ? '#2563eb' : '#64748b'} />
                <span>Upcoming</span>
              </button>

              <button
                type="button"
                className={`tm-nav-item ${activeFilter === 'overdue' ? 'active' : ''}`}
                onClick={() => setActiveFilter('overdue')}
              >
                <AlertTriangleIcon size={17} color={activeFilter === 'overdue' ? '#2563eb' : '#64748b'} />
                <span>Overdue</span>
              </button>

              <button
                type="button"
                className={`tm-nav-item ${activeFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveFilter('completed')}
              >
                <CheckCircleIcon size={17} color={activeFilter === 'completed' ? '#2563eb' : '#64748b'} />
                <span>Completed</span>
              </button>
            </nav>
          </div>

          {/* LISTS Section */}
          <div className="tm-nav-section">
            <h5 className="tm-nav-header">LISTS</h5>
            <nav className="tm-nav-list">
              <button
                type="button"
                className={`tm-nav-item ${activeFilter === 'Personal' ? 'active' : ''}`}
                onClick={() => setActiveFilter('Personal')}
              >
                <span className="list-color-dot dot-personal" />
                <span>Personal</span>
              </button>

              <button
                type="button"
                className={`tm-nav-item ${activeFilter === 'Work' ? 'active' : ''}`}
                onClick={() => setActiveFilter('Work')}
              >
                <span className="list-color-dot dot-work" />
                <span>Work</span>
              </button>

              <button
                type="button"
                className={`tm-nav-item ${activeFilter === 'Study' ? 'active' : ''}`}
                onClick={() => setActiveFilter('Study')}
              >
                <span className="list-color-dot dot-study" />
                <span>Study</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ========================================================
            2. MIDDLE / MAIN TASK AREA (Other part goes to the left side)
           ======================================================== */}
        <main className="tm-main-content">
          {/* Top Bar with Task Manager Title, Middle Search Bar, and + Add Task button */}
          <div className="tm-top-bar">
            <h2 className="tm-main-heading">Task Manager</h2>

            {/* Search Bar in Middle Space */}
            <div className="tm-search-wrapper">
              <SearchIcon size={16} color="#94a3b8" />
              <input
                type="text"
                className="tm-search-input"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search tasks in list"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="tm-search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              className="tm-add-task-btn"
              onClick={() => {
                setNewTaskDueDate(selectedDate || todayStr);
                setIsAddModalOpen(true);
              }}
            >
              <PlusIcon size={16} />
              <span>Add Task</span>
            </button>
          </div>

          {/* Sub-header with Active Filter Title and Task Count */}
          <div className="tm-subheader-row">
            <h3 className="tm-section-title">{activeTitle}</h3>
            <span className="tm-task-count">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {/* Task Items or Empty State */}
          {filteredTasks.length === 0 ? (
            <div className="tm-empty-state">
              <h4 className="tm-empty-title">
                {searchQuery
                  ? 'No tasks found'
                  : activeFilter === 'completed'
                  ? 'No completed tasks'
                  : 'No tasks found'}
              </h4>
              <p className="tm-empty-desc">
                {searchQuery
                  ? `No tasks match "${searchQuery}". Try a different keyword or clear search.`
                  : activeFilter === 'completed'
                  ? 'Tasks you complete by checking the box will appear here.'
                  : 'Start by creating your first task!'}
              </p>
            </div>
          ) : (
            <div className="tm-task-list">
              {filteredTasks.map((task) => {
                const isOverdue = task.dueDate < todayStr && !task.completed;
                return (
                  <div
                    key={task.id}
                    className={`tm-task-card ${task.completed ? 'is-completed' : ''}`}
                  >
                    <div className="tm-task-left">
                      <button
                        type="button"
                        className={`tm-checkbox ${task.completed ? 'checked' : ''}`}
                        onClick={() => handleToggleComplete(task.id)}
                        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {task.completed && <CheckIcon />}
                      </button>

                      <div className="tm-task-details">
                        <span className="tm-task-name">{task.title}</span>
                        {task.description && (
                          <p className="tm-task-notes">{task.description}</p>
                        )}
                        <div className="tm-task-tags">
                          <span className={`tm-category-badge cat-${task.category.toLowerCase()}`}>
                            <span className={`list-color-dot dot-${task.category.toLowerCase()}`} />
                            {task.category}
                          </span>

                          <span className={`tm-date-badge ${isOverdue ? 'overdue' : ''}`}>
                            <CalendarIcon size={12} />
                            {task.dueDate === todayStr ? 'Today' : task.dueDate}
                          </span>

                          {task.priority && (
                            <span className={`tm-priority-badge priority-${task.priority}`}>
                              {task.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="tm-task-right">
                      <button
                        type="button"
                        className="tm-delete-btn"
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete task"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* ========================================================
            3. RIGHT SIDE CALENDAR PANEL (Displayed in right side free space)
           ======================================================== */}
        {showCalendar && (
          <aside className="tm-calendar-side-panel" aria-label="Calendar view">
            <div className="tm-cal-side-header">
              <div className="tm-cal-side-title-wrap">
                <CalendarIcon size={18} color="#2563eb" />
                <h3 className="tm-cal-side-month-title">{calMonthName} {calYear}</h3>
              </div>
              <div className="tm-cal-side-controls">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="tm-cal-nav-arrow"
                  title="Previous month"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="tm-cal-nav-arrow"
                  title="Next month"
                >
                  ›
                </button>
                <button
                  type="button"
                  onClick={() => setShowCalendar(false)}
                  className="tm-cal-close-btn"
                  title="Close Calendar"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <p className="tm-cal-side-hint">Click any date to view or schedule tasks</p>

            {/* Days of week header */}
            <div className="tm-cal-side-grid-header">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <span key={d} className="tm-cal-side-day-name">{d}</span>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="tm-cal-side-grid">
              {calendarDays.map((c, i) => {
                if (!c.day) return <div key={i} className="tm-cal-side-cell empty" />;
                const dayTasks = tasks.filter((t) => t.dueDate === c.dateStr);
                const isToday = c.dateStr === todayStr;
                const isSelected = c.dateStr === selectedDate;

                return (
                  <div
                    key={i}
                    className={`tm-cal-side-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => {
                      setSelectedDate(c.dateStr);
                      setActiveFilter(`date:${c.dateStr}`);
                    }}
                    title={`${c.dateStr} - ${dayTasks.length} tasks`}
                  >
                    <span className="tm-cal-side-date-num">{c.day}</span>
                    {dayTasks.length > 0 && (
                      <div className="tm-cal-side-dots">
                        {dayTasks.slice(0, 3).map((t) => (
                          <span
                            key={t.id}
                            className={`tm-cal-mini-dot dot-${t.category.toLowerCase()}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Date Summary & Quick Add */}
            <div className="tm-cal-side-footer">
              <div className="tm-cal-selected-header">
                <span className="tm-cal-selected-date-label">
                  📅 {selectedDate === todayStr ? 'Today' : selectedDate}
                </span>
                <span className="tm-cal-selected-count">
                  {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>

              {selectedDateTasks.length > 0 ? (
                <div className="tm-cal-selected-tasks-list">
                  {selectedDateTasks.map((t) => (
                    <div key={t.id} className="tm-cal-mini-task-item">
                      <span className={`list-color-dot dot-${t.category.toLowerCase()}`} />
                      <span className={`tm-cal-mini-task-text ${t.completed ? 'done' : ''}`}>
                        {t.title}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="tm-cal-no-tasks-text">No tasks scheduled on this date.</p>
              )}

              <button
                type="button"
                className="tm-cal-quick-add-btn"
                onClick={() => {
                  setNewTaskDueDate(selectedDate);
                  setIsAddModalOpen(true);
                }}
              >
                <PlusIcon size={14} />
                <span>Add Task for {selectedDate === todayStr ? 'Today' : selectedDate}</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* ========================================================
          ADD TASK MODAL DIALOG
         ======================================================== */}
      {isAddModalOpen && (
        <div className="tm-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="tm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="tm-modal-header">
              <h3>Create New Task</h3>
              <button
                type="button"
                className="tm-modal-close"
                onClick={() => setIsAddModalOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="tm-modal-form">
              <div className="tm-form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="tm-form-group">
                <label>Description (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Add details, links, or notes..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                />
              </div>

              <div className="tm-form-row">
                <div className="tm-form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                  />
                </div>

                <div className="tm-form-group">
                  <label>List</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                  >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Study">Study</option>
                  </select>
                </div>

                <div className="tm-form-group">
                  <label>Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="tm-modal-actions">
                <button
                  type="button"
                  className="tm-btn-cancel"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="tm-btn-submit">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoListManager;
