import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export const useAuth = () => {
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  return { user, token, isAuthenticated };
};

export const hasRole = (allowedRoles: string[], userRole?: string) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};
