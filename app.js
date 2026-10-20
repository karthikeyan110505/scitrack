const DEFAULT_TASKS = [
  { id: 't-1', title: 'Calibrate pH meter with pH 4.0 and 7.0 buffer standards', category: 'Maintenance', priority: 'High', due: '9:00 AM', completed: true },
  { id: 't-2', title: 'Prepare 500 mL of 1X TAE electrophoresis running buffer', category: 'Solution', priority: 'High', due: '10:30 AM', completed: false },
  { id: 't-3', title: 'Run Bradford protein assay & record absorbance at 595 nm', category: 'Benchwork', priority: 'Medium', due: '1:00 PM', completed: false },
  { id: 't-4', title: 'Log spectrophotometer standard curve in Lab Notebook', category: 'Notebook', priority: 'Low', due: 'End of Day', completed: false }
];

let tasks = [];
let currentFilter = 'all';
let currentCategoryFilter = 'All';

function loadTasks() {
  try {
    const stored = localStorage.getItem('scitrack_tasks');
    if (stored) {
      tasks = JSON.parse(stored);
      return;
    }
  } catch (e) {
    console.warn('LocalStorage unavailable, using defaults', e);
  }
  tasks = [...DEFAULT_TASKS];
}

function saveTasks() {
  try {
    localStorage.setItem('scitrack_tasks', JSON.stringify(tasks));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

function showToast(msg, icon = '✨') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');
  toastMsg.textContent = msg;
  toastIcon.textContent = icon;
  toast.classList.remove('translate-y-16', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.add('translate-y-16', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 2500);
}

function getCategoryBadge(category) {
  const map = {
    'Benchwork': { label: '🧪 Benchwork', bg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60' },
    'Protocol': { label: '📑 Protocol', bg: 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60' },
    'Solution': { label: '🧴 Solution', bg: 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60' },
    'Analysis': { label: '📊 Analysis', bg: 'bg-purple-950/80 text-purple-400 border-purple-800/60' },
    'Notebook': { label: '📓 Notebook', bg: 'bg-amber-950/80 text-amber-400 border-amber-800/60' },
    'Maintenance': { label: '🧰 Maintenance', bg: 'bg-slate-800 text-slate-300 border-slate-700' }
  };
  const c = map[category] || { label: category, bg: 'bg-slate-800 text-slate-300 border-slate-700' };
  return `<span class="text-[11px] font-medium px-2 py-0.5 rounded-md border ${c.bg}">${c.label}</span>`;
}

function getPriorityBadge(priority) {
  if (priority === 'High') return '<span class="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60">HIGH</span>';
  if (priority === 'Medium') return '<span class="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/60">MED</span>';
  return '<span class="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">LOW</span>';
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-active').textContent = active;
  document.getElementById('stat-completed').textContent = completed;
  document.getElementById('stat-rate').textContent = `${rate}%`;
  document.getElementById('stat-pending').textContent = `${active} tasks remaining`;
}

function renderTasks() {
  const listEl = document.getElementById('task-list');
  const emptyStateEl = document.getElementById('empty-state');
  const filtered = tasks.filter(task => {
    if (currentFilter === 'active' && task.completed) return false;
    if (currentFilter === 'completed' && !task.completed) return false;
    if (currentCategoryFilter !== 'All' && task.category !== currentCategoryFilter) return false;
    return true;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = '';
    emptyStateEl.classList.remove('hidden');
  } else {
    emptyStateEl.classList.add('hidden');
    listEl.innerHTML = filtered.map(task => {
      const isDone = task.completed;
      return `
        <div data-id="${task.id}" class="group task-item flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${isDone ? 'bg-slate-950/40 border-slate-900 opacity-60' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'}">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <button type="button" aria-label="Toggle completed" class="btn-toggle flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition ${isDone ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-900 text-transparent'}">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </button>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-100'} truncate">${task.title}</div>
              <div class="flex flex-wrap items-center gap-2 mt-1.5">
                ${getCategoryBadge(task.category)}
                ${getPriorityBadge(task.priority)}
                ${task.due ? `<span class="text-[11px] text-slate-400 font-mono">⏱️ ${task.due}</span>` : ''}
              </div>
            </div>
          </div>
          <button type="button" aria-label="Delete task" class="btn-delete opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-2 rounded-lg transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      `;
    }).join('');
  }
  updateStats();
}

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  renderTasks();

  const form = document.getElementById('task-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    if (!title) return;
    tasks.unshift({
      id: 'task-' + Date.now(),
      title: title,
      category: document.getElementById('task-category').value,
      priority: document.getElementById('task-priority').value,
      due: document.getElementById('task-due').value.trim(),
      completed: false
    });
    saveTasks();
    renderTasks();
    showToast('Lab procedure added!', '🧪');
    document.getElementById('task-title').value = '';
    document.getElementById('task-due').value = '';
    document.getElementById('task-title').focus();
  });

  document.getElementById('task-list').addEventListener('click', (e) => {
    const itemEl = e.target.closest('.task-item');
    if (!itemEl) return;
    const id = itemEl.getAttribute('data-id');
    if (e.target.closest('.btn-toggle')) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      }
    }
    if (e.target.closest('.btn-delete')) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
      showToast('Task removed', '🗑️');
    }
  });

  const btnAll = document.getElementById('filter-all');
  const btnActive = document.getElementById('filter-active');
  const btnCompleted = document.getElementById('filter-completed');
  const filterBtns = [btnAll, btnActive, btnCompleted];

  function setActiveBtn(activeBtn) {
    filterBtns.forEach(btn => btn.className = 'filter-btn px-3 py-1 rounded-lg text-slate-400 hover:text-slate-200');
    activeBtn.className = 'filter-btn px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium';
  }

  btnAll.addEventListener('click', () => { currentFilter = 'all'; setActiveBtn(btnAll); renderTasks(); });
  btnActive.addEventListener('click', () => { currentFilter = 'active'; setActiveBtn(btnActive); renderTasks(); });
  btnCompleted.addEventListener('click', () => { currentFilter = 'completed'; setActiveBtn(btnCompleted); renderTasks(); });

  document.getElementById('filter-category').addEventListener('change', (e) => {
    currentCategoryFilter = e.target.value;
    renderTasks();
  });

  document.getElementById('btn-clear-done').addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    showToast('Cleared completed tasks', '🧹');
  });

  const navTasks = document.getElementById('nav-tasks');
  const navNotebook = document.getElementById('nav-notebook');
  const viewTasks = document.getElementById('view-tasks');
  const viewUpcoming = document.getElementById('view-upcoming');

  function showUpcoming(icon, title, desc) {
    viewTasks.classList.add('hidden');
    viewUpcoming.classList.remove('hidden');
    document.getElementById('upcoming-icon').textContent = icon;
    document.getElementById('upcoming-title').textContent = title;
    document.getElementById('upcoming-desc').textContent = desc;
  }

  function showTasks() {
    viewUpcoming.classList.add('hidden');
    viewTasks.classList.remove('hidden');
  }

  navTasks.addEventListener('click', showTasks);
  document.getElementById('btn-back-to-tasks').addEventListener('click', showTasks);
  navNotebook.addEventListener('click', () => showUpcoming('📓', 'Module 2: Personalized Lab Notebook', 'Coming up next in Step 2! You will be able to write rich bench notes, tag observation timestamps, record experiment titles, and link your notes directly to your lab tasks.'));
});
