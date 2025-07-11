
export interface BrandConfig {
  tenant_id: string;
  name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color?: string;
  favicon?: string;
  welcome_message?: string;
  footer_text?: string;
  tagline?: string;
  background_image?: string;
  blur_color?: string;
  blur_opacity?: number;
}

export interface BrandingContextType {
  brandConfig: BrandConfig;
  loadBrandConfig: (tenantId: string) => Promise<void>;
  updateBrandConfig: (config: Partial<BrandConfig>) => void;
  isLoading: boolean;
}
