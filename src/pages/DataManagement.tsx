import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Database, Loader2, Search, Info, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { DataCatalog } from "../components/DataCatalog";
import { AdminDatasetUpload } from "../components/AdminDatasetUpload";
import { LocalDatasetManager } from "../components/LocalDatasetManager";

// Utilitário para truncar texto
function truncateText(text: string, maxLength: number) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
}

type Dataset = {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadDate: string;
  format: string;
  description: string;
  filename?: string;
};

type DatabaseTable = {
  id: string;
  name: string;
  displayName: string;
  description: string;
};

type DatabaseColumn = {
  id: string;
  name: string;
  displayName: string;
  type: string;
  description: string;
  needTranslation?: boolean;
};

export default function DataManagement() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Local datasets state
  const [datasets, setDatasets] = useState<Dataset[]>([
    { id: "1", name: "Indicadores de Saúde 2024", category: "saude", size: "2.3 MB", uploadDate: "2024-01-15", format: "CSV", description: "Dados consolidados de atendimentos em saúde." },
    { id: "2", name: "Matrículas Escolares 2023-2024", category: "educacao", size: "1.8 MB", uploadDate: "2024-01-10", format: "XLSX", description: "Dados de matrículas por escola e modalidade." },
  ]);

  // Database query state
  const [dbTables, setDbTables] = useState<DatabaseTable[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(true);
  const [dbColumns, setDbColumns] = useState<DatabaseColumn[]>([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [columnSearch, setColumnSearch] = useState<string>("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [translateCodes, setTranslateCodes] = useState(false);

  // Categorias disponíveis
  const categories = [
    { value: "all", label: "Todas as Categorias" },
    { value: "saude", label: "Saúde" },
    { value: "educacao", label: "Educação" },
    { value: "seguranca", label: "Segurança Pública" },
  ];

  const handleDatasetAdded = (newDataset: Dataset) => {
    setDatasets(prev => [newDataset, ...prev]);
  };

  useEffect(() => {
    const fetchTables = async () => {
      setIsLoadingTables(true);
      try {
        const response = await fetch("/api/tables");
        if (!response.ok) throw new Error("Falha na resposta da rede");
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
    setDbColumns([]);
    setSelectedColumns([]);
    if (!selectedTable) return;

    const fetchColumns = async () => {
      setIsLoadingColumns(true);
      try {
        const response = await fetch(`/api/tables/${selectedTable}/columns`);
        if (!response.ok) throw new Error("Falha na resposta da rede");
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
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableName: tableInfo?.name,
          columns: columnsInfo.map(c => c.name),
          translateCodes,
        }),
      });
      if (!response.ok) throw new Error(`Erro na consulta: ${response.statusText}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]);
        const csvContent = [
          headers.join(","),
          ...data.map((row: any) => headers.map(header => JSON.stringify(row[header])).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
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

  // Remove duplicadas em filteredColumns por id
  const filteredColumns = dbColumns.filter(column =>
    column.displayName.toLowerCase().includes(columnSearch.toLowerCase()) ||
    column.name.toLowerCase().includes(columnSearch.toLowerCase())
  );
  const uniqueFilteredColumns = filteredColumns.filter(
    (col, idx, arr) => arr.findIndex(c => c.id === col.id) === idx
  );

  return (
    <div className="container mx-auto mt-8">
      <Tabs defaultValue="catalog">
        <TabsList className="mb-8">
          <TabsTrigger value="catalog">Catálogo CKAN</TabsTrigger>
          <TabsTrigger value="local">Datasets Locais</TabsTrigger>
          {user?.role === "admin" && <TabsTrigger value="upload">Upload</TabsTrigger>}
          <TabsTrigger value="database">Consultar BD</TabsTrigger>
        </TabsList>

        {/* CKAN Data Catalog */}
        <TabsContent value="catalog" className="mt-8">
          <DataCatalog />
        </TabsContent>

        {/* Local Datasets */}
        <TabsContent value="local" className="mt-8">
          <LocalDatasetManager datasets={datasets} categories={categories} />
        </TabsContent>

        {/* Admin Upload */}
        {user?.role === "admin" && (
          <TabsContent value="upload" className="mt-8">
            <AdminDatasetUpload onDatasetAdded={handleDatasetAdded} categories={categories} />
          </TabsContent>
        )}

        {/* --- BANCO DE DADOS --- */}
        <TabsContent value="database" className="mt-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tabelas tratadas</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingTables ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                      <p className="mt-2 text-sm text-gray-500">Carregando tabelas...</p>
                    </div>
                  ) : (
                    <ul>
                      {dbTables.map(table => (
                        <li key={table.id}>
                          <Button
                            variant={selectedTable === table.name ? "default" : "outline"}
                            className={`w-full mb-2 text-left justify-start ${selectedTable === table.name ? 'bg-green-100 text-green-800 font-bold' : ''} truncate`}
                            onClick={() => setSelectedTable(table.name)}
                            title={table.displayName}
                          >
                            {truncateText(table.displayName, 28)}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-6">
                    <span className="font-semibold text-sm text-gray-500">Fontes originais</span>
                    <div className="text-gray-700 text-sm mt-1">Série Histórica Municípios</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
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
                    <CardTitle>Selecione as colunas que você deseja acessar:</CardTitle>
                    <div className="flex items-center space-x-2 mt-4 bg-gray-100 rounded-md px-4 py-2">
                      <Search className="h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Pesquisar colunas"
                        value={columnSearch}
                        onChange={e => setColumnSearch(e.target.value)}
                        className="w-72 border-0 bg-gray-100 focus:ring-0"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-auto rounded-lg border border-gray-200 bg-white" style={{ maxHeight: 330 }}>
                      <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th className="w-12 px-2 py-2 text-center"></th>
                            <th className="px-2 py-2 text-left font-semibold">
                              Nome
                              <Info className="inline h-3 w-3 ml-1 text-gray-400" />
                            </th>
                            <th className="px-2 py-2 text-left font-semibold">
                              Precisa de tradução
                              <Info className="inline h-3 w-3 ml-1 text-gray-400" />
                            </th>
                            <th className="px-2 py-2 text-left font-semibold">
                              Descrição
                              <Info className="inline h-3 w-3 ml-1 text-gray-400" />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {uniqueFilteredColumns.map(column => (
                            <tr key={column.id} className="hover:bg-gray-50">
                              <td className="px-2 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedColumns.includes(column.id)}
                                  onChange={() => {
                                    if (selectedColumns.includes(column.id)) {
                                      setSelectedColumns(selectedColumns.filter(id => id !== column.id));
                                    } else {
                                      setSelectedColumns([...selectedColumns, column.id]);
                                    }
                                  }}
                                />
                              </td>
                              <td className="px-2 py-2">{column.name}</td>
                              <td className="px-2 py-2">
                                {column.needTranslation ? "Sim" : "Não"}
                              </td>
                              <td className="px-2 py-2">
                                {column.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center mt-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="accent-green-700"
                          checked={translateCodes}
                          onChange={() => setTranslateCodes(t => !t)}
                        />
                        <span className="font-medium text-gray-700">Traduzir códigos institucionais</span>
                      </label>
                    </div>
                    <Button
                      disabled={isQuerying}
                      onClick={handleGenerateQueryAndDownload}
                      className="bg-green-700 hover:bg-green-800 mt-4 font-bold w-48"
                    >
                      {isQuerying ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Gerar consulta
                    </Button>
                  </CardContent>
                </>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}