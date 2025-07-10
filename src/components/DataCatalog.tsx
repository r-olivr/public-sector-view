import React, { useEffect } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CkanEmbedOptions } from '@/types/ckan';

declare global {
  interface Window {
    CKANembed: {
      datasets: (selector: string, ckanUrl: string, options: any) => void;
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

      // Simple configuration - let the embed script use its default template
      const options = {
        rows: 10,
        lang: 'pt'
      };

      // Use the correct CKANembed.datasets() method with minimal config
      window.CKANembed.datasets('#ckan-container-datasets', 'http://localhost:81/', options);
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