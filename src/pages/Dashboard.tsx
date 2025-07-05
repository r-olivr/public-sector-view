import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Database, Map, BarChart3, Users, FileText, MapPin } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
  );
};

export default Dashboard;