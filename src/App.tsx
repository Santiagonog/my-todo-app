import React, { useState } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const addTask = (text: string) => {
        setTasks([...tasks, { id: Date.now(), text, completed: false }]);
    };

    const toggleTask = (id: number) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Lista de Tareas</h1>
            <TaskInput onAddTask={addTask} />
            <TaskList tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
        </div>
    );
};

export default App;
