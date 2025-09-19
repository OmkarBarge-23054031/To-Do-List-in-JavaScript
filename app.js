import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ElectricBorder, ShinyText, RippleGrid } from 'reactbit';

function Task({ task, toggleComplete, deleteTask, addSubtask }) {
    return (
        <ElectricBorder className={`p-4 rounded-lg mb-4 ${task.completed ? 'bg-green-100 line-through text-gray-500' : 'bg-gray-100'}`}>
            <div className="flex justify-between items-center">
                <div>
                    <strong>{task.text}</strong> <br />
                    Due: {task.due || 'N/A'} | Priority: {task.priority} | Tags: {task.tags.join(', ')}
                </div>
                <div className="flex gap-2">
                    <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" onClick={toggleComplete}>✔</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={deleteTask}>🗑</button>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={addSubtask}>+ Sub</button>
                </div>
            </div>
            {task.subtasks.length > 0 && (
                <ul className="ml-5 mt-2 list-disc">
                    {task.subtasks.map((sub, idx) => (
                        <li key={idx} className={sub.completed ? 'line-through text-gray-500' : ''} onClick={() => addSubtask(idx, true)}>{sub.text}</li>
                    ))}
                </ul>
            )}
        </ElectricBorder>
    );
}

function App() {
    const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || []);
    const [text, setText] = useState('');
    const [due, setDue] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [tags, setTags] = useState('');

    useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);

    const addTask = (e) => {
        e.preventDefault();
        const newTask = { text, due, priority, tags: tags.split(',').map(t => t.trim()), completed: false, subtasks: [] };
        setTasks([...tasks, newTask]);
        setText(''); setDue(''); setTags('');
    };

    const toggleComplete = (index) => {
        const newTasks = [...tasks];
        newTasks[index].completed = !newTasks[index].completed;
        setTasks(newTasks);
    };

    const deleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const addSubtask = (index, toggle=false) => {
        if(toggle){
            const newTasks = [...tasks];
            newTasks[index].subtasks.forEach(sub => sub.completed = !sub.completed);
            setTasks(newTasks);
        } else {
            const subText = prompt('Enter subtask:');
            if(subText){
                const newTasks = [...tasks];
                newTasks[index].subtasks.push({ text: subText, completed: false });
                setTasks(newTasks);
            }
        }
    };

    return (
        <RippleGrid className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <ShinyText className="text-3xl font-bold text-center mb-6 text-gray-800">Advanced To-Do List 📝</ShinyText>
                <form onSubmit={addTask} className="space-y-2">
                    <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Task description" required className="w-full p-2 border rounded" />
                    <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="w-full p-2 border rounded" />
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2 border rounded">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                    <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags, comma separated" className="w-full p-2 border rounded" />
                    <ShinyText>
                        <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600">Add Task</button>
                    </ShinyText>
                </form>

                <div className="mt-4">
                    {tasks.map((task, index) => (
                        <Task
                            key={index}
                            task={task}
                            toggleComplete={() => toggleComplete(index)}
                            deleteTask={() => deleteTask(index)}
                            addSubtask={() => addSubtask(index)}
                        />
                    ))}
                </div>
            </div>
        </RippleGrid>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
