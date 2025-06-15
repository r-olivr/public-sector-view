
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Layers, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface MapSidebarProps {
  layers: MapLayer[];
  onToggleLayer: (layerId: string) => void;
  onRemoveLayer: (layerId: string) => void;
}

const MapSidebar = ({ layers, onToggleLayer, onRemoveLayer }: MapSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    equipment: true,
    biome: true,
    statistics: true,
    urban: true,
    imported: true,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'equipment': return 'Equipamentos';
      case 'biome': return 'Bioma';
      case 'statistics': return 'Estatísticas';
      case 'urban': return 'Mapa Urbano';
      case 'imported': return 'Camadas Importadas';
      default: return 'Outras';
    }
  };

  const overlayLayers = layers.filter(layer => layer.type === 'overlay');
  const layersByCategory = overlayLayers.reduce((acc, layer) => {
    const category = layer.category || 'imported';
    if (!acc[category]) acc[category] = [];
    acc[category].push(layer);
    return acc;
  }, {} as Record<string, MapLayer[]>);

  return (
    <div className={cn(
      "absolute left-4 top-20 z-10 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-12" : "w-80"
    )}>
      <Card className="h-fit shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <CardTitle className="flex items-center space-x-2">
                <Layers className="h-5 w-5" />
                <span>Controle de Camadas</span>
              </CardTitle>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        
        {!isCollapsed && (
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(layersByCategory).map(([category, categoryLayers]) => (
              <div key={category}>
                <div 
                  className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded"
                  onClick={() => toggleCategory(category)}
                >
                  <h4 className="font-medium text-sm text-gray-700">
                    {getCategoryTitle(category)}
                  </h4>
                  {expandedCategories[category] ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                
                {expandedCategories[category] && (
                  <div className="ml-2 space-y-2">
                    {categoryLayers.map((layer) => (
                      <div key={layer.id} className="flex items-center space-x-2 py-2">
                        <Checkbox
                          id={layer.id}
                          checked={layer.visible}
                          onCheckedChange={() => onToggleLayer(layer.id)}
                        />
                        <div className="flex-1">
                          <label htmlFor={layer.id} className="text-sm font-medium cursor-pointer">
                            {layer.name}
                            {layer.imported && (
                              <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">
                                Importada
                              </span>
                            )}
                          </label>
                          <p className="text-xs text-gray-500">{layer.description}</p>
                          {layer.imported && layer.uploadDate && (
                            <p className="text-xs text-gray-400">
                              Importada em {new Date(layer.uploadDate).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        {layer.imported && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveLayer(layer.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default MapSidebar;
