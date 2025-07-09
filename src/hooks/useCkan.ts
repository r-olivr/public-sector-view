import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface CkanDataset {
  id: string;
  name: string;
  title: string;
  notes: string;
  metadata_created: string;
  metadata_modified: string;
  author: string;
  organization?: {
    name: string;
    title: string;
  };
  resources: CkanResource[];
  tags: { name: string }[];
  groups: { name: string; title: string }[];
}

export interface CkanResource {
  id: string;
  name: string;
  description: string;
  format: string;
  url: string;
  size?: number;
  created: string;
  last_modified: string;
}

export interface CkanSearchParams {
  q?: string;
  fq?: string;
  rows?: number;
  start?: number;
  sort?: string;
}

export function useCkan(ckanUrl?: string) {
  const [datasets, setDatasets] = useState<CkanDataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  // Default CKAN instance - replace with your actual CKAN URL
  const baseUrl = ckanUrl || 'https://demo.ckan.org';

  const searchDatasets = async (params: CkanSearchParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      if (params.q) searchParams.append('q', params.q);
      if (params.fq) searchParams.append('fq', params.fq);
      searchParams.append('rows', (params.rows || 10).toString());
      searchParams.append('start', (params.start || 0).toString());
      if (params.sort) searchParams.append('sort', params.sort);

      const response = await fetch(`${baseUrl}/api/3/action/package_search?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`CKAN API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'CKAN API returned an error');
      }

      setDatasets(data.result.results);
      setTotalCount(data.result.count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch datasets';
      setError(errorMessage);
      toast({
        title: "Erro ao buscar dados",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDataset = async (id: string): Promise<CkanDataset | null> => {
    try {
      const response = await fetch(`${baseUrl}/api/3/action/package_show?id=${id}`);
      
      if (!response.ok) {
        throw new Error(`CKAN API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'CKAN API returned an error');
      }

      return data.result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dataset';
      toast({
        title: "Erro ao buscar dataset",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
  };

  const downloadResource = (resource: CkanResource) => {
    const link = document.createElement('a');
    link.href = resource.url;
    link.download = resource.name || `resource_${resource.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download iniciado",
      description: `Baixando ${resource.name}...`
    });
  };

  useEffect(() => {
    // Load initial datasets
    searchDatasets();
  }, []);

  return {
    datasets,
    loading,
    error,
    totalCount,
    searchDatasets,
    getDataset,
    downloadResource
  };
}