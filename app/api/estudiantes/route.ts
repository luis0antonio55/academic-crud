import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const res = await db.execute(
      "SELECT id, nombre, apellido, email, edad, grado, fecha_ingreso AS fechaIngreso FROM estudiantes WHERE activo = 1 ORDER BY id DESC"
    )
    return NextResponse.json(res.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to list estudiantes" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, apellido, email, edad, grado, fechaIngreso } = body
    if (!nombre || !apellido || !email || !fechaIngreso) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const insert = await db.execute({
      sql: "INSERT INTO estudiantes (nombre, apellido, email, edad, grado, fecha_ingreso) VALUES (?, ?, ?, ?, ?, ?)",
      args: [nombre, apellido, email, edad ?? null, grado ?? null, fechaIngreso],
    })

    const id = Number(insert.lastInsertRowid)
    const res = await db.execute({
      sql: "SELECT id, nombre, apellido, email, edad, grado, fecha_ingreso AS fechaIngreso FROM estudiantes WHERE id = ?",
      args: [id],
    })

    return NextResponse.json(res.rows[0], { status: 201 })
  } catch (err: any) {
    console.error(err)
    const message = err?.message?.includes("UNIQUE") ? "Email already exists" : "Failed to create estudiante"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}