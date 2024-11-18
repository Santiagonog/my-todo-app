import React, { useState } from "react";

interface TaskInputProps {
    onAddTask: (taskText: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
    const [text, setText] = useState("");

    const handleAddTask = () => {
        if (text.trim()) {
            onAddTask(text);
            setText("");
        }
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                className="border rounded-lg px-3 py-2 w-full"
                placeholder="Nueva tarea..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={handleAddTask}
            >
                Añadir
            </button>
        </div>
    );
};

export default TaskInput;
