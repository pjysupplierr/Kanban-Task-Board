/**
 * TaskFlow - Interactive Kanban Board
 * Pure Vanilla JavaScript Application
 */

// ==========================================================================
// Application State & Constants
// ==========================================================================
const STORAGE_KEY_TASKS = 'kanbanTasks';
const STORAGE_KEY_THEME = 'kanbanTheme';

const COLUMNS = ['todo', 'in-progress', 'review', 'done'];

const PRIORITY_ORDER = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1
};

// Realistic default tasks when localStorage is empty
const INITIAL_SAMPLE_TASKS = [
    {
        id: "task-001",
        title: "Design landing page hero",
        description: "Redesign the main landing page and improve the hero section with new copy and responsive visual assets.",
        status: "todo",
        priority: "high",
        assignee: "Akshath Balgi",
        dueDate: "2026-10-08",
        tags: ["Design", "Frontend"],
        createdAt: "2026-10-01T09:00:00.000Z",
        updatedAt: "2026-10-01T09:00:00.000Z"
    },
    {
        id: "task-002",
        title: "Create mobile wireframes",
        description: "Create low-fidelity wireframes for iOS and Android responsive breakpoints across all core pages.",
        status: "todo",
        priority: "medium",
        assignee: "Neha Reddy",
        dueDate: "2026-10-12",
        tags: ["Design", "Mobile"],
        createdAt: "2026-10-01T10:30:00.000Z",
        updatedAt: "2026-10-01T10:30:00.000Z"
    },
    {
        id: "task-003",
        title: "Write project documentation",
        description: "Draft architecture guidelines, API contracts, and team onboarding documentation in Markdown.",
        status: "todo",
        priority: "low",
        assignee: "Rahul Sharma",
        dueDate: "2026-10-15",
        tags: ["Docs"],
        createdAt: "2026-10-01T11:15:00.000Z",
        updatedAt: "2026-10-01T11:15:00.000Z"
    },
    {
        id: "task-004",
        title: "Prepare API requirements",
        description: "Specify REST and GraphQL schemas for authentication, task sync, and user profile management.",
        status: "in-progress",
        priority: "urgent",
        assignee: "Aarav Patel",
        dueDate: "2026-10-05",
        tags: ["Backend", "API"],
        createdAt: "2026-10-02T08:00:00.000Z",
        updatedAt: "2026-10-02T08:00:00.000Z"
    },
    {
        id: "task-005",
        title: "Build dashboard UI components",
        description: "Implement reusable statistics cards, charts, and navigation headers using clean CSS and HTML.",
        status: "in-progress",
        priority: "high",
        assignee: "Vignesh Pai",
        dueDate: "2026-10-09",
        tags: ["Frontend", "UI"],
        createdAt: "2026-10-02T09:45:00.000Z",
        updatedAt: "2026-10-02T09:45:00.000Z"
    },
    {
        id: "task-006",
        title: "Authentication flow integration",
        description: "Build secure token-based user login, signup validation, and password reset flows.",
        status: "in-progress",
        priority: "medium",
        assignee: "Rahul Sharma",
        dueDate: "2026-10-10",
        tags: ["Security", "Auth"],
        createdAt: "2026-10-02T10:00:00.000Z",
        updatedAt: "2026-10-02T10:00:00.000Z"
    },
    {
        id: "task-007",
        title: "Database schema migration",
        description: "Design relational schema tables, foreign key constraints, and seed data for development.",
        status: "review",
        priority: "high",
        assignee: "Aarav Patel",
        dueDate: "2026-10-04",
        tags: ["Database", "SQL"],
        createdAt: "2026-09-29T14:20:00.000Z",
        updatedAt: "2026-10-02T11:00:00.000Z"
    },
    {
        id: "task-008",
        title: "Responsive navigation bar",
        description: "Review mobile hamburger drawer menu transitions and keyboard accessibility.",
        status: "review",
        priority: "medium",
        assignee: "Neha Reddy",
        dueDate: "2026-10-06",
        tags: ["Frontend", "A11y"],
        createdAt: "2026-09-30T16:00:00.000Z",
        updatedAt: "2026-10-02T13:30:00.000Z"
    },
    {
        id: "task-009",
        title: "Checkout flow testing",
        description: "Perform end-to-end automated and manual testing on the multi-step payment gateway flow.",
        status: "review",
        priority: "urgent",
        assignee: "Rahul Sharma",
        dueDate: "2026-10-03",
        tags: ["QA", "Testing"],
        createdAt: "2026-09-28T11:00:00.000Z",
        updatedAt: "2026-10-02T14:00:00.000Z"
    },
    {
        id: "task-010",
        title: "Project workspace setup",
        description: "Configure code repository, linter rules, branch protection, and CI/CD workflow pipelines.",
        status: "done",
        priority: "high",
        assignee: "Vignesh Pai",
        dueDate: "2026-09-25",
        tags: ["DevOps", "Setup"],
        createdAt: "2026-09-20T09:00:00.000Z",
        updatedAt: "2026-09-24T17:00:00.000Z"
    },
    {
        id: "task-011",
        title: "Design system tokens",
        description: "Export primary color palette, typography scales, spacing tokens, and shadow variables.",
        status: "done",
        priority: "medium",
        assignee: "Neha Reddy",
        dueDate: "2026-09-26",
        tags: ["Design", "Tokens"],
        createdAt: "2026-09-21T10:00:00.000Z",
        updatedAt: "2026-09-25T15:30:00.000Z"
    },
    {
        id: "task-012",
        title: "Repository setup & security scan",
        description: "Perform automated vulnerability scan on base dependencies and lock version dependencies.",
        status: "done",
        priority: "low",
        assignee: "Aarav Patel",
        dueDate: "2026-09-28",
        tags: ["Security", "DevOps"],
        createdAt: "2026-09-22T08:30:00.000Z",
        updatedAt: "2026-09-27T18:00:00.000Z"
    }
];

