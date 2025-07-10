/**
 * Define a estrutura para as opções de configuração
 * utilizadas pelo script de embed do CKAN.
 */
export interface CkanEmbedOptions {
  fq?: string;
  rows?: number;
  sort?: string;
  lang?: string;
  jsonp?: string;
  noresult?: string;
  template?: string;
  // Outras opções podem ser adicionadas aqui conforme a documentação do ckan-embed.js
}