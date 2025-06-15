
import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Map, Layers, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface MapLayer {
  id: string;
  name: string;
  type: 'base' | 'overlay';
  visible: boolean;
  description: string;
}

const WebGIS = () => {
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'osm', name: 'OpenStreetMap', type: 'base', visible: true, description: 'Mapa base padrão' },
    { id: 'neighborhoods', name: 'Limites de Bairros', type: 'overlay', visible: false, description: 'Divisão administrativa municipal' },
    { id: 'schools', name: 'Escolas Públicas', type: 'overlay', visible: false, description: 'Localização das escolas municipais' },
    { id: 'health_units', name: 'Unidades de Saúde', type: 'overlay', visible: false, description: 'UBS e hospitais públicos' },
    { id: 'population', name: 'Densidade Populacional', type: 'overlay', visible: false, description: 'Densidade por setor censitário' }
  ]);

  // Simulate map initialization
  useEffect(() => {
    if (mapRef.current) {
      // This would normally initialize Leaflet or Mapbox GL JS
      console.log('Initializing map...');
      setMapInstance({ initialized: true });
    }
  }, []);

  const toggleLayer = (layerId: string) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
    
    toast({
      title: "Camada atualizada",
      description: `Camada ${layers.find(l => l.id === layerId)?.name} ${
        layers.find(l => l.id === layerId)?.visible ? 'desativada' : 'ativada'
      }.`,
    });
  };

  const exportMap = () => {
    toast({
      title: "Exportando mapa",
      description: "Gerando imagem PNG do mapa atual...",
    });
    
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Mapa exportado!",
        description: "Download do arquivo PNG iniciado.",
      });
    }, 2000);
  };

  const resetView = () => {
    toast({
      title: "Visão resetada",
      description: "Mapa retornado à extensão inicial.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WebGIS</h1>
          <p className="text-gray-600 mt-2">
            Sistema de informações geográficas para visualização e análise espacial
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Map className="h-5 w-5" />
                    <span>Mapa Interativo</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={resetView}>
                      <ZoomIn className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportMap}>
                      <Download className="h-4 w-4 mr-1" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  ref={mapRef}
                  className="w-full h-[600px] bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                >
                  <div className="text-center space-y-4">
                    <Map className="h-16 w-16 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-600">Mapa WebGIS</h3>
                      <p className="text-gray-500">
                        Aqui será renderizado o mapa interativo com Leaflet.js
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Coordenadas: -23.5505° S, -46.6333° W (São Paulo)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Layer Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="h-5 w-5" />
                  <span>Controle de Camadas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-3">Camadas Base</h4>
                  {layers.filter(layer => layer.type === 'base').map((layer) => (
                    <div key={layer.id} className="flex items-center space-x-2 py-2">
                      <Checkbox
                        id={layer.id}
                        checked={layer.visible}
                        onCheckedChange={() => toggleLayer(layer.id)}
                      />
                      <div className="flex-1">
                        <label htmlFor={layer.id} className="text-sm font-medium cursor-pointer">
                          {layer.name}
                        </label>
                        <p className="text-xs text-gray-500">{layer.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-3">Camadas Temáticas</h4>
                  {layers.filter(layer => layer.type === 'overlay').map((layer) => (
                    <div key={layer.id} className="flex items-center space-x-2 py-2">
                      <Checkbox
                        id={layer.id}
                        checked={layer.visible}
                        onCheckedChange={() => toggleLayer(layer.id)}
                      />
                      <div className="flex-1">
                        <label htmlFor={layer.id} className="text-sm font-medium cursor-pointer">
                          {layer.name}
                        </label>
                        <p className="text-xs text-gray-500">{layer.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informações do Mapa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Zoom:</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Centro:</span>
                  <span>-23.55, -46.63</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projeção:</span>
                  <span>EPSG:4326</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Camadas ativas:</span>
                  <span>{layers.filter(l => l.visible).length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Legenda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Escolas Públicas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Unidades de Saúde</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-2 bg-gradient-to-r from-yellow-200 to-red-600"></div>
                  <span className="text-sm">Densidade Pop.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WebGIS;
