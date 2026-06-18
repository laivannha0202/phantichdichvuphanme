import { useContext } from 'react';
import { AuthContext, type AuthContextType } from './auth-context-definition';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
}
