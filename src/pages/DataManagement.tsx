import React from "react";
import { DataCatalog } from "../components/DataCatalog";

/**
 * Página principal para visualização do catálogo de dados do CKAN.
 * Esta página renderiza diretamente o componente DataCatalog, que
 * embute a interface de busca e visualização do portal CKAN.
 */
export default function DataManagement() {
  return (
    <div className="container mx-auto mt-8">
      {/* O componente DataCatalog agora é o elemento principal da página */}
      <DataCatalog />
    </div>
  );
}