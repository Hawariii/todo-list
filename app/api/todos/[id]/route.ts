import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const filePath = path.join(process.cwd(), "data", "todos.json")

type Todo = {
  id: string
  title: string
  completed: boolean
}

function readTodos() {
  const data = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(data) as Todo[]
}

function writeTodos(data: Todo[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const todos = readTodos()
  const filtered = todos.filter((t) => t.id !== id)

  writeTodos(filtered)

  return NextResponse.json({ message: "Deleted" })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const todos = readTodos()

  const index = todos.findIndex((t) => t.id === id)

  if (index === -1) {
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  }

  todos[index] = {
    ...todos[index],
    ...body
  }

  writeTodos(todos)

  return NextResponse.json(todos[index])
}
