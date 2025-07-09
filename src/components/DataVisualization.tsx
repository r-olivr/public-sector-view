import React, { useState, useEffect } from 'react';
import { BarChart3, LineChart, PieChart, Table, Download, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { CkanDataset, CkanResource } from '../hooks/useCkan';
import { useToast } from '../hooks/use-toast';

interface DataVisualizationProps {
  dataset: CkanDataset;
  onClose?: () => void;
}

interface CSVData {
  headers: string[];
  rows: any[][];
}

export function DataVisualization({ dataset, onClose }: DataVisualizationProps) {
  const [selectedResource, setSelectedResource] = useState<CkanResource | null>(null);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const { toast } = useToast();

  // Filter for CSV resources
  const csvResources = dataset.resources.filter(
    resource => resource.format.toLowerCase().includes('csv')
  );

  useEffect(() => {
    if (csvResources.length > 0 && !selectedResource) {
      setSelectedResource(csvResources[0]);
    }
  }, [csvResources]);

  const loadCSVData = async (resource: CkanResource) => {
    setLoading(true);
    setError(null);
    setCsvData(null);

    try {
      const response = await fetch(resource.url);
      
      if (!response.ok) {
        throw new Error('Falha ao carregar o arquivo CSV');
      }

      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('Arquivo CSV vazio');
      }

      const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
      const rows = lines.slice(1, 101).map(line => // Limit to first 100 rows for performance
        line.split(',').map(cell => cell.trim().replace(/"/g, ''))
      );

      setCsvData({ headers, rows });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(errorMessage);
      toast({
        title: "Erro ao carregar dados",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedResource) {
      loadCSVData(selectedResource);
    }
  }, [selectedResource]);

  const renderTable = () => {
    if (!csvData) return null;

    return (
      <div className="border rounded-lg overflow-auto max-h-96">
        <table className="w-full text-sm">
          <thead className="bg-muted sticky top-0">
            <tr>
              {csvData.headers.map((header, index) => (
                <th key={index} className="px-4 py-2 text-left font-medium border-r">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b hover:bg-muted/50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2 border-r">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderChart = () => {
    if (!csvData) return null;

    // Simple chart placeholder - in a real implementation, you'd use a library like recharts
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Visualização de Gráficos</h3>
          <p className="text-muted-foreground mb-4">
            Funcionalidade de gráficos será implementada com base nos dados carregados
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Dados disponíveis: {csvData.headers.length} colunas, {csvData.rows.length} linhas</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const downloadCSV = () => {
    if (!csvData || !selectedResource) return;

    const csvContent = [
      csvData.headers.join(','),
      ...csvData.rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = selectedResource.name || 'data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download concluído",
      description: "Dados baixados com sucesso"
    });
  };

  if (csvResources.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Este dataset não possui recursos CSV disponíveis para visualização.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Recurso</label>
            <Select
              value={selectedResource?.id || ''}
              onValueChange={(value) => {
                const resource = csvResources.find(r => r.id === value);
                if (resource) setSelectedResource(resource);
              }}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecione um recurso" />
              </SelectTrigger>
              <SelectContent>
                {csvResources.map((resource) => (
                  <SelectItem key={resource.id} value={resource.id}>
                    {resource.name || 'Recurso sem nome'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Visualização</label>
            <Select value={viewMode} onValueChange={(value: 'table' | 'chart') => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">
                  <div className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    Tabela
                  </div>
                </SelectItem>
                <SelectItem value="chart">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Gráfico
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {csvData && (
            <Button variant="outline" onClick={downloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              Baixar dados
            </Button>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          )}
        </div>
      </div>

      {/* Resource Info */}
      {selectedResource && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{selectedResource.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedResource.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedResource.format}</Badge>
                {selectedResource.size && (
                  <Badge variant="outline">
                    {(selectedResource.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Data Visualization */}
      {csvData && !loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {viewMode === 'table' ? (
                <>
                  <Table className="h-5 w-5" />
                  Visualização em Tabela
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5" />
                  Visualização em Gráfico
                </>
              )}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{csvData.headers.length} colunas</span>
              <span>{csvData.rows.length} linhas (primeiras 100)</span>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'table' ? renderTable() : renderChart()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}