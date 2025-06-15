
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Download, ZoomIn, Map } from 'lucide-react';
import LayerImport from './LayerImport';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MapToolbarProps {
  onLayerImported: (layer: any) => void;
  onExportMap: () => void;
  onResetView: () => void;
}

const MapToolbar = ({ onLayerImported, onExportMap, onResetView }: MapToolbarProps) => {
  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleLayerImported = (layer: any) => {
    onLayerImported(layer);
    setShowImportDialog(false);
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <Card className="px-4 py-2 shadow-lg">
        <div className="flex items-center space-x-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Importar Camada
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Importar Nova Camada</DialogTitle>
                <DialogDescription>
                  Faça upload de um arquivo GeoJSON para adicionar uma nova camada ao mapa.
                </DialogDescription>
              </DialogHeader>
              <LayerImport onLayerImported={handleLayerImported} />
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={onResetView}>
            <ZoomIn className="h-4 w-4 mr-1" />
            Reset
          </Button>

          <Button variant="outline" size="sm" onClick={onExportMap}>
            <Download className="h-4 w-4 mr-1" />
            Exportar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MapToolbar;
