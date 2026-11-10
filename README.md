# Task Management Application

A responsive to-do list built with React.js, HTML, CSS and JavaScript.

## Features
- Add, edit, delete tasks and mark them completed
- Filter by All / Active / Completed, clear completed tasks
- Tasks persist across browser sessions via Local Storage
- Responsive layout for desktop and mobile

## Tech
- React 18 Hooks: `useState` for state, `useEffect` to sync tasks to Local Storage
- Vite for dev server and build

## Run
```bash
npm install
npm run dev
```
Open the URL printed in the terminal (usually http://localhost:5173).

## Structure
```
task-manager/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx   # entry point
    ├── App.jsx    # component, hooks, CRUD logic
    └── App.css    # styles
```