let tasks = [];
let activeDeleteTaskId = null;
let activeDetailTaskId = null;
let draggedTaskId = null;

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    initTheme();
    loadTasks();
    setupEventListeners();
    setupDragAndDrop();
    renderBoard();
}

// ==========================================================================
// Theme Management
// ==========================================================================
function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme} mode`, 'info');
}

// ==========================================================================
// Task Persistence & Storage
// ==========================================================================
function loadTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_TASKS);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                tasks = parsed;
                return;
            }
        }
    } catch (e) {
        console.warn('Invalid JSON in localStorage, resetting to default tasks.', e);
    }
    tasks = [...INITIAL_SAMPLE_TASKS];
    saveTasks();
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
        console.error('Failed to save tasks to localStorage:', e);
        showToast('Error saving changes to local storage', 'warning');
    }
}

// ==========================================================================
// Helpers & Utilities
// ==========================================================================
function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

function getInitials(name) {
    if (!name || typeof name !== 'string') return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    } catch {
        return dateStr;
    }
}

function formatLongDate(dateStr) {
    if (!dateStr) return 'No due date';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

function formatStatusText(status) {
    switch (status) {
        case 'todo': return 'To Do';
        case 'in-progress': return 'In Progress';
        case 'review': return 'Review';
        case 'done': return 'Done';
        default: return status;
    }
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ==========================================================================
// Board Rendering & Filtering
// ==========================================================================
function getFilteredAndSortedTasks() {
    const searchVal = document.getElementById('searchInput').value.trim().toLowerCase();
    const assigneeVal = document.getElementById('filterAssignee').value;
    const priorityVal = document.getElementById('filterPriority').value;
    const statusVal = document.getElementById('filterStatus').value;
    const sortVal = document.getElementById('sortSelect').value;

    let filtered = tasks.filter(task => {
        // Search across title, description, tags, assignee
        if (searchVal) {
            const matchTitle = (task.title || '').toLowerCase().includes(searchVal);
            const matchDesc = (task.description || '').toLowerCase().includes(searchVal);
            const matchAssignee = (task.assignee || '').toLowerCase().includes(searchVal);
            const matchTags = (task.tags || []).some(t => t.toLowerCase().includes(searchVal));
            if (!matchTitle && !matchDesc && !matchAssignee && !matchTags) {
                return false;
            }
        }

        // Assignee filter
        if (assigneeVal !== 'all' && task.assignee !== assigneeVal) {
            return false;
        }

        // Priority filter
        if (priorityVal !== 'all' && task.priority !== priorityVal) {
            return false;
        }

        // Status filter
        if (statusVal !== 'all' && task.status !== statusVal) {
            return false;
        }

        return true;
    });

    // Sorting
    filtered.sort((a, b) => {
        switch (sortVal) {
            case 'newest':
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            case 'oldest':
                return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            case 'priority':
                return (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0);
            case 'dueDate': {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            case 'alphabetical':
                return (a.title || '').localeCompare(b.title || '');
            default:
                return 0;
        }
    });

    return filtered;
}

function renderBoard() {
    const filteredTasks = getFilteredAndSortedTasks();
    const searchActive = document.getElementById('searchInput').value.trim().length > 0 ||
                         document.getElementById('filterAssignee').value !== 'all' ||
                         document.getElementById('filterPriority').value !== 'all' ||
                         document.getElementById('filterStatus').value !== 'all';

    COLUMNS.forEach(status => {
        const listEl = document.getElementById(`list-${status}`);
        const countEl = document.getElementById(`count-${status}`);
        if (!listEl) return;

        listEl.innerHTML = '';
        const columnFilteredTasks = filteredTasks.filter(t => t.status === status);
        const columnTotalTasks = tasks.filter(t => t.status === status);

        // Update column count badge
        if (countEl) {
            countEl.textContent = searchActive 
                ? `${columnFilteredTasks.length} / ${columnTotalTasks.length}`
                : `${columnTotalTasks.length}`;
        }

        if (columnFilteredTasks.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'column-empty-state';
            emptyEl.innerHTML = `
                <svg class="column-empty-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
                <span class="column-empty-text">${searchActive ? 'No matching tasks' : 'No tasks in this column'}</span>
            `;
            listEl.appendChild(emptyEl);
        } else {
            columnFilteredTasks.forEach(task => {
                const cardEl = createTaskCard(task);
                listEl.appendChild(cardEl);
            });
        }
    });

    updateStatistics();
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('draggable', 'true');
    card.setAttribute('data-id', task.id);
    card.setAttribute('role', 'listitem');

    const priorityClass = `priority-${task.priority || 'medium'}`;
    const initials = getInitials(task.assignee);
    const formattedDue = formatDate(task.dueDate);

    // Check overdue
    let isOverdue = false;
    if (task.dueDate && task.status !== 'done') {
        const due = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (due < today) isOverdue = true;
    }

    const tagsHtml = (task.tags && task.tags.length > 0)
        ? `<div class="task-tags-container">
            ${task.tags.map(t => `<span class="task-tag">${escapeHtml(t)}</span>`).join('')}
           </div>`
        : '';

    card.innerHTML = `
        <div class="task-card-header">
            <span class="badge ${priorityClass}">${capitalizeFirst(task.priority || 'Medium')}</span>
            <div class="card-menu-container">
                <button class="card-menu-btn" aria-label="Task options" title="Options">&vellip;</button>
                <div class="card-menu-dropdown">
                    <button class="card-menu-item" data-action="edit">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                    </button>
                    <button class="card-menu-item" data-action="duplicate">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Duplicate
                    </button>
                    <button class="card-menu-item delete" data-action="delete">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        </div>

        <h3 class="task-card-title">${escapeHtml(task.title)}</h3>
        ${task.description ? `<p class="task-card-desc">${escapeHtml(task.description)}</p>` : ''}
        ${tagsHtml}

        <div class="task-card-footer">
            <div class="task-assignee-group" title="Assignee: ${escapeHtml(task.assignee || 'Unassigned')}">
                <div class="user-avatar avatar-sm">${initials}</div>
                <span style="font-size: 11.5px; color: var(--text-muted);">${escapeHtml(task.assignee ? task.assignee.split(' ')[0] : 'None')}</span>
            </div>
            ${formattedDue ? `
                <div class="task-due-date ${isOverdue ? 'overdue' : ''}" title="Due: ${task.dueDate}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>${formattedDue}</span>
                </div>
            ` : ''}
        </div>
    `;

    // Card click opens details modal
    card.addEventListener('click', (e) => {
        if (e.target.closest('.card-menu-container')) return;
        openDetailsModal(task.id);
    });

    // Three-dot menu logic
    const menuBtn = card.querySelector('.card-menu-btn');
    const menuDropdown = card.querySelector('.card-menu-dropdown');

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other open dropdowns
        document.querySelectorAll('.card-menu-dropdown.show').forEach(d => {
            if (d !== menuDropdown) d.classList.remove('show');
        });
        menuDropdown.classList.toggle('show');
    });

    // Menu Actions
    menuDropdown.querySelectorAll('.card-menu-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuDropdown.classList.remove('show');
            const action = btn.getAttribute('data-action');
            if (action === 'edit') {
                openEditModal(task.id);
            } else if (action === 'duplicate') {
                duplicateTask(task.id);
            } else if (action === 'delete') {
                openDeleteModal(task.id);
            }
        });
    });

    // Drag events on card
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    return card;
}

function updateStatistics() {
    const total = tasks.length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const review = tasks.filter(t => t.status === 'review').length;
    const completed = tasks.filter(t => t.status === 'done').length;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statInProgress').textContent = inProgress;
    document.getElementById('statReview').textContent = review;
    document.getElementById('statCompleted').textContent = completed;
}

// ==========================================================================
// Drag and Drop (Native HTML5)
// ==========================================================================
function setupDragAndDrop() {
    COLUMNS.forEach(status => {
        const colEl = document.getElementById(`column-${status}`);
        if (!colEl) return;

        colEl.addEventListener('dragover', handleDragOver);
        colEl.addEventListener('dragenter', handleDragEnter);
        colEl.addEventListener('dragleave', handleDragLeave);
        colEl.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    draggedTaskId = this.getAttribute('data-id');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedTaskId);
    this.classList.add('dragging');
}

function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.kanban-column').forEach(col => {
        col.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    // Only remove class if leaving the column element itself
    if (!this.contains(e.relatedTarget)) {
        this.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    const targetStatus = this.getAttribute('data-status');
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;

    if (!taskId || !targetStatus) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status !== targetStatus) {
        task.status = targetStatus;
        task.updatedAt = new Date().toISOString();
        saveTasks();
        renderBoard();
        showToast(`✓ Task moved to ${formatStatusText(targetStatus)}`, 'success');
    }
    draggedTaskId = null;
}

// ==========================================================================
// Modals & Task Operations (Create, Edit, Delete, Duplicate)
// ==========================================================================
function openCreateModal(defaultStatus = 'todo') {
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveTaskBtn');
    const titleError = document.getElementById('titleError');
    const titleInput = document.getElementById('taskTitle');

    form.reset();
    document.getElementById('taskId').value = '';
    document.getElementById('taskStatus').value = defaultStatus;
    document.getElementById('taskPriority').value = 'medium';
    titleError.classList.remove('show');
    titleInput.classList.remove('input-error');

    modalTitle.textContent = 'Create New Task';
    saveBtn.textContent = 'Create Task';

    modal.classList.add('active');
    setTimeout(() => titleInput.focus(), 50);
}

function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const modal = document.getElementById('taskModal');
    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveTaskBtn');
    const titleError = document.getElementById('titleError');
    const titleInput = document.getElementById('taskTitle');

    titleError.classList.remove('show');
    titleInput.classList.remove('input-error');

    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title || '';
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskStatus').value = task.status || 'todo';
    document.getElementById('taskPriority').value = task.priority || 'medium';
    document.getElementById('taskAssignee').value = task.assignee || '';
    document.getElementById('taskDueDate').value = task.dueDate || '';
    document.getElementById('taskTags').value = (task.tags || []).join(', ');

    modalTitle.textContent = 'Edit Task';
    saveBtn.textContent = 'Save Changes';

    // Close details modal if open
    closeModal('detailsModal');

    modal.classList.add('active');
    setTimeout(() => titleInput.focus(), 50);
}

function handleTaskSubmit(e) {
    e.preventDefault();

    const taskId = document.getElementById('taskId').value;
    const titleInput = document.getElementById('taskTitle');
    const title = titleInput.value.trim();
    const titleError = document.getElementById('titleError');

    if (!title) {
        titleError.classList.add('show');
        titleInput.classList.add('input-error');
        titleInput.focus();
        return;
    }

    titleError.classList.remove('show');
    titleInput.classList.remove('input-error');

    const description = document.getElementById('taskDescription').value.trim();
    const status = document.getElementById('taskStatus').value;
    const priority = document.getElementById('taskPriority').value;
    const assignee = document.getElementById('taskAssignee').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const tagsRaw = document.getElementById('taskTags').value;
    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];

    const now = new Date().toISOString();

    if (taskId) {
        // Edit existing task
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.title = title;
            task.description = description;
            task.status = status;
            task.priority = priority;
            task.assignee = assignee;
            task.dueDate = dueDate;
            task.tags = tags;
            task.updatedAt = now;
            showToast('✓ Task updated successfully', 'success');
        }
    } else {
        // Create new task
        const newTask = {
            id: generateId(),
            title,
            description,
            status,
            priority,
            assignee,
            dueDate,
            tags,
            createdAt: now,
            updatedAt: now
        };
        tasks.unshift(newTask);
        showToast('✓ Task created successfully', 'success');
    }

    saveTasks();
    renderBoard();
    closeModal('taskModal');
}

function openDeleteModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    activeDeleteTaskId = taskId;
    document.getElementById('deleteTaskTitle').textContent = `"${task.title}"`;
    document.getElementById('deleteConfirmModal').classList.add('active');
}

function confirmDeleteTask() {
    if (!activeDeleteTaskId) return;

    const taskIndex = tasks.findIndex(t => t.id === activeDeleteTaskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveTasks();
        renderBoard();
        showToast('✓ Task deleted successfully', 'success');
    }

    closeModal('deleteConfirmModal');
    closeModal('detailsModal');
    activeDeleteTaskId = null;
}

function duplicateTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const now = new Date().toISOString();
    const duplicated = {
        ...task,
        id: generateId(),
        title: `${task.title} (Copy)`,
        createdAt: now,
        updatedAt: now
    };

    tasks.unshift(duplicated);
    saveTasks();
    renderBoard();
    showToast('✓ Task duplicated successfully', 'success');
}

function openDetailsModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    activeDetailTaskId = taskId;

    const priorityEl = document.getElementById('detailsPriority');
    priorityEl.textContent = capitalizeFirst(task.priority || 'Medium');
    priorityEl.className = `badge priority-${task.priority || 'medium'}`;

    const statusEl = document.getElementById('detailsStatus');
    statusEl.textContent = formatStatusText(task.status);
    statusEl.className = `badge indicator-${task.status}`;

    document.getElementById('detailsTitle').textContent = task.title;
    document.getElementById('detailsAssignee').textContent = task.assignee || 'Unassigned';
    document.getElementById('detailsAvatar').textContent = getInitials(task.assignee);
    document.getElementById('detailsDueDate').textContent = formatLongDate(task.dueDate);
    document.getElementById('detailsDescription').textContent = task.description || 'No description provided.';

    document.getElementById('detailsCreated').textContent = task.createdAt ? new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown';
    document.getElementById('detailsUpdated').textContent = task.updatedAt ? new Date(task.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown';

    // Tags
    const tagsContainer = document.getElementById('detailsTags');
    tagsContainer.innerHTML = '';
    if (task.tags && task.tags.length > 0) {
        task.tags.forEach(t => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'task-tag';
            tagSpan.textContent = t;
            tagsContainer.appendChild(tagSpan);
        });
    } else {
        tagsContainer.innerHTML = '<span style="color: var(--text-muted); font-size: 13px;">No tags</span>';
    }

    document.getElementById('detailsModal').classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ==========================================================================
// Toast Notification System
// ==========================================================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = '✓';
    if (type === 'warning' || type === 'error') icon = '⚠';
    if (type === 'info') icon = 'ℹ';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 200);
    }, 3000);
}

// ==========================================================================
// Event Listeners Setup
// ==========================================================================
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

    // Share button
    document.getElementById('shareBoardBtn').addEventListener('click', () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href).catch(() => {});
        }
        showToast('✓ Board link copied to clipboard!', 'info');
    });

    // Add Task Button in Header
    document.getElementById('openAddTaskModalBtn').addEventListener('click', () => {
        openCreateModal('todo');
    });

    // Form submission
    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);

    // Modal close buttons
    document.getElementById('closeTaskModalBtn').addEventListener('click', () => closeModal('taskModal'));
    document.getElementById('cancelTaskModalBtn').addEventListener('click', () => closeModal('taskModal'));

    document.getElementById('closeDetailsModalBtn').addEventListener('click', () => closeModal('detailsModal'));
    document.getElementById('detailsCloseBtn').addEventListener('click', () => closeModal('detailsModal'));

    document.getElementById('closeDeleteModalBtn').addEventListener('click', () => closeModal('deleteConfirmModal'));
    document.getElementById('cancelDeleteBtn').addEventListener('click', () => closeModal('deleteConfirmModal'));
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDeleteTask);

    // Details Modal Actions
    document.getElementById('detailsEditBtn').addEventListener('click', () => {
        if (activeDetailTaskId) openEditModal(activeDetailTaskId);
    });

    document.getElementById('detailsDeleteBtn').addEventListener('click', () => {
        if (activeDetailTaskId) openDeleteModal(activeDetailTaskId);
    });

    // Close Modals on clicking overlay background
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    // Keyboard navigation (Escape closes modals and menus)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
            document.querySelectorAll('.card-menu-dropdown.show').forEach(d => d.classList.remove('show'));
        }
    });

    // Document click closes open dropdown menus
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.card-menu-container')) {
            document.querySelectorAll('.card-menu-dropdown.show').forEach(d => d.classList.remove('show'));
        }
    });

    // Search and Filters
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    searchInput.addEventListener('input', () => {
        clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
        renderBoard();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        searchInput.focus();
        renderBoard();
    });

    document.getElementById('headerSearchBtn').addEventListener('click', () => {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    document.getElementById('notificationBtn').addEventListener('click', () => {
        showToast('You have 3 tasks due soon.', 'info');
    });

    document.getElementById('filterAssignee').addEventListener('change', renderBoard);
    document.getElementById('filterPriority').addEventListener('change', renderBoard);
    document.getElementById('filterStatus').addEventListener('change', renderBoard);
    document.getElementById('sortSelect').addEventListener('change', renderBoard);

    // Reset Filters button
    document.getElementById('resetFiltersBtn').addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        document.getElementById('filterAssignee').value = 'all';
        document.getElementById('filterPriority').value = 'all';
        document.getElementById('filterStatus').value = 'all';
        document.getElementById('sortSelect').value = 'newest';
        renderBoard();
        showToast('Filters reset', 'info');
    });
}
