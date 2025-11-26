"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { StudentsList } from "@/components/students-list"
import { TeachersList } from "@/components/teachers-list"
import { Dashboard } from "@/components/dashboard"

export type Student = {
  id: string
  nombre: string
  apellido: string
  email: string
  edad: number
  grado: string
  fechaIngreso: string
}

export type Teacher = {
  id: string
  nombre: string
  apellido: string
  email: string
  especialidad: string
  telefono: string
  fechaContratacion: string
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "students" | "teachers">("dashboard")

  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const sRes = await fetch("/api/estudiantes")
        if (sRes.ok) {
          const sRows = await sRes.json()
          setStudents(
            sRows.map((r: any) => ({
              id: String(r.id),
              nombre: r.nombre,
              apellido: r.apellido,
              email: r.email,
              edad: r.edad ?? 0,
              grado: r.grado ?? "",
              fechaIngreso: r.fechaIngreso,
            }))
          )
        }
      } catch (e) {
        console.error("Failed to load estudiantes", e)
      }
      try {
        const tRes = await fetch("/api/maestros")
        if (tRes.ok) {
          const tRows = await tRes.json()
          setTeachers(
            tRows.map((r: any) => ({
              id: String(r.id),
              nombre: r.nombre,
              apellido: r.apellido,
              email: r.email,
              especialidad: r.especialidad ?? "",
              telefono: r.telefono ?? "",
              fechaContratacion: r.fechaContratacion,
            }))
          )
        }
      } catch (e) {
        console.error("Failed to load maestros", e)
      }
    }
    loadData()
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 lg:p-8">
        {activeTab === "dashboard" && <Dashboard studentsCount={students.length} teachersCount={teachers.length} />}
        {activeTab === "students" && <StudentsList students={students} setStudents={setStudents} />}
        {activeTab === "teachers" && <TeachersList teachers={teachers} setTeachers={setTeachers} />}
      </main>
    </div>
  )
}
