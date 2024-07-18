import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const session = supabase.auth.getSession();

  if (!session) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;