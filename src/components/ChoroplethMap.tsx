
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Info } from 'lucide-react';
import mapConfig from '@/config/mapConfig.json';
import sampleData from '@/data/sampleData.json';

interface ChoroplethMapProps {
  height?: string;
  showControls?: boolean;
}

const ChoroplethMap = ({ height = '500px', showControls = true }: ChoroplethMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState(mapConfig.defaultIndicator);
  const [hoveredNeighborhood, setHoveredNeighborhood] = useState<any>(null);

  const getCurrentIndicatorConfig = () => mapConfig.indicators[selectedIndicator as keyof typeof mapConfig.indicators];
  const getColorScheme = () => mapConfig.colorSchemes[getCurrentIndicatorConfig().colorScheme as keyof typeof mapConfig.colorSchemes];

  const getColor = (value: number, min: number, max: number) => {
    const colors = getColorScheme();
    const intensity = (value - min) / (max - min);
    const colorIndex = Math.min(Math.floor(intensity * colors.length), colors.length - 1);
    return colors[colorIndex];
  };

  const exportMap = () => {
    if (!mapInstance.current) return;
    
    // Create a canvas to draw the map
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;
    
    // Simple export simulation - in a real implementation, you'd use libraries like html2canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(`Mapa: ${getCurrentIndicatorConfig().label}`, 20, 30);
    ctx.fillText(`Cidade: ${mapConfig.cityName}`, 20, 50);
    
    // Download the canvas as PNG
    const link = document.createElement('a');
    link.download = `mapa-${selectedIndicator}-${mapConfig.cityName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([-23.550, -46.630], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

    // Clear existing layers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    // Get current indicator values
    const indicatorValues = sampleData.neighborhoods.map(n => n.indicators[selectedIndicator as keyof typeof n.indicators]);
    const minValue = Math.min(...indicatorValues);
    const maxValue = Math.max(...indicatorValues);

    // Add neighborhood polygons
    sampleData.neighborhoods.forEach((neighborhood) => {
      const value = neighborhood.indicators[selectedIndicator as keyof typeof neighborhood.indicators];
      const color = getColor(value, minValue, maxValue);
      
      const polygon = L.polygon(neighborhood.coordinates[0] as [number, number][], {
        color: color,
        weight: 2,
        opacity: 0.8,
        fillColor: color,
        fillOpacity: 0.6
      }).addTo(mapInstance.current!);

      polygon.on('mouseover', () => {
        polygon.setStyle({ weight: 3, opacity: 1, fillOpacity: 0.8 });
        setHoveredNeighborhood({ ...neighborhood, value });
      });

      polygon.on('mouseout', () => {
        polygon.setStyle({ weight: 2, opacity: 0.8, fillOpacity: 0.6 });
        setHoveredNeighborhood(null);
      });

      polygon.bindTooltip(`
        <strong>${neighborhood.name}</strong><br/>
        ${getCurrentIndicatorConfig().label}: ${value} ${getCurrentIndicatorConfig().unit}
      `);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [selectedIndicator]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Mapa Coroplético - {mapConfig.cityName}</span>
          </CardTitle>
          {showControls && (
            <div className="flex items-center space-x-4">
              <Select value={selectedIndicator} onValueChange={setSelectedIndicator}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(mapConfig.indicators).map(([key, indicator]) => (
                    <SelectItem key={key} value={key}>
                      {indicator.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={exportMap}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {getCurrentIndicatorConfig().description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div 
            ref={mapRef} 
            style={{ height }}
            className="rounded-lg border overflow-hidden"
          />
          
          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border max-w-xs">
            <div className="text-sm font-medium mb-2">
              {getCurrentIndicatorConfig().label}
            </div>
            <div className="space-y-1">
              {getColorScheme().map((color, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded border" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-600">
                    {index === 0 ? 'Baixo' : index === getColorScheme().length - 1 ? 'Alto' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hover Info */}
          {hoveredNeighborhood && (
            <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
              <div className="font-semibold text-sm">{hoveredNeighborhood.name}</div>
              <div className="text-sm text-gray-600">
                {getCurrentIndicatorConfig().label}: {hoveredNeighborhood.value} {getCurrentIndicatorConfig().unit}
              </div>
            </div>
          )}
        </div>

        {/* Source */}
        <div className="mt-4 text-xs text-gray-500 flex items-center">
          <Info className="h-3 w-3 mr-1" />
          Fonte: {mapConfig.dataSource}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChoroplethMap;
