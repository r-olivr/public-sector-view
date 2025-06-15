
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBranding } from '@/contexts/BrandingContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();
  const { brandConfig } = useBranding();
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo ao ${brandConfig.name}.`,
        });
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no sistema",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const blurOpacity = brandConfig.blur_opacity || 0.4;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            {brandConfig.logo_url && (
              <img 
                src={brandConfig.logo_url} 
                alt={`${brandConfig.name} Logo`}
                className="h-16 w-auto mx-auto mb-4"
              />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{brandConfig.name}</h1>
            <p className="text-gray-600">{brandConfig.welcome_message}</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Acesso ao Sistema</CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar a plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@gov.br"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  style={{ backgroundColor: brandConfig.primary_color }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Usuários de demonstração:</p>
                <div className="text-xs space-y-1">
                  <div>
                    <strong>Admin:</strong> admin@gestao.gov.br / admin123
                  </div>
                  <div>
                    <strong>Usuário:</strong> user@gestao.gov.br / user123
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Background image with customizable blur */}
      <div className="flex-1 relative hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${brandConfig.background_image || '/placeholder.svg'})`
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: brandConfig.blur_color || '#000000',
            opacity: blurOpacity
          }}
        />
        <div className="absolute inset-0 backdrop-blur-sm" />
        
        {/* Optional overlay content */}
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <h2 className="text-2xl font-bold mb-2">{brandConfig.tagline}</h2>
          <p className="text-lg opacity-90">{brandConfig.footer_text}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
