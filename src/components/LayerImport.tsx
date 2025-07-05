import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
// PASSO 1: Importar o ícone de ajuda (HelpCircle)
import { Upload, CheckCircle, HelpCircle } from 'lucide-react';

interface LayerImportProps {
  onLayerImported: (layer: any, color: string) => void;
}

const LayerImport = ({ onLayerImported }: LayerImportProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [layerName, setLayerName] = useState('');
  const [layerColor, setLayerColor] = useState('#3388ff');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleConfirmImport = async () => {
    // ... (a lógica desta função permanece a mesma) ...
    if (!layerName.trim()) {
      toast({ title: "Erro", description: "Por favor, insira um nome para a camada.", variant: "destructive" });
      return;
    }
    if (!selectedFile) {
      toast({ title: "Erro", description: "Por favor, escolha um arquivo.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const fileContent = await selectedFile.text();
      const layerData = JSON.parse(fileContent);
      if (layerData.type !== 'FeatureCollection' && layerData.type !== 'Feature') {
        throw new Error('Arquivo GeoJSON inválido.');
      }
      const newLayer = {
        name: layerName,
        type: 'overlay' as const,
        visible: true,
        description: `Camada importada: ${selectedFile.name}`,
        data: layerData,
      };
      onLayerImported(newLayer, layerColor);
      toast({
        title: "Camada importada!",
        description: `${layerName} foi adicionada ao mapa com sucesso.`,
      });
      setLayerName('');
      setLayerColor('#3388ff');
      setSelectedFile(null);
      const fileInput = document.getElementById('layer-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    // TooltipProvider é necessário para o tooltip funcionar
    <TooltipProvider>
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Importar Nova Camada</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground pt-1">
            Faça upload de um arquivo GeoJSON para adicionar uma nova camada ao mapa.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* PASSO 2: Agrupar Nome e Cor em um layout flexível */}
          <div className="space-y-2">
            <Label htmlFor="layer-name">Nome da Camada</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="layer-name"
                placeholder="Ex: Limites do Município"
                value={layerName}
                onChange={(e) => setLayerName(e.target.value)}
                className="flex-grow" // Faz o input de nome ocupar o espaço disponível
              />
              <Input
                id="layer-color"
                type="color"
                value={layerColor}
                onChange={(e) => setLayerColor(e.target.value)}
                className="p-1 h-10 w-10 flex-shrink-0" // Define um tamanho fixo para o seletor de cor
                aria-label="Cor da camada"
              />
              
            </div>
          </div>

          {/* Arquivo da Camada */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="layer-file">Arquivo da Camada (GeoJSON)</Label>
              {/* PASSO 3: Adicionar o Tooltip com o ícone de ajuda */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-muted-foreground hover:text-foreground">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-sm" side="top">
                  <p className="font-bold mb-2">Dicas para importação:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use coordenadas em WGS84 (EPSG:4326).</li>
                    <li>Verifique se o arquivo GeoJSON é válido.</li>
                    <li>Camadas grandes podem demorar para carregar.</li>
                    <li>Formatos suportados: .geojson, .json.</li>
                    <li>Tamanho máximo: 10MB.</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input id="layer-file" type="file" accept=".geojson,.json" onChange={handleFileChange} disabled={uploading} />
          </div>

          {/* Botão Confirmar */}
          <div className="pt-2">
            <Button
              className="w-full"
              onClick={handleConfirmImport}
              disabled={uploading || !layerName || !selectedFile}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {uploading ? 'Importando...' : 'Confirmar Importação'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default LayerImport;