import { NextResponse, NextRequest } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const res = await db.execute({
      sql: "SELECT id, nombre, apellido, email, especialidad, telefono, fecha_ingreso AS fechaIngreso FROM maestros WHERE id = ?",
      args: [Number(id)],
    })
    if (res.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(res.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch maestro" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { nombre, apellido, email, especialidad, telefono, fechaIngreso, activo = 1 } = body

    await db.execute({
      sql: "UPDATE maestros SET nombre = ?, apellido = ?, email = ?, especialidad = ?, telefono = ?, fecha_ingreso = ?, activo = ? WHERE id = ?",
      args: [nombre, apellido, email, especialidad ?? null, telefono ?? null, fechaIngreso, activo, Number(id)],
    })

    const res = await db.execute({
      sql: "SELECT id, nombre, apellido, email, especialidad, telefono, fecha_ingreso AS fechaIngreso FROM maestros WHERE id = ?",
      args: [Number(id)],
    })
    return NextResponse.json(res.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update maestro" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.execute({ sql: "UPDATE maestros SET activo = 0 WHERE id = ?", args: [Number(id)] })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to delete maestro" }, { status: 500 })
  }
}