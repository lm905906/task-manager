import { useState, useEffect } from "react";

const STORAGE_KEY = "task-manager.tasks";

// Read saved tasks once, when the app first loads
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");

  // Save to Local Storage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* storage unavailable: app still works in memory */
    }
  }, [tasks]);

  // Add
  const addTask = (e) => {
    e.preventDefault();
    const title = text.trim();
    if (!title) return;
    setTasks([{ id: Date.now(), title, completed: false }, ...tasks]);
    setText("");
  };

  // Delete
  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  // Mark complete / incomplete
  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  // Edit
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };
  const saveEdit = (id) => {
    const title = editText.trim();
    if (title) setTasks(tasks.map((t) => (t.id === id ? { ...t, title } : t)));
    setEditingId(null);
  };

  const clearCompleted = () => setTasks(tasks.filter((t) => !t.completed));

  const visible = tasks.filter((t) =>
    filter === "active" ? !t.completed : filter === "done" ? t.completed : true
  );
  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <main className="app">
      <header>
        <h1>My tasks</h1>
        <p className="count">
          {tasks.length === 0
            ? "Nothing yet"
            : `${remaining} of ${tasks.length} left to do`}
        </p>
      </header>

      <form className="add" onSubmit={addTask}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs doing?"
          aria-label="New task"
        />
        <button type="submit">Add task</button>
      </form>

      <div className="filters" role="tablist">
        {[
          ["all", "All"],
          ["active", "Active"],
          ["done", "Completed"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={filter === key ? "active" : ""}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="empty">
          {tasks.length === 0
            ? "Add your first task above."
            : "No tasks in this view."}
        </p>
      ) : (
        <ul className="list">
          {visible.map((task) => (
            <li key={task.id} className={task.completed ? "done" : ""}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                aria-label={`Mark "${task.title}" as completed`}
              />

              {editingId === task.id ? (
                <input
                  className="edit"
                  value={editText}
                  autoFocus
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(task.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <span className="title">{task.title}</span>
              )}

              <div className="actions">
                {editingId === task.id ? (
                  <button onClick={() => saveEdit(task.id)}>Save</button>
                ) : (
                  <button onClick={() => startEdit(task)}>Edit</button>
                )}
                <button className="danger" onClick={() => deleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {tasks.some((t) => t.completed) && (
        <button className="clear" onClick={clearCompleted}>
          Clear completed
        </button>
      )}
    </main>
  );
}
