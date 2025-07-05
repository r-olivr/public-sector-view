import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react'; // Importe o useRef
import MapSidebar from '@/components/MapSidebar';
import MapLegend from '@/components/MapLegend';
import BaseMapSelector from '@/components/BaseMapSelector';
import BrandedHeader from '@/components/BrandedHeader';
import { useToast } from '@/hooks/use-toast';
import type { Map as LeafletMap } from 'leaflet';
import type { GeoJsonObject } from 'geojson';

// ... (a interface MapLayer permanece a mesma)
interface MapLayer {
  id: string;
  name: string;
  type: 'base' | 'overlay';
  category?: 'equipment' | 'biome' | 'statistics' | 'urban' | 'imported';
  visible: boolean;
  description: string;
  color?: string;
  data?: GeoJsonObject;
  imported?: boolean;
  uploadDate?: string;
}


const WebGIS = () => {
  const { toast } = useToast();
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null);
  const [selectedBaseMap, setSelectedBaseMap] = useState('osm');
  const [layers, setLayers] = useState<MapLayer[]>([]);
  // PASSO 1: Criar uma referência para o contêiner do mapa
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // ... (suas funções de manipulação de camadas permanecem as mesmas)
  const handleLayerColorChange = (layerId: string, newColor: string) => { setLayers(prev => prev.map(l => l.id === layerId ? { ...l, color: newColor } : l)); };
  const handleLayerImported = (newLayer: any, color: string) => {
    const importedLayer: MapLayer = { ...newLayer, id: `imported_${Date.now()}`, category: 'imported', imported: true, uploadDate: new Date().toISOString(), color: color };
    setLayers(prev => [...prev, importedLayer]);
  };
  const toggleLayer = (layerId: string) => { setLayers(prev => prev.map(l => l.id === layerId ? { ...l, visible: !l.visible } : l)); };
  const removeImportedLayer = (layerId: string) => { setLayers(prev => prev.filter(l => l.id !== layerId)); toast({ title: "Camada removida" }); };
  const exportMap = () => { toast({ title: "Exportando..." }) };
  const handleBaseMapChange = (baseMapId: string) => { setSelectedBaseMap(baseMapId) };


  // PASSO 2: Configurar o ResizeObserver
  useEffect(() => {
    // Só executa se tivermos a instância do mapa e a referência do contêiner
    if (!mapInstance || !mapContainerRef.current) return;

    // Cria o observador. A função dentro dele será chamada sempre que o tamanho do contêiner mudar.
    const resizeObserver = new ResizeObserver(() => {
      mapInstance.invalidateSize();
    });

    // Manda o observador começar a "vigiar" o contêiner do mapa
    resizeObserver.observe(mapContainerRef.current);

    // Função de limpeza: quando o componente for desmontado, paramos de "vigiar" para evitar erros.
    return () => {
      resizeObserver.disconnect();
    };
  }, [mapInstance]); // A dependência é a instância do mapa.

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50">
      <BrandedHeader />
      
      <main className="flex flex-1 overflow-hidden">
        <MapSidebar
          layers={layers}
          onToggleLayer={toggleLayer}
          onRemoveLayer={removeImportedLayer}
          onLayerColorChange={handleLayerColorChange}
          onLayerImported={handleLayerImported}
          onExportMap={exportMap}
        />
        
        {/* PASSO 3: Anexar a referência ao contêiner do mapa */}
        <div className="relative flex-grow z-10" ref={mapContainerRef}>
          <MapContainer
            center={[-10.8549, -37.1264]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            ref={setMapInstance}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {layers
              .filter(layer => layer.visible && layer.data)
              .map(layer => {
                const style = { color: layer.color || '#3388ff', weight: 2, fillColor: layer.color || '#3388ff', fillOpacity: 0.5 };
                return (
                  <GeoJSON key={layer.id} data={layer.data!} style={style}>
                    <Popup>{layer.name}</Popup>
                  </GeoJSON>
                );
              })}
          </MapContainer>

          <BaseMapSelector
            selectedBaseMap={selectedBaseMap}
            onBaseMapChange={handleBaseMapChange}
          />
          <MapLegend layers={layers} />
        </div>
      </main>
    </div>
  );
};

export default WebGIS;