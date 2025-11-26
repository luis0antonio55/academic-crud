"use client"

import type React from "react"

import { useState } from "react"
import type { Student } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

type StudentsListProps = {
  students: Student[]
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>
}

const emptyStudent: Omit<Student, "id"> = {
  nombre: "",
  apellido: "",
  email: "",
  edad: 0,
  grado: "",
  fechaIngreso: "",
}

export function StudentsList({ students, setStudents }: StudentsListProps) {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState<Omit<Student, "id">>(emptyStudent)

  const filteredStudents = students.filter(
    (s) =>
      s.nombre.toLowerCase().includes(search.toLowerCase()) ||
      s.apellido.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingStudent) {
        const res = await fetch(`/api/estudiantes/${editingStudent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData }),
        })
        if (res.ok) {
          const updated = await res.json()
          setStudents((prev) => prev.map((s) => (s.id === editingStudent.id ? { ...updated, id: String(updated.id) } : s)))
        }
      } else {
        const res = await fetch(`/api/estudiantes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData }),
        })
        if (res.ok) {
          const created = await res.json()
          setStudents((prev) => [...prev, { ...created, id: String(created.id) }])
        }
      }
    } catch (err) {
      console.error("Failed to submit estudiante", err)
    }
    setIsOpen(false)
    setEditingStudent(null)
    setFormData(emptyStudent)
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      nombre: student.nombre,
      apellido: student.apellido,
      email: student.email,
      edad: student.edad,
      grado: student.grado,
      fechaIngreso: student.fechaIngreso,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/estudiantes/${id}`, { method: "DELETE" })
      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== id))
      }
    } catch (err) {
      console.error("Failed to delete estudiante", err)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setEditingStudent(null)
      setFormData(emptyStudent)
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estudiantes</h1>
          <p className="text-muted-foreground">Gestiona los estudiantes registrados</p>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Estudiante
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Editar Estudiante" : "Nuevo Estudiante"}</DialogTitle>
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
                  <Label htmlFor="edad">Edad</Label>
                  <Input
                    id="edad"
                    type="number"
                    value={formData.edad || ""}
                    onChange={(e) => setFormData({ ...formData, edad: Number.parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grado">Grado</Label>
                  <Input
                    id="grado"
                    value={formData.grado}
                    onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                    placeholder="Ej: 10°"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                <Input
                  id="fechaIngreso"
                  type="date"
                  value={formData.fechaIngreso}
                  onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingStudent ? "Guardar Cambios" : "Crear Estudiante"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Lista de Estudiantes</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar estudiantes..."
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
                <TableHead>Edad</TableHead>
                <TableHead>Grado</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.nombre} {student.apellido}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.edad}</TableCell>
                  <TableCell>{student.grado}</TableCell>
                  <TableCell>{student.fechaIngreso}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(student)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(student.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No se encontraron estudiantes
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
