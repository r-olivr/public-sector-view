
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Map } from 'lucide-react';

interface BaseMapOption {
  id: string;
  name: string;
  description: string;
}

interface BaseMapSelectorProps {
  selectedBaseMap: string;
  onBaseMapChange: (baseMapId: string) => void;
}

const baseMapOptions: BaseMapOption[] = [
  { id: 'osm', name: 'OpenStreetMap', description: 'Mapa padrão colaborativo' },
  { id: 'bing-satellite', name: 'Bing Satellite', description: 'Imagens de satélite' },
  { id: 'bing-road', name: 'Bing Road', description: 'Mapa rodoviário' },
  { id: 'google-terrain', name: 'Google Terrain', description: 'Mapa de relevo' },
  { id: 'esri-world', name: 'ESRI World', description: 'Mapa mundial ESRI' },
];

const BaseMapSelector = ({ selectedBaseMap, onBaseMapChange }: BaseMapSelectorProps) => {
  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <Card className="p-2 shadow-lg bg-white">
        <div className="flex items-center space-x-2 min-w-48">
          <Map className="h-4 w-4 text-gray-600" />
          <Select value={selectedBaseMap} onValueChange={onBaseMapChange}>
            <SelectTrigger className="border-0 shadow-none focus:ring-0 h-8 text-sm">
              <SelectValue placeholder="Selecione o mapa base" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg">
              {baseMapOptions.map((option) => (
                <SelectItem key={option.id} value={option.id} className="cursor-pointer">
                  <div>
                    <div className="font-medium">{option.name}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>
    </div>
  );
};

export default BaseMapSelector;
