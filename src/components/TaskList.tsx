import React from "react";

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

interface TaskListProps {
    tasks: Task[];
    onToggleTask: (id: number) => void;
    onDeleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
    return (
        <ul className="mt-4 space-y-2">
            {tasks.map((task) => (
                <li
                    key={task.id}
                    className={`flex justify-between items-center border px-4 py-2 rounded-lg ${
                        task.completed ? "bg-green-100 line-through" : ""
                    }`}
                >
                    <span onClick={() => onToggleTask(task.id)}>{task.text}</span>
                    <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => onDeleteTask(task.id)}
                    >
                        Eliminar
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default TaskList;
