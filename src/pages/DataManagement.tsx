import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, FileText, Filter } from 'lucide-react';

interface Dataset {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadDate: string;
  format: string;
  description: string;
}

const DataManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

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

  const filteredDatasets = selectedCategory === 'all' 
    ? mockDatasets 
    : mockDatasets.filter(dataset => dataset.category === selectedCategory);

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Dados</h1>
        <p className="text-gray-600 mt-2">
          Faça upload, organize e baixe datasets para análise e tomada de decisão
        </p>
      </div>

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
    </div>
  );
};

export default DataManagement;