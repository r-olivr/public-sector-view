import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';

interface Dataset {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadDate: string;
  format: string;
  description: string;
  filename?: string;
}

interface LocalDatasetManagerProps {
  datasets: Dataset[];
  categories: { value: string; label: string }[];
}

export function LocalDatasetManager({ datasets, categories }: LocalDatasetManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const filteredDatasets = selectedCategory === "all"
    ? datasets
    : datasets.filter(dataset => dataset.category === selectedCategory);

  const handleDownload = (dataset: Dataset) => {
    if (!dataset.filename) {
      toast({ title: "Erro", description: "Arquivo não disponível para download.", variant: "destructive" });
      return;
    }
    const link = document.createElement("a");
    link.href = `/api/download/${dataset.filename}`;
    link.download = dataset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download iniciado",
      description: `Baixando ${dataset.name}...`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Datasets Locais</span>
        </CardTitle>
        <CardDescription>
          Gerencie os dados já carregados no sistema
        </CardDescription>
        <div className="mt-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {filteredDatasets.map((dataset) => (
            <Card key={dataset.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{dataset.name}</h3>
                    <p className="text-muted-foreground text-sm">{dataset.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {categories.find(cat => cat.value === dataset.category)?.label}
                      </span>
                      <span>{dataset.format}</span>
                      <span>{dataset.size}</span>
                      <span>Uploaded: {new Date(dataset.uploadDate).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(dataset)}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Baixar</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredDatasets.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum dataset encontrado para esta categoria.</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}