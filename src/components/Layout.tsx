
import { useAuth } from '@/contexts/AuthContext';
import { useBranding } from '@/contexts/BrandingContext';
import { Button } from '@/components/ui/button';
import { Database, Map, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import BrandedHeader from './BrandedHeader';
import BrandedFooter from './BrandedFooter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const { brandConfig } = useBranding();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/dados', label: 'Gestão de Dados', icon: Database },
    { path: '/webgis', label: 'WebGIS', icon: Map },
    { path: '/analytics', label: 'Análises', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BrandedHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex justify-start space-x-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 ${
                    isActive ? '' : ''
                  }`}
                  style={isActive ? { backgroundColor: brandConfig.primary_color } : {}}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="text-left">{children}</main>
      </div>
      
      <BrandedFooter />
    </div>
  );
};

export default Layout;
