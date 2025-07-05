
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface MapLayer {
  id: string;
  name: string;
  type: 'base' | 'overlay';
  visible: boolean;
  description: string;
  data?: any;
  imported?: boolean;
}

interface MapLegendProps {
  layers: MapLayer[];
}

const MapLegend = ({ layers }: MapLegendProps) => {
  const visibleLayers = layers.filter(layer => layer.visible && layer.type === 'overlay');

  if (visibleLayers.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-4 right-4 z-40 max-w-xs">
      <Card className="shadow-lg bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>Legenda</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {visibleLayers.map((layer) => (
            <div key={layer.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                {layer.id === 'schools' && (
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                )}
                {layer.id === 'health_units' && (
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                )}
                {layer.id === 'neighborhoods' && (
                  <div className="w-4 h-4 bg-transparent border-2 border-purple-600"></div>
                )}
                {layer.id === 'population' && (
                  <div className="w-4 h-2 bg-gradient-to-r from-yellow-200 to-red-600"></div>
                )}
                {layer.imported && (
                  <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-700"></div>
                )}
                <span className="text-sm font-medium">{layer.name}</span>
              </div>
              {layer.id === 'population' && (
                <div className="text-xs text-gray-600 ml-6">
                  <div className="flex justify-between">
                    <span>Baixa</span>
                    <span>Alta</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default MapLegend;
