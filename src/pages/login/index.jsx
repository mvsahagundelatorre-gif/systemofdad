import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CompanyLogo from './components/CompanyLogo';
import LoginForm from './components/LoginForm';
import SystemStatus from './components/SystemStatus';
import SecurityNotice from './components/SecurityNotice';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, userProfile } = useAuth();

  useEffect(() => {
    // Redirect if already logged in
    if (user && userProfile) {
      const redirectTo = location?.state?.from?.pathname || 
        (userProfile?.role === 'admin' ? '/executive-dashboard' : '/employee-dashboard');
      navigate(redirectTo, { replace: true });
    }
  }, [user, userProfile, navigate, location]);

  const handleLogin = async (formData) => {
    setLoading(true);
    setError('');

    try {
      // Use email for login instead of username
      const { data, error: authError } = await signIn(formData?.username, formData?.password);

      if (authError) {
        // Handle different error types
        if (authError?.message?.includes('Invalid login credentials')) {
          const newAttemptCount = attemptCount + 1;
          setAttemptCount(newAttemptCount);

          if (newAttemptCount >= 3) {
            setError('Cuenta bloqueada temporalmente. Demasiados intentos fallidos. Contacte al administrador del sistema.');
          } else {
            setError(`Credenciales inválidas. Intento ${newAttemptCount} de 3. Verifique su email y contraseña.`);
          }
        } else if (authError?.message?.includes('Email not confirmed')) {
          setError('Por favor confirme su email antes de iniciar sesión.');
        } else {
          setError(authError?.message || 'Error de autenticación.');
        }
        return;
      }

      // Reset attempt count on successful login
      setAttemptCount(0);

      // Navigation will be handled by useEffect when userProfile is loaded
    } catch (error) {
      console.error('Login error:', error);
      setError('Error de conexión. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Company Logo */}
        <CompanyLogo className="mb-8" />

        {/* Login Form Container */}
        <div className="bg-card rounded-xl shadow-xl border border-border p-8">
          <div className="space-y-6">
            {/* Welcome Message */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Bienvenido
              </h2>
              <p className="text-sm text-muted-foreground">
                Ingrese sus credenciales para acceder al sistema
              </p>
            </div>

            {/* Account Lockout Warning */}
            {attemptCount >= 2 && attemptCount < 3 && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-warning rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">!</span>
                  </div>
                  <span className="text-sm text-warning">
                    Advertencia: Un intento más bloqueará su cuenta
                  </span>
                </div>
              </div>
            )}

            {/* Login Form */}
            <LoginForm 
              onLogin={handleLogin}
              loading={loading}
              error={error}
            />

            {/* Administrator Info */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Información del Sistema:
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Administrador:</span>
                  <span className="font-mono">admin@sistema.com</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Solo los administradores pueden crear nuevos usuarios. 
                  Contacte al administrador para obtener acceso al sistema.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <SystemStatus />

        {/* Security Notice */}
        <SecurityNotice />

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>© {new Date()?.getFullYear()} Portal Empresarial. Todos los derechos reservados.</p>
          <p className="mt-1">
            Versión 3.0.0 | Sistema Administrativo Integrado con Supabase
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;