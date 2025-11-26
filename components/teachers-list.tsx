"use client"

import type React from "react"

import { useState } from "react"
import type { Teacher } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

type TeachersListProps = {
  teachers: Teacher[]
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>
}

const emptyTeacher: Omit<Teacher, "id"> = {
  nombre: "",
  apellido: "",
  email: "",
  especialidad: "",
  telefono: "",
  fechaContratacion: "",
}

export function TeachersList({ teachers, setTeachers }: TeachersListProps) {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [formData, setFormData] = useState<Omit<Teacher, "id">>(emptyTeacher)

  const filteredTeachers = teachers.filter(
    (t) =>
      t.nombre.toLowerCase().includes(search.toLowerCase()) ||
      t.apellido.toLowerCase().includes(search.toLowerCase()) ||
      t.especialidad.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingTeacher) {
        const res = await fetch(`/api/maestros/${editingTeacher.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData }),
        })
        if (res.ok) {
          const updated = await res.json()
          setTeachers((prev) => prev.map((t) => (t.id === editingTeacher.id ? { ...updated, id: String(updated.id) } : t)))
        }
      } else {
        const res = await fetch(`/api/maestros`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData }),
        })
        if (res.ok) {
          const created = await res.json()
          setTeachers((prev) => [...prev, { ...created, id: String(created.id) }])
        }
      }
    } catch (err) {
      console.error("Failed to submit maestro", err)
    }
    setIsOpen(false)
    setEditingTeacher(null)
    setFormData(emptyTeacher)
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      nombre: teacher.nombre,
      apellido: teacher.apellido,
      email: teacher.email,
      especialidad: teacher.especialidad,
      telefono: teacher.telefono,
      fechaContratacion: teacher.fechaContratacion,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/maestros/${id}`, { method: "DELETE" })
      if (res.ok) {
        setTeachers((prev) => prev.filter((t) => t.id !== id))
      }
    } catch (err) {
      console.error("Failed to delete maestro", err)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setEditingTeacher(null)
      setFormData(emptyTeacher)
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maestros</h1>
          <p className="text-muted-foreground">Gestiona el personal docente</p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Maestro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTeacher ? "Editar Maestro" : "Nuevo Maestro"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="especialidad">Especialidad</Label>
                  <Input
                    id="especialidad"
                    value={formData.especialidad}
                    onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                    placeholder="Ej: Matemáticas"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="555-1234"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaContratacion">Fecha de Contratación</Label>
                <Input
                  id="fechaContratacion"
                  type="date"
                  value={formData.fechaContratacion}
                  onChange={(e) => setFormData({ ...formData, fechaContratacion: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingTeacher ? "Guardar Cambios" : "Crear Maestro"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Lista de Maestros</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar maestros..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Fecha Contratación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">
                    {teacher.nombre} {teacher.apellido}
                  </TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-accent/10 text-accent rounded-md text-sm">
                      {teacher.especialidad}
                    </span>
                  </TableCell>
                  <TableCell>{teacher.telefono}</TableCell>
                  <TableCell>{teacher.fechaContratacion}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(teacher)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(teacher.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTeachers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No se encontraron maestros
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
