import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, TrendingUp, Calendar } from "lucide-react"

type DashboardProps = {
  studentsCount: number
  teachersCount: number
}

export function Dashboard({ studentsCount, teachersCount }: DashboardProps) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen del sistema académico</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{studentsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Estudiantes activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Maestros</CardTitle>
            <BookOpen className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{teachersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Personal docente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ratio Estudiante/Maestro</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {teachersCount > 0 ? (studentsCount / teachersCount).toFixed(1) : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Estudiantes por maestro</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Año Escolar</CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">2025</div>
            <p className="text-xs text-muted-foreground mt-1">Ciclo actual</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
