import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, FileText, Filter, Database, Search } from 'lucide-react';

interface Dataset {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadDate: string;
  format: string;
  description: string;
}

interface DatabaseTable {
  id: string;
  name: string;
  displayName: string;
  description: string;
  columns: DatabaseColumn[];
}

interface DatabaseColumn {
  id: string;
  name: string;
  displayName: string;
  type: string;
  description: string;
}

const DataManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  
  // Database query states
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [columnSearch, setColumnSearch] = useState<string>('');
  const [translateCodes, setTranslateCodes] = useState<boolean>(true);

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'seguranca', label: 'Segurança Pública' },
    { value: 'infraestrutura', label: 'Infraestrutura' },
    { value: 'social', label: 'Assistência Social' }
  ];

  const mockDatasets: Dataset[] = [
    {
      id: '1',
      name: 'Indicadores de Saúde 2024',
      category: 'saude',
      size: '2.3 MB',
      uploadDate: '2024-01-15',
      format: 'CSV',
      description: 'Dados consolidados de atendimentos e indicadores de saúde municipal'
    },
    {
      id: '2',
      name: 'Matrículas Escolares 2023-2024',
      category: 'educacao',
      size: '1.8 MB',
      uploadDate: '2024-01-10',
      format: 'XLSX',
      description: 'Dados de matrículas por escola e modalidade de ensino'
    },
    {
      id: '3',
      name: 'Ocorrências Policiais 2023',
      category: 'seguranca',
      size: '5.2 MB',
      uploadDate: '2024-01-08',
      format: 'CSV',
      description: 'Registro de ocorrências policiais georreferenciadas'
    }
  ];

  // Mock database tables
  const mockDatabaseTables: DatabaseTable[] = [
    {
      id: 'agua_esgoto',
      name: 'servicos_agua_esgoto',
      displayName: 'Serviços de Água e Esgoto nos Municípios',
      description: 'Dados sobre prestadores de serviços de água e esgoto',
      columns: [
        { id: 'nome', name: 'nome', displayName: 'Nome', type: 'string', description: 'Nome do município' },
        { id: 'populacao_atendida_agua', name: 'populacao_atendida_agua', displayName: 'População Atendida - Água', type: 'number', description: 'AG001 - População total atendida com abastecimento de água' },
        { id: 'populacao_atendida_esgoto', name: 'populacao_atendida_esgoto', displayName: 'População Atendida - Esgoto', type: 'number', description: 'ES001 - População total atendida com esgotamento sanitário' },
        { id: 'populacao_urbana', name: 'populacao_urbana', displayName: 'População Urbana', type: 'number', description: 'População urbana do município' },
        { id: 'populacao_urbana_residente_agua', name: 'populacao_urbana_residente_agua', displayName: 'População Urbana Residente - Água', type: 'number', description: 'G06A - População urbana residente atendida com abastecimento de água' },
        { id: 'populacao_urbana_atendida_agua', name: 'populacao_urbana_atendida_agua', displayName: 'População Urbana Atendida - Água', type: 'number', description: 'AG026 - População urbana atendida com abastecimento de água' },
        { id: 'populacao_urbana_atendida_agua_ibge', name: 'populacao_urbana_atendida_agua_ibge', displayName: 'População Urbana Atendida - Água (IBGE)', type: 'number', description: 'G12A - População total residente do município segundo o IBGE' }
      ]
    },
    {
      id: 'serie_historica',
      name: 'serie_historica_municipios',
      displayName: 'Série Histórica Municípios',
      description: 'Dados históricos dos municípios',
      columns: [
        { id: 'municipio', name: 'municipio', displayName: 'Município', type: 'string', description: 'Nome do município' },
        { id: 'ano', name: 'ano', displayName: 'Ano', type: 'number', description: 'Ano de referência' },
        { id: 'populacao', name: 'populacao', displayName: 'População', type: 'number', description: 'População total do município' },
        { id: 'pib', name: 'pib', displayName: 'PIB', type: 'number', description: 'Produto Interno Bruto municipal' }
      ]
    }
  ];

  const filteredDatasets = selectedCategory === 'all' 
    ? mockDatasets 
    : mockDatasets.filter(dataset => dataset.category === selectedCategory);

  const selectedTableData = mockDatabaseTables.find(table => table.id === selectedTable);
  const filteredColumns = selectedTableData?.columns.filter(column => 
    column.displayName.toLowerCase().includes(columnSearch.toLowerCase()) ||
    column.name.toLowerCase().includes(columnSearch.toLowerCase())
  ) || [];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUpload = () => {
    if (!uploadFile) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo para upload.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Upload realizado!",
      description: `Arquivo ${uploadFile.name} foi enviado com sucesso.`,
    });
    setUploadFile(null);
  };

  const handleDownload = (dataset: Dataset) => {
    toast({
      title: "Download iniciado",
      description: `Baixando ${dataset.name}...`,
    });
  };

  const handleColumnToggle = (columnId: string, checked: boolean) => {
    setSelectedColumns(prev => 
      checked 
        ? [...prev, columnId]
        : prev.filter(id => id !== columnId)
    );
  };

  const handleSelectAllColumns = (checked: boolean) => {
    if (checked) {
      setSelectedColumns(filteredColumns.map(col => col.id));
    } else {
      setSelectedColumns([]);
    }
  };

  const handleGenerateQuery = () => {
    if (!selectedTable || selectedColumns.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione uma tabela e pelo menos uma coluna.",
        variant: "destructive",
      });
      return;
    }

    const selectedTableData = mockDatabaseTables.find(table => table.id === selectedTable);
    const selectedColumnNames = selectedColumns.map(colId => 
      selectedTableData?.columns.find(col => col.id === colId)?.displayName
    ).join(', ');

    toast({
      title: "Consulta gerada!",
      description: `Baixando dados de ${selectedTableData?.displayName} com colunas: ${selectedColumnNames}`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Dados</h1>
        <p className="text-gray-600 mt-2">
          Faça upload, organize e baixe datasets para análise e tomada de decisão
        </p>
      </div>

      <Tabs defaultValue="datasets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="datasets" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Datasets</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Consultar Base de Dados</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="mt-8 space-y-8">
          {user?.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload de Datasets</span>
                </CardTitle>
                <CardDescription>
                  Adicione novos conjuntos de dados ao sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="file">Arquivo</Label>
                    <Input id="file" type="file" accept=".csv,.xlsx,.xls,.json" onChange={handleFileUpload}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input id="description" placeholder="Descreva o conteúdo do dataset..."/>
                </div>
                <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Fazer Upload
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filtros</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Label htmlFor="category-filter">Categoria:</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Datasets Disponíveis ({filteredDatasets.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {filteredDatasets.map((dataset) => (
                <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{dataset.name}</h3>
                        <p className="text-gray-600 text-sm">{dataset.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {categories.find(cat => cat.value === dataset.category)?.label}
                          </span>
                          <span>{dataset.format}</span>
                          <span>{dataset.size}</span>
                          <span>Uploaded: {new Date(dataset.uploadDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => handleDownload(dataset)} className="flex items-center space-x-2">
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
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum dataset encontrado para esta categoria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="database" className="mt-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar with tables */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tabelas Tratadas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockDatabaseTables.map((table) => (
                    <div
                      key={table.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedTable === table.id 
                          ? 'bg-green-100 border-l-4 border-green-500 text-green-800' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setSelectedTable(table.id);
                        setSelectedColumns([]);
                        setColumnSearch('');
                      }}
                    >
                      <div className="text-sm font-medium">{table.displayName}</div>
                      <div className="text-xs text-gray-500 mt-1">{table.description}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main content area */}
            <div className="lg:col-span-3">
              {selectedTable ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Selecione as colunas que você deseja acessar:</CardTitle>
                    <div className="flex items-center space-x-2 mt-4">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Pesquisar colunas"
                        value={columnSearch}
                        onChange={(e) => setColumnSearch(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Select All Checkbox */}
                      <div className="flex items-center space-x-2 pb-2 border-b">
                        <Checkbox
                          id="select-all"
                          checked={selectedColumns.length === filteredColumns.length && filteredColumns.length > 0}
                          onCheckedChange={handleSelectAllColumns}
                        />
                        <Label htmlFor="select-all" className="text-sm font-medium">
                          Selecionar todas as colunas ({filteredColumns.length})
                        </Label>
                      </div>

                      {/* Columns Table */}
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Precisa de tradução</TableHead>
                            <TableHead>Descrição</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredColumns.map((column) => (
                            <TableRow key={column.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedColumns.includes(column.id)}
                                  onCheckedChange={(checked) => handleColumnToggle(column.id, checked as boolean)}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{column.name}</TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-600">Não</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-600">{column.description}</span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {filteredColumns.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          Nenhuma coluna encontrada para o termo pesquisado.
                        </div>
                      )}

                      {/* Options and Generate Button */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="translate-codes"
                            checked={translateCodes}
                            onCheckedChange={(checked) => setTranslateCodes(checked === true)}
                          />
                          <Label htmlFor="translate-codes" className="text-sm">
                            Traduzir códigos institucionais
                          </Label>
                        </div>
                        <Button 
                          onClick={handleGenerateQuery}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={selectedColumns.length === 0}
                        >
                          Gerar consulta
                        </Button>
                      </div>

                      {selectedColumns.length > 0 && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>{selectedColumns.length}</strong> colunas selecionadas de <strong>{selectedTableData?.displayName}</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecione uma tabela</h3>
                    <p className="text-gray-600">
                      Escolha uma tabela no painel lateral para começar a selecionar as colunas que deseja consultar.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataManagement;