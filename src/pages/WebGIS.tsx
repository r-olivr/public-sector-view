
import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import MapSidebar from '@/components/MapSidebar';
import MapToolbar from '@/components/MapToolbar';
import MapLegend from '@/components/MapLegend';
import BaseMapSelector from '@/components/BaseMapSelector';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Map } from 'lucide-react';

interface MapLayer {
  id: string;
  name: string;
  type: 'base' | 'overlay';
  category?: 'equipment' | 'biome' | 'statistics' | 'urban' | 'imported';
  visible: boolean;
  description: string;
  data?: any;
  imported?: boolean;
  uploadDate?: string;
}

const WebGIS = () => {
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [selectedBaseMap, setSelectedBaseMap] = useState('osm');
  const [layers, setLayers] = useState<MapLayer[]>([
    // Equipment layers
    { id: 'schools', name: 'Escolas Públicas', type: 'overlay', category: 'equipment', visible: false, description: 'Localização das escolas municipais' },
    { id: 'health_units', name: 'Unidades de Saúde', type: 'overlay', category: 'equipment', visible: false, description: 'UBS e hospitais públicos' },
    { id: 'fire_stations', name: 'Bombeiros', type: 'overlay', category: 'equipment', visible: false, description: 'Estações do corpo de bombeiros' },
    { id: 'police_stations', name: 'Delegacias', type: 'overlay', category: 'equipment', visible: false, description: 'Delegacias de polícia civil' },
    
    // Biome layers
    { id: 'vegetation', name: 'Cobertura Vegetal', type: 'overlay', category: 'biome', visible: false, description: 'Áreas de vegetação nativa' },
    { id: 'water_bodies', name: 'Corpos d\'Água', type: 'overlay', category: 'biome', visible: false, description: 'Rios, lagos e represas' },
    { id: 'conservation_units', name: 'Unidades de Conservação', type: 'overlay', category: 'biome', visible: false, description: 'Parques e reservas ambientais' },
    
    // Statistics layers
    { id: 'population', name: 'Densidade Populacional', type: 'overlay', category: 'statistics', visible: false, description: 'Densidade por setor censitário' },
    { id: 'income', name: 'Renda Média', type: 'overlay', category: 'statistics', visible: false, description: 'Renda média por bairro' },
    { id: 'education_index', name: 'Índice de Educação', type: 'overlay', category: 'statistics', visible: false, description: 'IDEB por região' },
    
    // Urban layers
    { id: 'neighborhoods', name: 'Limites de Bairros', type: 'overlay', category: 'urban', visible: false, description: 'Divisão administrativa municipal' },
    { id: 'roads', name: 'Sistema Viário', type: 'overlay', category: 'urban', visible: false, description: 'Ruas, avenidas e rodovias' },
    { id: 'zoning', name: 'Zoneamento', type: 'overlay', category: 'urban', visible: false, description: 'Zoneamento urbano municipal' },
    { id: 'public_transport', name: 'Transporte Público', type: 'overlay', category: 'urban', visible: false, description: 'Linhas de ônibus e estações' },
  ]);

  // Simulate map initialization
  useEffect(() => {
    if (mapRef.current) {
      console.log('Initializing map with base map:', selectedBaseMap);
      setMapInstance({ initialized: true, baseMap: selectedBaseMap });
    }
  }, [selectedBaseMap]);

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

  const handleLayerImported = (newLayer: MapLayer) => {
    const importedLayer = {
      ...newLayer,
      category: 'imported' as const,
      imported: true,
      uploadDate: new Date().toISOString(),
    };
    setLayers(prevLayers => [...prevLayers, importedLayer]);
    console.log('New layer imported:', importedLayer);
  };

  const removeImportedLayer = (layerId: string) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId));
    toast({
      title: "Camada removida",
      description: "Camada importada foi removida do mapa.",
    });
  };

  const exportMap = () => {
    toast({
      title: "Exportando mapa",
      description: "Gerando imagem PNG do mapa atual incluindo a legenda...",
    });
    
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Mapa exportado!",
        description: "Download do arquivo PNG iniciado com legenda incluída.",
      });
    }, 2000);
  };

  const resetView = () => {
    toast({
      title: "Visão resetada",
      description: "Mapa retornado à extensão inicial.",
    });
  };

  const handleBaseMapChange = (baseMapId: string) => {
    setSelectedBaseMap(baseMapId);
    toast({
      title: "Mapa base alterado",
      description: `Mapa base alterado para ${baseMapId.toUpperCase()}.`,
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

        <div className="relative">
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <div 
                  ref={mapRef}
                  className="w-full h-[700px] bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                >
                  <div className="text-center space-y-4">
                    <Map className="h-16 w-16 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-600">Mapa WebGIS</h3>
                      <p className="text-gray-500">
                        Aqui será renderizado o mapa interativo com Leaflet.js
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Mapa Base: {selectedBaseMap.toUpperCase()} | Coordenadas: -23.5505° S, -46.6333° W (São Paulo)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map Toolbar */}
                <MapToolbar
                  onLayerImported={handleLayerImported}
                  onExportMap={exportMap}
                  onResetView={resetView}
                />

                {/* Base Map Selector */}
                <BaseMapSelector
                  selectedBaseMap={selectedBaseMap}
                  onBaseMapChange={handleBaseMapChange}
                />

                {/* Collapsible Sidebar */}
                <MapSidebar
                  layers={layers}
                  onToggleLayer={toggleLayer}
                  onRemoveLayer={removeImportedLayer}
                />

                {/* Map Legend */}
                <MapLegend layers={layers} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Info Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2">Informações do Mapa</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Zoom:</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Centro:</span>
                  <span>-23.55, -46.63</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mapa Base:</span>
                  <span>{selectedBaseMap.toUpperCase()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2">Estatísticas das Camadas</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Camadas ativas:</span>
                  <span>{layers.filter(l => l.visible).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Camadas importadas:</span>
                  <span>{layers.filter(l => l.imported).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total de camadas:</span>
                  <span>{layers.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2">Ações Rápidas</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Use a barra superior para importar ou exportar</p>
                <p>• Controle camadas pelo menu lateral</p>
                <p>• Selecione o mapa base no canto superior direito</p>
                <p>• A legenda aparece automaticamente</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default WebGIS;
