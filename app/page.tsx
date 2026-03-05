"use client"

import { useEffect, useState } from "react"

type Todo = {
  id: string
  title: string
  completed: boolean
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState("")

  async function fetchTodos() {
    const res = await fetch("/api/todos")
    const data = await res.json()
    setTodos(data)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  async function addTodo() {
    if (!input.trim()) return alert("Isi dulu bre")

    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title: input })
    })

    setInput("")
    fetchTodos()
  }

  async function deleteTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" })
    fetchTodos()
  }

  async function toggleTodo(todo: Todo) {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !todo.completed })
    })

    fetchTodos()
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
      <h1 className="text-2xl mb-6">CLI Todo Web</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="bg-black border border-green-500 p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="> ketik task..."
        />
        <button
          onClick={addTodo}
          className="border border-green-500 px-4"
        >
          ADD
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="border border-green-500 p-2 flex justify-between"
          >
            <span
              onClick={() => toggleTodo(todo)}
              className={todo.completed ? "line-through" : ""}
            >
              {todo.title}
            </span>

            <button onClick={() => deleteTodo(todo.id)}>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}