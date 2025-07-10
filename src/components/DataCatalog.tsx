import React, { useEffect } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CkanEmbedOptions } from '@/types/ckan';

declare global {
  interface Window {
    CKANembed: {
      search: (selector: string, ckanUrl: string, options: CkanEmbedOptions) => void;
    };
  }
}

export function DataCatalog() {
  const initializeCKANEmbed = () => {
    if (window.CKANembed) {
      const container = document.getElementById('ckan-container-datasets');
      if (container) {
        container.innerHTML = '<p style="text-align: center; padding: 20px; color: #64748b;">Carregando conjuntos de dados...</p>';
      }

      // Simplified configuration for CKAN embed
      const options: CkanEmbedOptions = {
        rows: 10,
        sort: 'metadata_modified desc',
        noresult: '<div style="text-align: center; padding: 40px;"><p>Nenhum conjunto de dados foi encontrado.</p></div>',
        template: `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 16px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; line-height: 1.4;">
              <a href="http://localhost:81/dataset/<%= ds.name %>" target="_blank" style="color: #2563eb; text-decoration: none;">
                <%= ds.title || ds.name %>
              </a>
            </h3>
            
            <% if (ds.notes) { %>
              <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px; line-height: 1.5;">
                <%= ds.notes %>
              </p>
            <% } %>

            <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 12px;">
              
              <% if (ds.resources && ds.resources.length > 0) { %>
                <span style="background: #f8fafc; padding: 4px 8px; border-radius: 4px;"><strong>Recursos:</strong> <%= ds.resources.length %></span>
              <% } %>

              <% if (ds.organization && ds.organization.title) { %>
                <span style="background: #f8fafc; padding: 4px 8px; border-radius: 4px;"><strong>Organização:</strong> <%= ds.organization.title %></span>
              <% } %>
              
              <% if (ds.metadata_modified) { %>
                <span style="background: #f8fafc; padding: 4px 8px; border-radius: 4px;"><strong>Atualizado:</strong> <%= ds.metadata_modified.split('T')[0] %></span>
              <% } %>

            </div>
          </div>
        `
      };

      // Initialize CKAN embed
      window.CKANembed.search('#ckan-container-datasets', 'http://localhost:81', options);
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

  return (
    <div className="space-y-6">
      {/* CKAN Embed Container */}
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <div 
            id="ckan-container-datasets" 
            className="min-h-[600px] bg-white rounded-lg"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Inicializando portal CKAN...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}