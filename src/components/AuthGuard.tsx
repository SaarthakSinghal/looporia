
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  authRequired?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, authRequired = true }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (authRequired && !user) {
      // Redirect to login if authentication is required but user is not logged in
      navigate('/auth', { state: { from: location.pathname } });
    } else if (!authRequired && user) {
      // Redirect to home if user is already logged in
      navigate('/');
    }
  }, [authRequired, user, loading, navigate, location.pathname]);

  // Show nothing while loading or redirecting
  if (loading || (authRequired && !user) || (!authRequired && user)) {
    return <div className="min-h-screen flex items-center justify-center bg-retro-paper">
      <div className="animate-pulse font-retro text-2xl text-retro-brown-3">Loading...</div>
    </div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
