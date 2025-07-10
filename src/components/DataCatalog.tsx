import React, { useEffect, useState } from 'react';
import { Search, Settings, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

declare global {
  interface Window {
    CKANembed: {
      search: (selector: string, ckanUrl: string, options: any) => void;
    };
  }
}

export function DataCatalog() {
  const [ckanUrl, setCkanUrl] = useState('https://demo.ckan.org');
  const [organization, setOrganization] = useState('');
  const [rows, setRows] = useState('10');
  const [sortBy, setSortBy] = useState('title_string_pt asc');

  const initializeCKANEmbed = () => {
    if (window.CKANembed && ckanUrl) {
      // Clear previous content
      const container = document.getElementById('ckan-container-datasets');
      if (container) {
        container.innerHTML = '<p>Carregando conjuntos de dados...</p>';
      }

      const options: any = {
        rows: parseInt(rows),
        sort: sortBy,
        lang: 'pt',
        noresult: '<p>Nenhum conjunto de dados foi encontrado.</p>',
        template: `
          <article style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: white;">
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">
              <a href="<%= ds.url %>" target="_blank" style="color: #2563eb; text-decoration: none;">
                <%= ds.title %>
              </a>
            </h3>
            <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px; line-height: 1.5;">
              <%= ds.description %>
            </p>
            <div style="display: flex; align-items: center; gap: 16px; font-size: 12px; color: #64748b;">
              <span><strong>Formatos:</strong> <%= ds.formats.toUpperCase() %></span>
              <span><strong>Organização:</strong> <%= ds.organization %></span>
              <span><strong>Atualizado:</strong> <%= ds.metadata_modified %></span>
            </div>
          </article>
        `
      };

      if (organization) {
        options.fq = `organization:${organization}`;
      }

      window.CKANembed.search('#ckan-container-datasets', ckanUrl, options);
    }
  };

  useEffect(() => {
    // Wait for the CKAN embed script to load
    const checkCKANEmbed = setInterval(() => {
      if (window.CKANembed) {
        clearInterval(checkCKANEmbed);
        initializeCKANEmbed();
      }
    }, 100);

    return () => clearInterval(checkCKANEmbed);
  }, []);

  const handleRefresh = () => {
    initializeCKANEmbed();
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração do Portal CKAN
          </CardTitle>
          <CardDescription>
            Configure a URL do portal CKAN e filtros para exibir os datasets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ckan-url" className="block text-sm font-medium mb-2">
                URL do Portal CKAN
              </label>
              <Input
                id="ckan-url"
                value={ckanUrl}
                onChange={(e) => setCkanUrl(e.target.value)}
                placeholder="https://demo.ckan.org"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="organization" className="block text-sm font-medium mb-2">
                Organização (opcional)
              </label>
              <Input
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="nome-da-organizacao"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rows" className="block text-sm font-medium mb-2">
                Número de resultados
              </label>
              <Select value={rows} onValueChange={setRows}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 resultados</SelectItem>
                  <SelectItem value="10">10 resultados</SelectItem>
                  <SelectItem value="20">20 resultados</SelectItem>
                  <SelectItem value="50">50 resultados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="sort" className="block text-sm font-medium mb-2">
                Ordenação
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title_string_pt asc">Título A-Z</SelectItem>
                  <SelectItem value="title_string_pt desc">Título Z-A</SelectItem>
                  <SelectItem value="metadata_modified desc">Mais recentes</SelectItem>
                  <SelectItem value="metadata_modified asc">Mais antigos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleRefresh} className="w-full md:w-auto">
            <Database className="h-4 w-4 mr-2" />
            Carregar Datasets
          </Button>
        </CardContent>
      </Card>

      {/* CKAN Embed Container */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Catálogo de Dados CKAN
          </CardTitle>
          <CardDescription>
            Datasets carregados dinamicamente do portal CKAN configurado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div id="ckan-container-datasets" className="min-h-[200px]">
            <p className="text-center text-muted-foreground py-8">
              Configure o portal CKAN acima e clique em "Carregar Datasets" para ver os resultados
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}