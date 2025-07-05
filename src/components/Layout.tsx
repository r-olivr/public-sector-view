// Arquivo: src/components/Layout.tsx

import { useAuth } from '@/contexts/AuthContext';
import BrandedHeader from './BrandedHeader';
import BrandedFooter from './BrandedFooter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BrandedHeader />

      {/* PASSO 2.1: REMOVA TODA A SEÇÃO <nav> QUE ESTAVA AQUI */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Main Content */}
        <main className="text-left">{children}</main>
      </div>
      
      <BrandedFooter />
    </div>
  );
};

export default Layout;