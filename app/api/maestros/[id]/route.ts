import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    const res = await db.execute({
      sql: "SELECT id, nombre, apellido, email, especialidad, telefono, fecha_contratacion AS fechaContratacion FROM maestros WHERE id = ?",
      args: [id],
    })
    if (res.rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(res.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch maestro" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    const body = await req.json()
    const { nombre, apellido, email, especialidad, telefono, fechaContratacion, activo = 1 } = body

    await db.execute({
      sql: "UPDATE maestros SET nombre = ?, apellido = ?, email = ?, especialidad = ?, telefono = ?, fecha_contratacion = ?, activo = ? WHERE id = ?",
      args: [nombre, apellido, email, especialidad ?? null, telefono ?? null, fechaContratacion, activo, id],
    })

    const res = await db.execute({
      sql: "SELECT id, nombre, apellido, email, especialidad, telefono, fecha_contratacion AS fechaContratacion FROM maestros WHERE id = ?",
      args: [id],
    })
    return NextResponse.json(res.rows[0])
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to update maestro" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    await db.execute({ sql: "UPDATE maestros SET activo = 0 WHERE id = ?", args: [id] })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to delete maestro" }, { status: 500 })
  }
}