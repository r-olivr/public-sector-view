import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Layers, Upload, Download, ChevronLeft, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import LayerImport from './LayerImport'; // Importaremos o componente de importação

// Interface para as propriedades da camada
interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  color?: string;
  imported?: boolean;
  category?: string;
}

// A sidebar agora precisa de mais props, pois vai lidar com a importação
interface MapSidebarProps {
  layers: MapLayer[];
  onToggleLayer: (layerId: string) => void;
  onRemoveLayer: (layerId: string) => void;
  onLayerColorChange: (layerId: string, newColor: string) => void;
  onLayerImported: (layer: any, color: string) => void; // Prop vinda do MapToolbar
  onExportMap: () => void; // Prop vinda do MapToolbar
}

type ActiveView = 'layers' | 'import' | 'export';

const MapSidebar = (props: MapSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('layers');

  const handleIconClick = (view: ActiveView) => {
    setActiveView(view);
    setIsExpanded(true);
  };

  const layersByCategory = props.layers.reduce((acc, layer) => {
    const category = layer.category || 'imported';
    if (!acc[category]) acc[category] = [];
    acc[category].push(layer);
    return acc;
  }, {} as Record<string, MapLayer[]>);
  
  const categoryOrder = ['imported', 'equipment', 'urban', 'statistics', 'biome'];
  const categoryNames: Record<string, string> = {
    imported: 'Camadas Importadas',
    equipment: 'Equipamentos',
    urban: 'Urbano',
    statistics: 'Estatísticas',
    biome: 'Bioma',
  };

  return (
    <div className={cn(
        "bg-gray-50 border-r border-gray-200 flex transition-all duration-300 z-20",
        isExpanded ? 'w-80' : 'w-16'
      )}>
      {/* Coluna de Ícones (sempre visível) */}
      <div className="w-16 flex flex-col items-center space-y-4 py-4 border-r">
        <Button variant={activeView === 'layers' && isExpanded ? 'secondary' : 'ghost'} size="icon" onClick={() => handleIconClick('layers')}>
          <Layers className="h-5 w-5" />
        </Button>
        <Button variant={activeView === 'import' && isExpanded ? 'secondary' : 'ghost'} size="icon" onClick={() => handleIconClick('import')}>
          <Upload className="h-5 w-5" />
        </Button>
        <Button variant={activeView === 'export' && isExpanded ? 'secondary' : 'ghost'} size="icon" onClick={() => handleIconClick('export')}>
          <Download className="h-5 w-5" />
        </Button>
      </div>

      {/* Painel Expansível */}
      <div className={cn("flex-grow flex flex-col", { 'hidden': !isExpanded })}>
        {/* Cabeçalho do Painel Expansível */}
        <div className="flex items-center p-2 border-b">
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="font-semibold ml-2">
            {activeView === 'layers' && 'Controle de Camadas'}
            {activeView === 'import' && 'Importar Nova Camada'}
            {activeView === 'export' && 'Exportar Mapa'}
          </h3>
        </div>

        {/* Conteúdo Dinâmico do Painel */}
        <div className="p-4 overflow-y-auto">
          {activeView === 'layers' && (
            // Lógica de visualização de camadas que já tínhamos
             <div className="space-y-4">
              {categoryOrder.map(category => {
                  const categoryLayers = layersByCategory[category];
                  if (!categoryLayers || categoryLayers.length === 0) return null;
                  return (
                    <div key={category}>
                      {/* ... (lógica do accordion/categorias aqui, se desejar) ... */}
                       {categoryLayers.map((layer) => (
                        <div key={layer.id} className="text-sm mb-3">
                          <div className="flex items-center">
                            <Checkbox id={layer.id} checked={layer.visible} onCheckedChange={() => props.onToggleLayer(layer.id)} />
                            <Label htmlFor={layer.id} className="ml-2">{layer.name}</Label>
                          </div>
                          {layer.imported && (
                            <div className="flex items-center justify-between mt-2 pl-6">
                               <Input type="color" value={layer.color || '#3388ff'} onChange={(e) => props.onLayerColorChange(layer.id, e.target.value)} className="p-0 h-6 w-6"/>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700" onClick={() => props.onRemoveLayer(layer.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
              })}
            </div>
          )}
          {activeView === 'import' && (
            <LayerImport onLayerImported={props.onLayerImported} />
          )}
          {activeView === 'export' && (
            <div className="space-y-4">
              <p>Clique no botão para exportar a visualização atual do mapa como uma imagem.</p>
              <Button className="w-full" onClick={props.onExportMap}>
                Exportar para PNG
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSidebar;