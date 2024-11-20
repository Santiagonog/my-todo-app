import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface Task {
    id: number;
    text: string;
    status: "pendiente" | "en-proceso" | "procesado";
    priority: "bajo" | "medio" | "alto";
    comment?: string;
}

const App: React.FC = () => {
    const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({
        pendiente: [],
        "en-proceso": [],
        procesado: [],
    });

    const [newTaskText, setNewTaskText] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<{ columnKey: string; taskId: number } | null>(
        null
    );

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const updatedTasks = { ...tasks };
        const [movedTask] = updatedTasks[source.droppableId].splice(source.index, 1);
        updatedTasks[destination.droppableId].splice(destination.index, 0, movedTask);
        setTasks(updatedTasks);
    };

    const addTask = () => {
        if (newTaskText.trim()) {
            const newTask: Task = {
                id: Date.now(),
                text: newTaskText.trim(),
                status: "pendiente",
                priority: "bajo",
            };
            setTasks({
                ...tasks,
                pendiente: [...tasks.pendiente, newTask],
            });
            setNewTaskText("");
        }
    };

    const openEditModal = (task: Task) => {
        setTaskToEdit(task);
        setShowModal(true);
    };

    const saveTaskChanges = () => {
        if (taskToEdit) {
            const updatedTasks = { ...tasks };
            const columnKey = taskToEdit.status;
            const taskIndex = updatedTasks[columnKey].findIndex(
                (task) => task.id === taskToEdit.id
            );

            updatedTasks[columnKey][taskIndex] = { ...taskToEdit };
            setTasks(updatedTasks);
            setShowModal(false);
        }
    };

    const handleTaskChange = (field: keyof Task, value: any) => {
        if (taskToEdit) {
            setTaskToEdit({ ...taskToEdit, [field]: value });
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "bajo":
                return "bg-green-200";
            case "medio":
                return "bg-yellow-200";
            case "alto":
                return "bg-orange-300";
            default:
                return "bg-white";
        }
    };

    const confirmDeleteTask = (columnKey: string, taskId: number) => {
        setTaskToDelete({ columnKey, taskId });
        setShowConfirmModal(true);
    };

    const deleteTask = () => {
        if (taskToDelete) {
            const { columnKey, taskId } = taskToDelete;
            const updatedTasks = { ...tasks };
            updatedTasks[columnKey] = updatedTasks[columnKey].filter((task) => task.id !== taskId);
            setTasks(updatedTasks);
        }
        setShowConfirmModal(false);
        setTaskToDelete(null);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestión de Tareas</h1>

            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    className="border rounded-lg px-3 py-2 w-full"
                    placeholder="Escribe una nueva tarea..."
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={addTask}
                >
                    Añadir
                </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-4">
                    {Object.keys(tasks).map((columnKey) => (
                        <Droppable droppableId={columnKey} key={columnKey}>
                            {(provided) => (
                                <div
                                    className="bg-gray-100 rounded-lg p-4 w-1/3"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h2 className="text-lg font-bold mb-4 capitalize">
                                        {columnKey}
                                    </h2>
                                    {tasks[columnKey].map((task, index) => (
                                        <Draggable
                                            key={task.id}
                                            draggableId={task.id.toString()}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    className={`rounded-lg shadow p-2 mb-2 flex flex-col ${getPriorityColor(
                                                        task.priority
                                                    )}`}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <span className="font-bold">{task.text}</span>
                                                    <p className="text-sm italic text-gray-600">
                                                        {task.comment || "Sin comentarios"}
                                                    </p>
                                                    <div className="flex justify-end gap-2 mt-2">
                                                        <button
                                                            className="text-blue-500 hover:text-blue-700"
                                                            onClick={() => openEditModal(task)}
                                                        >
                                                            ✏️ Editar
                                                        </button>
                                                        <button
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() =>
                                                                confirmDeleteTask(columnKey, task.id)
                                                            }
                                                        >
                                                            🗑️ Borrar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            {showModal && taskToEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 w-96">
                        <h2 className="text-lg font-bold mb-4">Editar tarea</h2>
                        <label className="block mb-2">
                            Texto:
                            <input
                                type="text"
                                className="border rounded-lg px-3 py-2 w-full"
                                value={taskToEdit.text}
                                onChange={(e) =>
                                    handleTaskChange("text", e.target.value)
                                }
                            />
                        </label>
                        <label className="block mb-2">
                            Prioridad:
                            <select
                                className="border rounded-lg px-3 py-2 w-full"
                                value={taskToEdit.priority}
                                onChange={(e) =>
                                    handleTaskChange("priority", e.target.value)
                                }
                            >
                                <option value="bajo">Bajo</option>
                                <option value="medio">Medio</option>
                                <option value="alto">Alto</option>
                            </select>
                        </label>
                        <label className="block mb-4">
                            Comentarios:
                            <textarea
                                className="border rounded-lg px-3 py-2 w-full"
                                value={taskToEdit.comment || ""}
                                onChange={(e) =>
                                    handleTaskChange("comment", e.target.value)
                                }
                            />
                        </label>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={saveTaskChanges}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmModal && taskToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 w-96">
                        <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
                        <p>¿Estás seguro de que deseas eliminar esta tarea?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={deleteTask}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
