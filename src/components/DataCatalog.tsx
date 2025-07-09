import React, { useState } from 'react';
import { Search, Download, Calendar, Tag, Building, FileText, Filter, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useCkan, CkanDataset } from '../hooks/useCkan';
import { DataVisualization } from './DataVisualization';

export function DataCatalog() {
  const { datasets, loading, totalCount, searchDatasets, downloadResource } = useCkan();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('metadata_modified desc');
  const [selectedDataset, setSelectedDataset] = useState<CkanDataset | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchDatasets({
      q: searchQuery,
      sort: sortBy,
      rows: 20
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Tamanho não especificado';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Catálogo de Dados
          </CardTitle>
          <CardDescription>
            Explore e baixe datasets do repositório CKAN
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar datasets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metadata_modified desc">Mais recentes</SelectItem>
                  <SelectItem value="metadata_modified asc">Mais antigos</SelectItem>
                  <SelectItem value="title_string asc">Nome A-Z</SelectItem>
                  <SelectItem value="title_string desc">Nome Z-A</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </form>
          
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground mt-4">
              Encontrados {totalCount} datasets
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dataset Results */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando datasets...</p>
            </CardContent>
          </Card>
        ) : datasets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum dataset encontrado</p>
            </CardContent>
          </Card>
        ) : (
          datasets.map((dataset) => (
            <Card key={dataset.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-lg font-semibold text-primary">
                        {dataset.title || dataset.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {dataset.notes || 'Sem descrição disponível'}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedDataset(dataset)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{dataset.title || dataset.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-medium mb-2">Descrição</h4>
                              <p className="text-sm text-muted-foreground">
                                {dataset.notes || 'Sem descrição disponível'}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Informações</h4>
                                <div className="space-y-1 text-sm">
                                  <p><strong>Autor:</strong> {dataset.author || 'Não especificado'}</p>
                                  <p><strong>Criado:</strong> {formatDate(dataset.metadata_created)}</p>
                                  <p><strong>Atualizado:</strong> {formatDate(dataset.metadata_modified)}</p>
                                  {dataset.organization && (
                                    <p><strong>Organização:</strong> {dataset.organization.title}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Tags</h4>
                                <div className="flex flex-wrap gap-1">
                                  {dataset.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Recursos ({dataset.resources.length})</h4>
                              <div className="space-y-2">
                                {dataset.resources.map((resource) => (
                                  <div key={resource.id} className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{resource.name || 'Recurso sem nome'}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {resource.format} • {formatFileSize(resource.size)}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => downloadResource(resource)}
                                      >
                                        <Download className="h-4 w-4 mr-1" />
                                        Baixar
                                      </Button>
                                      {resource.format.toLowerCase().includes('csv') && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedDataset(dataset);
                                            setShowVisualization(true);
                                          }}
                                        >
                                          <FileText className="h-4 w-4 mr-1" />
                                          Visualizar
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {dataset.organization && (
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{dataset.organization.title}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Atualizado em {formatDate(dataset.metadata_modified)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{dataset.resources.length} recursos</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {dataset.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-wrap gap-1">
                        {dataset.tags.slice(0, 5).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                        {dataset.tags.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{dataset.tags.length - 5} mais
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Resources Preview */}
                  <div className="flex flex-wrap gap-2">
                    {dataset.resources.slice(0, 3).map((resource) => (
                      <div key={resource.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <Badge variant="outline" className="text-xs">
                          {resource.format}
                        </Badge>
                        <span className="text-xs text-muted-foreground truncate max-w-32">
                          {resource.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadResource(resource)}
                          className="h-6 w-6 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {dataset.resources.length > 3 && (
                      <div className="flex items-center p-2 text-xs text-muted-foreground">
                        +{dataset.resources.length - 3} mais recursos
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Data Visualization Dialog */}
      {showVisualization && selectedDataset && (
        <Dialog open={showVisualization} onOpenChange={setShowVisualization}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Visualização de Dados - {selectedDataset.title}</DialogTitle>
            </DialogHeader>
            <DataVisualization 
              dataset={selectedDataset}
              onClose={() => setShowVisualization(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}