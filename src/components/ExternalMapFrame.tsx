
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import externalMapConfig from '@/config/externalMapConfig.json';

interface ExternalMapFrameProps {
  height?: string;
  showHeader?: boolean;
  showControls?: boolean;
}

const ExternalMapFrame: React.FC<ExternalMapFrameProps> = ({ 
  height = externalMapConfig.height,
  showHeader = true,
  showControls = true 
}) => {
  const openInNewTab = () => {
    window.open(externalMapConfig.mapUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="w-full">
      {showHeader && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>{externalMapConfig.title}</span>
            </CardTitle>
            {showControls && (
              <Button
                variant="outline"
                size="sm"
                onClick={openInNewTab}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Abrir em Nova Aba</span>
              </Button>
            )}
          </div>
          {externalMapConfig.description && (
            <p className="text-sm text-gray-600 mt-2">
              {externalMapConfig.description}
            </p>
          )}
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        <div className="relative w-full" style={{ height }}>
          <iframe
            src={externalMapConfig.mapUrl}
            className="w-full h-full rounded-b-lg"
            frameBorder={externalMapConfig.frameBorder}
            allowFullScreen={externalMapConfig.allowFullscreen}
            sandbox={externalMapConfig.sandbox}
            title={externalMapConfig.title}
            loading="lazy"
          />
          
          {/* Loading overlay */}
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-b-lg iframe-loading">
            <div className="text-center space-y-4">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto animate-pulse" />
              <div>
                <h3 className="text-lg font-semibold text-gray-600">Carregando Mapa</h3>
                <p className="text-gray-500">Aguarde enquanto o mapa externo é carregado...</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Source attribution */}
        <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 rounded-b-lg">
          Fonte: Aplicação Externa | 
          <a 
            href={externalMapConfig.mapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1 text-blue-600 hover:underline"
          >
            Acessar diretamente
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalMapFrame;
