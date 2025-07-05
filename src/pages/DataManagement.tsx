import { useState, useEffect } from 'react';
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
import { Upload, Download, FileText, Filter, Database, Search, Loader2 } from 'lucide-react';

// --- Interfaces (Tipos de Dados) ---
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

  // --- Estados para a Aba de Datasets (Upload de Arquivos) ---
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<string>('');
  const [uploadDescription, setUploadDescription] = useState<string>('');
  const [datasets, setDatasets] = useState<Dataset[]>([
    { id: '1', name: 'Indicadores de Saúde 2024', category: 'saude', size: '2.3 MB', uploadDate: '2024-01-15', format: 'CSV', description: 'Dados consolidados de atendimentos em saúde.' },
    { id: '2', name: 'Matrículas Escolares 2023-2024', category: 'educacao', size: '1.8 MB', uploadDate: '2024-01-10', format: 'XLSX', description: 'Dados de matrículas por escola e modalidade.' },
  ]);

  // --- Estados para a Aba de Consulta ao Banco de Dados ---
  const [dbTables, setDbTables] = useState<DatabaseTable[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(true);
  const [dbColumns, setDbColumns] = useState<DatabaseColumn[]>([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [columnSearch, setColumnSearch] = useState<string>('');
  const [isQuerying, setIsQuerying] = useState(false);

  // --- Dados Estáticos e Lógica para a Aba de Datasets ---
  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'saude', label: 'Saúde' },
    { value: 'educacao', label: 'Educação' },
    { value: 'seguranca', label: 'Segurança Pública' },
  ];

  const filteredDatasets = selectedCategory === 'all'
    ? datasets
    : datasets.filter(dataset => dataset.category === selectedCategory);

  // --- Handlers de Upload ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setUploadFile(file);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo para upload.",
        variant: "destructive",
      });
      return;
    }
    if (!uploadCategory) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria para o dataset.",
        variant: "destructive",
      });
      return;
    }
    if (!uploadDescription.trim()) {
      toast({
        title: "Erro",
        description: "Adicione uma descrição para o dataset.",
        variant: "destructive",
      });
      return;
    }

    // Aqui você pode integrar com sua API de upload!
    // Por ora só mocka e adiciona à lista local:
    const newDataset: Dataset = {
      id: (datasets.length + 1).toString(),
      name: uploadFile.name,
      category: uploadCategory,
      size: `${(uploadFile.size / 1024 / 1024).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      format: uploadFile.name.split('.').pop()?.toUpperCase() || 'Arquivo',
      description: uploadDescription,
    };
    setDatasets(prev => [newDataset, ...prev]);

    toast({
      title: "Upload realizado!",
      description: `Arquivo ${uploadFile.name} enviado com sucesso em ${categories.find(cat => cat.value === uploadCategory)?.label}.`,
    });

    // Reset form
    setUploadFile(null);
    setUploadCategory('');
    setUploadDescription('');
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleDownload = (dataset: Dataset) => {
    // Aqui você pode integrar o download real do arquivo
    toast({
      title: "Download iniciado",
      description: `Baixando ${dataset.name}...`,
    });
  };

  // --- Lógica para a Aba de Consulta ao Banco de Dados ---
  useEffect(() => {
    const fetchTables = async () => {
      setIsLoadingTables(true);
      try {
        const response = await fetch('/api/tables');
        if (!response.ok) throw new Error('Falha na resposta da rede');
        const data = await response.json();
        setDbTables(data);
      } catch (error) {
        toast({ title: "Erro de Conexão", description: "Não foi possível carregar as tabelas do backend.", variant: "destructive" });
        setDbTables([]);
      } finally {
        setIsLoadingTables(false);
      }
    };
    fetchTables();
  }, [toast]);

  useEffect(() => {
    if (!selectedTable) {
      setDbColumns([]);
      return;
    }
    const fetchColumns = async () => {
      setIsLoadingColumns(true);
      setSelectedColumns([]);
      try {
        const response = await fetch(`/api/tables/${selectedTable}/columns`);
        if (!response.ok) throw new Error('Falha na resposta da rede');
        const data = await response.json();
        setDbColumns(data);
      } catch (error) {
        toast({ title: "Erro de Conexão", description: "Não foi possível carregar as colunas da tabela.", variant: "destructive" });
        setDbColumns([]);
      } finally {
        setIsLoadingColumns(false);
      }
    };
    fetchColumns();
  }, [selectedTable, toast]);

  const handleGenerateQueryAndDownload = async () => {
    if (!selectedTable || selectedColumns.length === 0) {
      toast({ title: "Atenção", description: "Selecione uma tabela e pelo menos uma coluna.", variant: "destructive" });
      return;
    }
    setIsQuerying(true);
    try {
      const tableInfo = dbTables.find(t => t.name === selectedTable);
      const columnsInfo = dbColumns.filter(c => selectedColumns.includes(c.id));
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName: tableInfo?.name,
          columns: columnsInfo.map(c => c.name)
        })
      });
      if (!response.ok) throw new Error(`Erro na consulta: ${response.statusText}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]);
        const csvContent = [
          headers.join(','),
          ...data.map((row: any) => headers.map(header => JSON.stringify(row[header])).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${tableInfo?.name}_consulta.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "Download Concluído", description: "Sua consulta foi baixada como um arquivo CSV." });
      } else {
        toast({ title: "Sem resultados", description: "A consulta não retornou dados." });
      }
    } catch (error) {
      toast({ title: "Erro na Consulta", description: "Não foi possível gerar a consulta. Verifique o console do backend.", variant: "destructive" });
    } finally {
      setIsQuerying(false);
    }
  };

  const filteredColumns = dbColumns.filter(column =>
    column.displayName.toLowerCase().includes(columnSearch.toLowerCase()) ||
    column.name.toLowerCase().includes(columnSearch.toLowerCase())
  );

  const handleColumnToggle = (columnId: string, checked: boolean) => {
    setSelectedColumns(prev =>
      checked
        ? [...prev, columnId]
        : prev.filter(id => id !== columnId)
    );
  };

  const handleSelectAllColumns = (checked: boolean) => {
    setSelectedColumns(checked ? filteredColumns.map(c => c.id) : []);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Dados</h1>
        <p className="text-gray-600 mt-2">
          Faça upload de datasets ou consulte o banco de dados diretamente.
        </p>
      </div>

      <Tabs defaultValue="datasets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="datasets">Datasets (Arquivos)</TabsTrigger>
          <TabsTrigger value="database">Consultar Banco de Dados</TabsTrigger>
        </TabsList>

        {/* --- ABA DATASETS (UPLOAD & LISTA) --- */}
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
                    <Input id="file" type="file" accept=".csv,.xlsx,.xls,.json" onChange={handleFileUpload} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={uploadCategory} onValueChange={setUploadCategory}>
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
                  <Input
                    id="description"
                    placeholder="Descreva o conteúdo do dataset..."
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                  />
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

        {/* --- ABA BANCO DE DADOS (API) --- */}
        <TabsContent value="database" className="mt-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tabelas Disponíveis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {isLoadingTables ? (
                    <div className="flex items-center justify-center p-4 text-sm text-gray-500">
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Carregando...
                    </div>
                  ) : (
                    dbTables.map((table) => (
                      <div
                        key={table.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedTable === table.name
                            ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-800'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedTable(table.name)}
                      >
                        <div className="text-sm font-medium">{table.displayName}</div>
                        <div className="text-xs text-gray-500 mt-1">{table.description}</div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="min-h-[30rem]">
                {!selectedTable ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Database className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">Selecione uma tabela</h3>
                    <p className="text-gray-500 text-sm">
                      Escolha uma tabela na lista à esquerda para começar a montar sua consulta.
                    </p>
                  </div>
                ) : isLoadingColumns ? (
                  <div className="flex flex-col items-center justify-center h-full">
                     <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                     <p className="mt-2 text-sm text-gray-500">Carregando colunas...</p>
                  </div>
                ) : (
                  <>
                    <CardHeader>
                      <CardTitle>Selecione as colunas para consulta:</CardTitle>
                      <div className="flex items-center space-x-2 mt-4">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Pesquisar colunas..."
                          value={columnSearch}
                          onChange={(e) => setColumnSearch(e.target.value)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col h-[calc(100%-8rem)]">
                      <div className="flex items-center space-x-2 p-2 border-b">
                        <Checkbox
                          id="select-all"
                          checked={filteredColumns.length > 0 && selectedColumns.length === filteredColumns.length}
                          onCheckedChange={(checked) => handleSelectAllColumns(checked as boolean)}
                          disabled={filteredColumns.length === 0}
                        />
                        <Label htmlFor="select-all" className="text-sm font-medium">
                          Selecionar Todas ({filteredColumns.length})
                        </Label>
                      </div>

                      <div className="flex-grow overflow-y-auto">
                        <Table>
                          <TableBody>
                            {filteredColumns.map((column) => (
                              <TableRow key={column.id}>
                                <TableCell className="w-12">
                                  <Checkbox
                                    checked={selectedColumns.includes(column.id)}
                                    onCheckedChange={(checked) => handleColumnToggle(column.id, checked as boolean)}
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{column.displayName}</TableCell>
                                <TableCell className="text-sm text-gray-500">{column.description}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="flex items-center justify-end pt-4 border-t mt-auto">
                        <Button
                          onClick={handleGenerateQueryAndDownload}
                          disabled={isQuerying || selectedColumns.length === 0}
                        >
                          {isQuerying ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          {isQuerying ? 'Consultando...' : `Gerar e Baixar (${selectedColumns.length})`}
                        </Button>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataManagement;