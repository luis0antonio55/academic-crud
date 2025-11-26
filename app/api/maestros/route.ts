import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const res = await db.execute(
      "SELECT id, nombre, apellido, email, especialidad, telefono, fecha_contratacion AS fechaContratacion FROM maestros WHERE activo = 1 ORDER BY id DESC"
    )
    return NextResponse.json(res.rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to list maestros" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, apellido, email, especialidad, telefono, fechaContratacion } = body
    if (!nombre || !apellido || !email || !fechaContratacion) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const insert = await db.execute({
      sql: "INSERT INTO maestros (nombre, apellido, email, especialidad, telefono, fecha_contratacion) VALUES (?, ?, ?, ?, ?, ?)",
      args: [nombre, apellido, email, especialidad ?? null, telefono ?? null, fechaContratacion],
    })

    const id = Number(insert.lastInsertRowid)
    const res = await db.execute({
      sql: "SELECT id, nombre, apellido, email, especialidad, telefono, fecha_contratacion AS fechaContratacion FROM maestros WHERE id = ?",
      args: [id],
    })

    return NextResponse.json(res.rows[0], { status: 201 })
  } catch (err: any) {
    console.error(err)
    const message = err?.message?.includes("UNIQUE") ? "Email already exists" : "Failed to create maestro"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}