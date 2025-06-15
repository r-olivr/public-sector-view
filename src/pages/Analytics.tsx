
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, Users, Calendar, Heart, GraduationCap, Shield, MapPin } from 'lucide-react';
import { useState } from 'react';

const Analytics = () => {
  const [selectedTopic, setSelectedTopic] = useState('saude');

  // Mock data organized by topics
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
      heatmapData: [
        { region: 'Centro', lat: -23.55, lng: -46.63, value: 85, cases: 234 },
        { region: 'Norte', lat: -23.50, lng: -46.65, value: 92, cases: 312 },
        { region: 'Sul', lat: -23.60, lng: -46.61, value: 67, cases: 178 },
        { region: 'Leste', lat: -23.53, lng: -46.58, value: 73, cases: 198 },
        { region: 'Oeste', lat: -23.57, lng: -46.68, value: 89, cases: 267 }
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
      heatmapData: [
        { region: 'Centro', lat: -23.55, lng: -46.63, value: 94, cases: 2340 },
        { region: 'Norte', lat: -23.50, lng: -46.65, value: 87, cases: 1890 },
        { region: 'Sul', lat: -23.60, lng: -46.61, value: 91, cases: 2156 },
        { region: 'Leste', lat: -23.53, lng: -46.58, value: 89, cases: 1987 },
        { region: 'Oeste', lat: -23.57, lng: -46.68, value: 93, cases: 2234 }
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
      heatmapData: [
        { region: 'Centro', lat: -23.55, lng: -46.63, value: 45, cases: 156 },
        { region: 'Norte', lat: -23.50, lng: -46.65, value: 67, cases: 234 },
        { region: 'Sul', lat: -23.60, lng: -46.61, value: 23, cases: 89 },
        { region: 'Leste', lat: -23.53, lng: -46.58, value: 34, cases: 123 },
        { region: 'Oeste', lat: -23.57, lng: -46.68, value: 52, cases: 187 }
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

  const getHeatmapColor = (value, topic) => {
    const intensity = value / 100;
    const colors = {
      saude: `rgba(239, 68, 68, ${intensity})`,
      educacao: `rgba(59, 130, 246, ${intensity})`,
      seguranca: `rgba(5, 150, 105, ${intensity})`
    };
    return colors[topic];
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Análises</h1>
            <p className="text-gray-600 mt-2">
              Visualizações interativas e mapas de calor por tópico
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

        {/* Interactive Heatmap and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Mapa de Calor - {currentData.title}</span>
              </CardTitle>
              <CardDescription>
                Distribuição de indicadores por região
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden">
                {/* Simplified heatmap visualization */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-4">
                  {currentData.heatmapData.map((point, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg flex items-center justify-center text-white font-semibold shadow-lg cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: getHeatmapColor(point.value, selectedTopic) }}
                      title={`${point.region}: ${point.cases} casos (${point.value}% intensidade)`}
                    >
                      <div className="text-center">
                        <div className="text-sm font-bold">{point.region}</div>
                        <div className="text-xs">{point.cases}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
                  <div className="text-xs font-medium mb-2">Intensidade</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatmapColor(30, selectedTopic) }}></div>
                    <span className="text-xs">Baixa</span>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatmapColor(70, selectedTopic) }}></div>
                    <span className="text-xs">Alta</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
        </div>

        {/* Regional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes por Região</CardTitle>
            <CardDescription>
              Dados detalhados de {currentData.title.toLowerCase()} por região administrativa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {currentData.heatmapData.map((region, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{region.region}</h4>
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getHeatmapColor(region.value, selectedTopic) }}
                    ></div>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: currentData.color }}>
                    {region.cases}
                  </p>
                  <p className="text-sm text-gray-600">
                    Intensidade: {region.value}%
                  </p>
                </div>
              ))}
            </div>
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
