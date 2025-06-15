import Layout from '@/components/Layout';
import ChoroplethMap from '@/components/ChoroplethMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, Users, Calendar, Heart, GraduationCap, Shield } from 'lucide-react';
import { useState } from 'react';

const Analytics = () => {
  const [selectedTopic, setSelectedTopic] = useState('saude');

  const topicsData = {
    saude: {
      title: 'Indicadores de Saúde',
      icon: Heart,
      color: '#ef4444',
      kpis: [
        { label: 'Atendimentos Mês', value: '8.050', trend: '+12%', color: 'text-red-600' },
        { label: 'Consultas Agendadas', value: '2.340', trend: '+8%', color: 'text-red-600' },
        { label: 'Emergências', value: '456', trend: '-5%', color: 'text-green-600' },
        { label: 'Taxa Ocupação UTI', value: '78%', trend: '+3%', color: 'text-red-600' }
      ],
      chartData: [
        { month: 'Jan', consultas: 1200, emergencias: 89 },
        { month: 'Fev', consultas: 1350, emergencias: 76 },
        { month: 'Mar', consultas: 1100, emergencias: 92 },
        { month: 'Abr', consultas: 1400, emergencias: 67 },
        { month: 'Mai', consultas: 1250, emergencias: 81 },
        { month: 'Jun', consultas: 1500, emergencias: 72 }
      ]
    },
    educacao: {
      title: 'Indicadores de Educação',
      icon: GraduationCap,
      color: '#3b82f6',
      kpis: [
        { label: 'Matrículas Ativas', value: '12.340', trend: '+5%', color: 'text-blue-600' },
        { label: 'Taxa Aprovação', value: '92%', trend: '+2%', color: 'text-green-600' },
        { label: 'Evasão Escolar', value: '3.2%', trend: '-1%', color: 'text-green-600' },
        { label: 'Professores Ativos', value: '847', trend: '+7%', color: 'text-blue-600' }
      ],
      chartData: [
        { month: 'Jan', matriculas: 12100, aprovacao: 89 },
        { month: 'Fev', matriculas: 12200, aprovacao: 91 },
        { month: 'Mar', matriculas: 12150, aprovacao: 88 },
        { month: 'Abr', matriculas: 12300, aprovacao: 92 },
        { month: 'Mai', matriculas: 12250, aprovacao: 90 },
        { month: 'Jun', matriculas: 12340, aprovacao: 92 }
      ]
    },
    seguranca: {
      title: 'Indicadores de Segurança',
      icon: Shield,
      color: '#059669',
      kpis: [
        { label: 'Ocorrências Mês', value: '1.234', trend: '-8%', color: 'text-green-600' },
        { label: 'Crimes Violentos', value: '89', trend: '-15%', color: 'text-green-600' },
        { label: 'Furtos/Roubos', value: '567', trend: '-5%', color: 'text-green-600' },
        { label: 'Tempo Resposta', value: '12min', trend: '-2min', color: 'text-green-600' }
      ],
      chartData: [
        { month: 'Jan', ocorrencias: 1420, violentos: 102 },
        { month: 'Fev', ocorrencias: 1380, violentos: 98 },
        { month: 'Mar', ocorrencias: 1350, violentos: 95 },
        { month: 'Abr', ocorrencias: 1290, violentos: 91 },
        { month: 'Mai', ocorrencias: 1260, violentos: 87 },
        { month: 'Jun', ocorrencias: 1234, violentos: 89 }
      ]
    }
  };

  const currentData = topicsData[selectedTopic];
  const TopicIcon = currentData.icon;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Análises</h1>
            <p className="text-gray-600 mt-2">
              Mapa coroplético interativo e visualizações por tópico
            </p>
          </div>
          
          {/* Topic Selector */}
          <div className="flex items-center space-x-4">
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione o tópico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saude">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-600" />
                    <span>Saúde</span>
                  </div>
                </SelectItem>
                <SelectItem value="educacao">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    <span>Educação</span>
                  </div>
                </SelectItem>
                <SelectItem value="seguranca">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Segurança</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Topic Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: currentData.color, color: 'white' }}>
                <TopicIcon className="h-6 w-6" />
              </div>
              <span>{currentData.title}</span>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Interactive Choropleth Map */}
        <ChoroplethMap height="600px" />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {currentData.kpis.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                    <p className={`text-sm ${kpi.color}`}>{kpi.trend} vs período anterior</p>
                  </div>
                  <TopicIcon className={`h-8 w-8 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência Temporal</CardTitle>
            <CardDescription>
              Evolução dos indicadores nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(currentData.chartData[0]).filter(key => key !== 'month').map((key, index) => (
                  <Line 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    stroke={index === 0 ? currentData.color : '#82ca9d'} 
                    strokeWidth={2} 
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações do Dashboard</CardTitle>
            <CardDescription>
              Ferramentas para análise e exportação de {currentData.title.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline">
              Exportar Relatório PDF
            </Button>
            <Button variant="outline">
              Baixar Dados Excel
            </Button>
            <Button variant="outline">
              Configurar Alertas
            </Button>
            <Button style={{ backgroundColor: currentData.color, color: 'white' }}>
              Análise Detalhada
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
