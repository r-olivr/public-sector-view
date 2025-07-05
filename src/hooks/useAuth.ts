import React, { useContext } from "react";

// Exemplo de contexto de Auth (ajuste conforme seu app)
const AuthContext = React.createContext<{ user: { role: string } | null }>({ user: { role: "admin" } });

export function useAuth() {
  // Retorna um usuário admin como padrão para testes
  return { user: { role: "admin" } };
  // Se você já usa contexto, descomente a linha abaixo:
  // return useContext(AuthContext);
}