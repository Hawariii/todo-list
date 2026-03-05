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

export async function GET() {
  const todos = readTodos()
  return NextResponse.json(todos)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (!body.title || body.title.trim() === "") {
    return NextResponse.json(
      { message: "Title wajib diisi" },
      { status: 400 }
    )
  }

  const todos = readTodos()

  const newTodo = {
    id: Date.now().toString(),
    title: body.title,
    completed: false
  }

  todos.push(newTodo)
  writeTodos(todos)

  return NextResponse.json(newTodo)
}
