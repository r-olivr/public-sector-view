
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, MapPin } from 'lucide-react';

interface LayerImportProps {
  onLayerImported: (layer: any) => void;
}

const LayerImport = ({ onLayerImported }: LayerImportProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [layerName, setLayerName] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!layerName.trim()) {
      toast({
        title: "Nome necessário",
        description: "Por favor, insira um nome para a camada.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Validate file type
      const allowedTypes = ['.geojson', '.json', '.kml', '.gpx'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(fileExtension)) {
        throw new Error('Tipo de arquivo não suportado. Use GeoJSON, KML ou GPX.');
      }

      // Read file content
      const fileContent = await file.text();
      let layerData;

      // Parse based on file type
      if (fileExtension === '.geojson' || fileExtension === '.json') {
        layerData = JSON.parse(fileContent);
        
        // Validate GeoJSON structure
        if (!layerData.type || layerData.type !== 'FeatureCollection') {
          throw new Error('Arquivo GeoJSON inválido. Deve ser um FeatureCollection.');
        }
      } else {
        // For KML/GPX, we would need additional parsing libraries
        // For now, we'll show a message that these formats need conversion
        throw new Error('KML e GPX serão suportados em breve. Use GeoJSON por enquanto.');
      }

      // Create layer object
      const newLayer = {
        id: `imported_${Date.now()}`,
        name: layerName,
        type: 'overlay' as const,
        visible: true,
        description: `Camada importada: ${file.name}`,
        data: layerData,
        imported: true,
        uploadDate: new Date().toISOString(),
      };

      onLayerImported(newLayer);

      toast({
        title: "Camada importada!",
        description: `${layerName} foi adicionada ao mapa com sucesso.`,
      });

      // Reset form
      setLayerName('');
      event.target.value = '';

    } catch (error) {
      console.error('Error importing layer:', error);
      toast({
        title: "Erro na importação",
        description: error instanceof Error ? error.message : "Erro desconhecido ao importar camada.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Importar Camada</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="layer-name">Nome da Camada</Label>
          <Input
            id="layer-name"
            placeholder="Ex: Limites do Município"
            value={layerName}
            onChange={(e) => setLayerName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="layer-file">Arquivo da Camada</Label>
          <Input
            id="layer-file"
            type="file"
            accept=".geojson,.json,.kml,.gpx"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>Formatos suportados: GeoJSON (.geojson, .json)</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>Tamanho máximo: 10MB</span>
            </div>
          </div>
        </div>

        {uploading && (
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Processando arquivo...</span>
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
          <p className="font-medium mb-1">Dicas para importação:</p>
          <ul className="text-xs space-y-1">
            <li>• Use coordenadas em WGS84 (EPSG:4326)</li>
            <li>• Verifique se o arquivo GeoJSON é válido</li>
            <li>• Camadas grandes podem demorar para carregar</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerImport;
