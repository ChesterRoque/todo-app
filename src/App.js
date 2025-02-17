import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [owner, setOwner] = useState("");
  const [filter, setFilter] = useState("all");
  const [showNotification, setShowNotification] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== "") {
      let confirmed = true;
      if (!dueDate.trim() || !owner.trim()) {
        confirmed = window.confirm("You have not provided an owner or due date. Do you want to proceed?");
      }
      if (confirmed) {
        setTasks([...tasks, { id: Date.now(), text: newTask, dueDate: dueDate || "N/A", owner: owner || "N/A", completed: false }]);
        setNewTask("");
        setDueDate("");
        setOwner("");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSelectTask = (id) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((taskId) => taskId !== id) : [...prevSelected, id]
    );
  };

  const selectAllTasks = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]); // Deselect all if all are selected
    } else {
      setSelectedTasks(tasks.map((task) => task.id)); // Select all
    }
  };

  const completeSelectedTasks = () => {
    setTasks(tasks.map((task) =>
      selectedTasks.includes(task.id) ? { ...task, completed: true } : task
    ));
    setSelectedTasks([]); // Clear selection after completing
  };

  const deleteSelectedTasks = () => {
    setTasks(tasks.filter((task) => !selectedTasks.includes(task.id)));
    setSelectedTasks([]);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  return (
    <div className="container app-container">
      {showNotification && <div className="notification-card">Added Task Successfully</div>}
      <div className="logo-card">
        <img src="/LEXMEET.png" alt="LexMeet Logo" className="logo-image" />
      </div>
      <header className="thin-header"></header>
      <h1 className="text-center">To-Do App</h1>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control flex-grow-1"
          placeholder="Task Name"
          value={newTask}
          onChange={(e) => e.target.value.length <= 95 && setNewTask(e.target.value)}
        />
      </div>
      <div className="input-group mb-3">
        <input
          type="date"
          className="form-control"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Owner"
          value={owner}
          onChange={(e) => e.target.value.length <= 30 && setOwner(e.target.value)} // Limit to 30 chars
        />
        <button className="btn btn-add" onClick={addTask}>Add Task</button>
      </div>

      {/* Select All, Complete Selected, and Delete Selected Buttons */}
      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-primary flex-grow-1" onClick={selectAllTasks}>
          {selectedTasks.length === tasks.length ? "Deselect All" : "Select All"}
        </button>
        <button
          className="btn btn-success flex-grow-1"
          onClick={completeSelectedTasks}
          disabled={selectedTasks.length === 0}
        >
          Complete Selected
        </button>
        <button
          className="btn btn-danger flex-grow-1"
          onClick={deleteSelectedTasks}
          disabled={selectedTasks.length === 0}
        >
          Delete Selected
        </button>
      </div>

      <div className="btn-group mb-3">
        <button className={`btn ${filter === "all" ? "btn-active" : "btn-filter"}`} onClick={() => setFilter("all")}>All Tasks</button>
        <button className={`btn ${filter === "active" ? "btn-active" : "btn-filter"}`} onClick={() => setFilter("active")}>In progress</button>
        <button className={`btn ${filter === "completed" ? "btn-active" : "btn-filter"}`} onClick={() => setFilter("completed")}>Completed</button>
      </div>

      <ul className="list-group">
        {filteredTasks.map((task) => (
          <li key={task.id} className="list-group-item task-item">
            <input
              type="checkbox"
              checked={selectedTasks.includes(task.id)}
              onChange={() => handleSelectTask(task.id)}
              style={{ marginRight: "15px" }} // Added spacing for the checkbox
            />
            <div className="task-content">
              <span className={task.completed ? "completed" : ""} style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                {task.text}
              </span>
              <small className="due-date">Due: {task.dueDate}</small>
              <small className="task-owner">Owner: {task.owner}</small>
            </div>
            <div>
              <button className="btn btn-complete" onClick={() => toggleTask(task.id)}>
                {task.completed ? "⍻" : "🗸"}
              </button>
              <button className="btn btn-delete" onClick={() => deleteTask(task.id)}>𐄂</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;