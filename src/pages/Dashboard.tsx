import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Database, Map, BarChart3, Users, FileText, MapPin, Heart, GraduationCap, Shield } from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('health');

  const topics = [
    { id: 'health', name: 'Saúde', icon: Heart, color: 'text-red-600' },
    { id: 'education', name: 'Educação', icon: GraduationCap, color: 'text-blue-600' },
    { id: 'security', name: 'Segurança', icon: Shield, color: 'text-green-600' }
  ];

  const topicData = {
    health: {
      title: 'Indicadores de Saúde',
      stats: [
        { label: 'UBS Ativas', value: '28', change: '+2 este mês' },
        { label: 'Atendimentos/Mês', value: '1.543', change: '+12% vs anterior' },
        { label: 'Cobertura Vacinal', value: '87%', change: '+3% vs meta' }
      ]
    },
    education: {
      title: 'Indicadores de Educação',
      stats: [
        { label: 'Escolas Municipais', value: '45', change: '100% funcionando' },
        { label: 'Alunos Matriculados', value: '8.234', change: '+5% vs 2023' },
        { label: 'Taxa de Aprovação', value: '92%', change: '+2% vs anterior' }
      ]
    },
    security: {
      title: 'Indicadores de Segurança',
      stats: [
        { label: 'Ocorrências/Mês', value: '156', change: '-8% vs anterior' },
        { label: 'Câmeras Ativas', value: '89', change: '12 instaladas' },
        { label: 'Tempo Resposta', value: '8min', change: '-2min melhoria' }
      ]
    }
  };

  const currentTopicData = topicData[selectedTopic as keyof typeof topicData];
  const currentTopic = topics.find(t => t.id === selectedTopic);

  const moduleCards = [
    {
      title: 'Gestão de Dados',
      description: 'Upload, organização e download de datasets públicos',
      icon: Database,
      path: '/dados',
      color: 'bg-blue-500',
      stats: '45 datasets disponíveis'
    },
    {
      title: 'WebGIS',
      description: 'Visualização e análise geoespacial interativa',
      icon: Map,
      path: '/webgis',
      color: 'bg-green-500',
      stats: '12 camadas ativas'
    },
    {
      title: 'Dashboards Analíticos',
      description: 'Painéis interativos e visualizações de dados',
      icon: BarChart3,
      path: '/analytics',
      color: 'bg-purple-500',
      stats: '8 relatórios configurados'
    }
  ];

  const quickStats = [
    { label: 'Usuários Ativos', value: '28', icon: Users, color: 'text-blue-600' },
    { label: 'Datasets', value: '45', icon: FileText, color: 'text-green-600' },
    { label: 'Camadas GIS', value: '12', icon: MapPin, color: 'text-purple-600' }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo ao Sistema Gestão com Dados
          </h1>
          <p className="text-blue-100 text-lg">
            Plataforma de gestão pública baseada em evidências e dados
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-sm">Papel: {user?.role === 'admin' ? 'Administrador' : 'Usuário'}</span>
            <span className="text-sm">•</span>
            <span className="text-sm">Último acesso: Hoje às 09:30</span>
          </div>
        </div>

        {/* Interactive Heat Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      {currentTopic && <currentTopic.icon className={`h-5 w-5 ${currentTopic.color}`} />}
                      <span>Mapa de Calor - {currentTopicData.title}</span>
                    </CardTitle>
                    <CardDescription>
                      Visualização espacial dos dados por região
                    </CardDescription>
                  </div>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => {
                        const Icon = topic.icon;
                        return (
                          <SelectItem key={topic.id} value={topic.id}>
                            <div className="flex items-center space-x-2">
                              <Icon className={`h-4 w-4 ${topic.color}`} />
                              <span>{topic.name}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Map className="h-16 w-16 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-600">Mapa de Calor Interativo</h3>
                      <p className="text-gray-500">
                        Visualização de {currentTopicData.title.toLowerCase()} por região
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Tópico selecionado: {currentTopic?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Topic Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas do Tópico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentTopicData.stats.map((stat, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" size="sm">
                  Ver Relatório Detalhado
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  Exportar Dados
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/webgis')}
                >
                  Abrir no WebGIS
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {moduleCards.map((module, index) => {
            const Icon = module.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${module.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {module.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">{module.stats}</p>
                    <Button 
                      className="w-full"
                      onClick={() => navigate(module.path)}
                    >
                      Acessar Módulo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <Database className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Novo dataset adicionado</p>
                  <p className="text-xs text-gray-600">Dados de Saúde Pública - 2024</p>
                </div>
                <span className="text-xs text-gray-500">2h atrás</span>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <Map className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Camada GIS atualizada</p>
                  <p className="text-xs text-gray-600">Limites de Bairros</p>
                </div>
                <span className="text-xs text-gray-500">4h atrás</span>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Dashboard consultado</p>
                  <p className="text-xs text-gray-600">Indicadores de Educação</p>
                </div>
                <span className="text-xs text-gray-500">6h atrás</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
