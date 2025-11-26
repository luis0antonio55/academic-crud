import { NextResponse, NextRequest } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const res = await db.execute({
      sql: "SELECT id, nombre, apellido, email, edad, grado, fecha_ingreso AS fechaIngreso FROM estudiantes WHERE id = ?",
      args: [Number(id)],
    })
    if (res.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(res.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch estudiante" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { nombre, apellido, email, edad, grado, fechaIngreso, activo = 1 } = body

    await db.execute({
      sql: "UPDATE estudiantes SET nombre = ?, apellido = ?, email = ?, edad = ?, grado = ?, fecha_ingreso = ?, activo = ? WHERE id = ?",
      args: [nombre, apellido, email, edad ?? null, grado ?? null, fechaIngreso, activo, Number(id)],
    })

    const res = await db.execute({
      sql: "SELECT id, nombre, apellido, email, edad, grado, fecha_ingreso AS fechaIngreso FROM estudiantes WHERE id = ?",
      args: [Number(id)],
    })
    return NextResponse.json(res.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update estudiante" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.execute({ sql: "UPDATE estudiantes SET activo = 0 WHERE id = ?", args: [Number(id)] })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to delete estudiante" }, { status: 500 })
  }
}