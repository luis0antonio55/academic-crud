import { NextResponse, NextRequest } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const res = await db.execute(
      "SELECT id, nombre, apellido, email, especialidad, telefono, fecha_ingreso AS fechaIngreso FROM maestros WHERE activo = 1 ORDER BY fecha_ingreso DESC"
    )
    return NextResponse.json(res.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch maestros" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, apellido, email, especialidad, telefono, fechaIngreso } = body
    if (!nombre || !apellido || !email || !fechaIngreso) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const insert = await db.execute({
      sql: "INSERT INTO maestros (nombre, apellido, email, especialidad, telefono, fecha_ingreso, activo) VALUES (?, ?, ?, ?, ?, ?, 1)",
      args: [nombre, apellido, email, especialidad ?? null, telefono ?? null, fechaIngreso],
    })

    const res = await db.execute({
      sql: "SELECT id, nombre, apellido, email, especialidad, telefono, fecha_ingreso AS fechaIngreso FROM maestros WHERE id = ?",
      args: [Number(insert.lastInsertRowid)],
    })

    return NextResponse.json(res.rows[0])
  } catch (err: any) {
    const message = err?.message?.includes("UNIQUE constraint failed") ? "Email already exists" : "Failed to create maestro"
    console.error(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}