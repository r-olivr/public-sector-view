
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

const Analytics = () => {
  // Mock data for charts
  const healthData = [
    { month: 'Jan', consultas: 1200, emergencias: 89 },
    { month: 'Fev', consultas: 1350, emergencias: 76 },
    { month: 'Mar', consultas: 1100, emergencias: 92 },
    { month: 'Abr', consultas: 1400, emergencias: 67 },
    { month: 'Mai', consultas: 1250, emergencias: 81 },
    { month: 'Jun', consultas: 1500, emergencias: 72 }
  ];

  const educationData = [
    { escola: 'EMEF João Silva', matriculas: 450, aprovacao: 92 },
    { escola: 'EMEF Maria Santos', matriculas: 380, aprovacao: 88 },
    { escola: 'EMEF Pedro Costa', matriculas: 520, aprovacao: 94 },
    { escola: 'EMEF Ana Lima', matriculas: 340, aprovacao: 86 },
    { escola: 'EMEF José Oliveira', matriculas: 420, aprovacao: 90 }
  ];

  const populationData = [
    { name: 'Centro', value: 15000, color: '#8884d8' },
    { name: 'Norte', value: 22000, color: '#82ca9d' },
    { name: 'Sul', value: 18000, color: '#ffc658' },
    { name: 'Leste', value: 25000, color: '#ff7300' },
    { name: 'Oeste', value: 19000, color: '#00ff00' }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboards Analíticos</h1>
          <p className="text-gray-600 mt-2">
            Visualizações interativas e análises de dados municipais
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Filtros de Análise</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select defaultValue="2024">
                <SelectTrigger>
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Região" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Regiões</SelectItem>
                  <SelectItem value="centro">Centro</SelectItem>
                  <SelectItem value="norte">Norte</SelectItem>
                  <SelectItem value="sul">Sul</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className="bg-blue-600 hover:bg-blue-700">
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Atendimentos Saúde</p>
                  <p className="text-3xl font-bold text-gray-900">8.050</p>
                  <p className="text-sm text-green-600">+12% vs mês anterior</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Matrículas Ativas</p>
                  <p className="text-3xl font-bold text-gray-900">2.110</p>
                  <p className="text-sm text-blue-600">+3% vs ano anterior</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Aprovação</p>
                  <p className="text-3xl font-bold text-gray-900">90%</p>
                  <p className="text-sm text-green-600">+2% vs ano anterior</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">População Total</p>
                  <p className="text-3xl font-bold text-gray-900">99.000</p>
                  <p className="text-sm text-gray-600">Censo 2022</p>
                </div>
                <Users className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Indicadores de Saúde - 2024</CardTitle>
              <CardDescription>
                Consultas e emergências por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="consultas" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="emergencias" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Education Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho Escolar</CardTitle>
              <CardDescription>
                Matrículas e taxa de aprovação por escola
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={educationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="escola" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="matriculas" fill="#8884d8" />
                  <Bar dataKey="aprovacao" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Population Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição Populacional</CardTitle>
              <CardDescription>
                População por região administrativa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={populationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {populationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Dashboard Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações do Dashboard</CardTitle>
              <CardDescription>
                Ferramentas para análise e exportação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Exportar Relatório PDF
              </Button>
              <Button className="w-full" variant="outline">
                Baixar Dados Excel
              </Button>
              <Button className="w-full" variant="outline">
                Agendar Relatório Automático
              </Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Configurar Novo Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
