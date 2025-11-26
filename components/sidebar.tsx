"use client"

import { GraduationCap, Users, BookOpen, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

type SidebarProps = {
  activeTab: "dashboard" | "students" | "teachers"
  setActiveTab: (tab: "dashboard" | "students" | "teachers") => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "students" as const, label: "Estudiantes", icon: Users },
    { id: "teachers" as const, label: "Maestros", icon: BookOpen },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card min-h-screen p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="p-2 bg-primary rounded-lg">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground">Academica</h1>
          <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
