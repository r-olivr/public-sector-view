import { useBranding } from '@/contexts/BrandingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// PASSO 1.1: Importar hooks de navegação e ícones necessários
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, Map, BarChart3, LogOut, User } from 'lucide-react';

const BrandedHeader = () => {
  const { brandConfig } = useBranding();
  const { user, logout } = useAuth();
  // PASSO 1.2: Inicializar os hooks de navegação
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // PASSO 1.3: Definir os itens de navegação
  const navigationItems = [
    { path: '/', label: 'Início', icon: LayoutDashboard },
    { path: '/dados', label: 'Gestão de Dados', icon: Database },
    { path: '/webgis', label: 'WebGIS', icon: Map },
    { path: '/analytics', label: 'Análises', icon: BarChart3 },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Lado Esquerdo: Logo e Nome */}
          <div className="flex items-center space-x-4">
            {brandConfig.logo_url && (
              <img 
                src={brandConfig.logo_url} 
                alt={`${brandConfig.name} Logo`}
                className="h-8 w-auto"
              />
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{brandConfig.name}</h1>
              {brandConfig.tagline && (
                <span className="text-sm text-gray-500">{brandConfig.tagline}</span>
              )}
            </div>
          </div>
          
          {/* PASSO 1.4: Adicionar o menu de navegação no centro */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              // Verifica se o caminho atual corresponde ao item do menu
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  // O estilo do botão muda se ele estiver ativo
                  variant={isActive ? "secondary" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Lado Direito: Perfil do Usuário */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              Bem-vindo, {user?.name}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback style={{ backgroundColor: brandConfig.primary_color, color: 'white' }}>
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BrandedHeader;