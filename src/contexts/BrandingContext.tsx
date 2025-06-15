import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandConfig, BrandingContextType } from '@/types/branding';

const defaultBrandConfig: BrandConfig = {
  tenant_id: 'default',
  name: 'Gestão com Dados',
  primary_color: '#2563eb',
  secondary_color: '#64748b',
  accent_color: '#059669',
  welcome_message: 'Sistema de Gestão Baseada em Evidências',
  footer_text: 'Desenvolvido por Gestão com Dados',
  tagline: 'Plataforma de gestão pública baseada em evidências',
  background_image: '/placeholder.svg',
  blur_color: '#000000',
  blur_opacity: 0.4
};

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(defaultBrandConfig);
  const [isLoading, setIsLoading] = useState(false);

  const detectTenantId = (): string => {
    // Try to detect tenant from subdomain
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    
    // If it's a subdomain (not localhost or IP), use it as tenant_id
    if (subdomain && subdomain !== 'localhost' && !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      return subdomain;
    }
    
    // Fallback: check localStorage or user profile
    const storedTenant = localStorage.getItem('tenant_id');
    return storedTenant || 'default';
  };

  const loadBrandConfig = async (tenantId: string) => {
    setIsLoading(true);
    try {
      // Try to load from configs folder or API
      const response = await fetch(`/configs/tenants/${tenantId}.json`);
      if (response.ok) {
        const config = await response.json();
        setBrandConfig({ ...defaultBrandConfig, ...config });
        applyCSSVariables(config);
      } else {
        // Fallback to default config
        setBrandConfig(defaultBrandConfig);
        applyCSSVariables(defaultBrandConfig);
      }
    } catch (error) {
      console.log('Using default brand config:', error);
      setBrandConfig(defaultBrandConfig);
      applyCSSVariables(defaultBrandConfig);
    } finally {
      setIsLoading(false);
    }
  };

  const applyCSSVariables = (config: BrandConfig) => {
    const root = document.documentElement;
    
    // Convert hex to HSL for CSS variables
    const hexToHsl = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return '0 0% 0%';
      
      const r = parseInt(result[1], 16) / 255;
      const g = parseInt(result[2], 16) / 255;
      const b = parseInt(result[3], 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    root.style.setProperty('--primary', hexToHsl(config.primary_color));
    root.style.setProperty('--secondary', hexToHsl(config.secondary_color));
    if (config.accent_color) {
      root.style.setProperty('--accent', hexToHsl(config.accent_color));
    }

    // Update favicon if provided
    if (config.favicon) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = config.favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    // Update page title
    document.title = config.name;
  };

  const updateBrandConfig = (config: Partial<BrandConfig>) => {
    const newConfig = { ...brandConfig, ...config };
    setBrandConfig(newConfig);
    applyCSSVariables(newConfig);
  };

  useEffect(() => {
    const tenantId = detectTenantId();
    loadBrandConfig(tenantId);
  }, []);

  return (
    <BrandingContext.Provider value={{ brandConfig, loadBrandConfig, updateBrandConfig, isLoading }}>
      {children}
    </BrandingContext.Provider>
  );
};
