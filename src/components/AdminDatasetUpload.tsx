import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
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

interface AdminDatasetUploadProps {
  onDatasetAdded: (dataset: Dataset) => void;
  categories: { value: string; label: string }[];
}

export function AdminDatasetUpload({ onDatasetAdded, categories }: AdminDatasetUploadProps) {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<string>("");
  const [uploadDescription, setUploadDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast({ title: "Erro", description: "Selecione um arquivo para upload.", variant: "destructive" });
      return;
    }
    if (!uploadCategory) {
      toast({ title: "Erro", description: "Selecione uma categoria para o dataset.", variant: "destructive" });
      return;
    }
    if (!uploadDescription.trim()) {
      toast({ title: "Erro", description: "Adicione uma descrição para o dataset.", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setIsUploading(false);
        toast({ title: "Erro", description: "Falha ao realizar upload no servidor.", variant: "destructive" });
        return;
      }

      const data = await response.json();

      const newDataset: Dataset = {
        id: Date.now().toString(),
        name: data.originalname,
        category: uploadCategory,
        size: `${(data.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        format: data.originalname.split(".").pop()?.toUpperCase() || "Arquivo",
        description: uploadDescription,
        filename: data.filename,
      };

      onDatasetAdded(newDataset);

      toast({
        title: "Upload realizado!",
        description: `Arquivo ${uploadFile.name} enviado com sucesso.`,
      });

      // Reset form
      setUploadFile(null);
      setUploadCategory("");
      setUploadDescription("");
      const fileInput = document.getElementById("file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      toast({ title: "Erro", description: "Erro inesperado ao enviar arquivo.", variant: "destructive" });
    }

    setIsUploading(false);
  };

  return (
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
            <Input
              id="file"
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={uploadCategory} onValueChange={setUploadCategory} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.filter(cat => cat.value !== 'all').map((cat) => (
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
            disabled={isUploading}
          />
        </div>
        <Button
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Fazer Upload
        </Button>
      </CardContent>
    </Card>
  );
}