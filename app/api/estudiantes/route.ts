import { NextResponse, NextRequest } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const res = await db.execute(
      "SELECT id, nombre, apellido, email, edad, grado, fecha_ingreso AS fechaIngreso FROM estudiantes WHERE activo = 1 ORDER BY fecha_ingreso DESC"
    )
    return NextResponse.json(res.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch estudiantes" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, apellido, email, edad, grado, fechaIngreso } = body
    if (!nombre || !apellido || !email || !fechaIngreso) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const insert = await db.execute({
      sql: "INSERT INTO estudiantes (nombre, apellido, email, edad, grado, fecha_ingreso, activo) VALUES (?, ?, ?, ?, ?, ?, 1)",
      args: [nombre, apellido, email, edad ?? null, grado ?? null, fechaIngreso],
    })

    const res = await db.execute({
      sql: "SELECT id, nombre, apellido, email, edad, grado, fecha_ingreso AS fechaIngreso FROM estudiantes WHERE id = ?",
      args: [Number(insert.lastInsertRowid)],
    })

    return NextResponse.json(res.rows[0])
  } catch (err: any) {
    const message = err?.message?.includes("UNIQUE constraint failed") ? "Email already exists" : "Failed to create estudiante"
    console.error(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}