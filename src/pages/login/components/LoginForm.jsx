import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LoginForm = ({ onLogin, loading, error }) => {
  const [formData, setFormData] = useState({
    username: '', // Will be used as email
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors?.[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData?.username?.trim()) {
      errors.username = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.username)) {
      errors.username = 'Ingrese un email válido';
    }
    
    if (!formData?.password?.trim()) {
      errors.password = 'La contraseña es obligatoria';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onLogin(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <Input
          label="Email"
          type="email"
          name="username"
          value={formData?.username}
          onChange={handleInputChange}
          placeholder="Ingrese su email"
          error={validationErrors?.username}
          required
          disabled={loading}
          className="w-full"
        />
      </div>
      {/* Password Field */}
      <div className="relative">
        <Input
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData?.password}
          onChange={handleInputChange}
          placeholder="Ingrese su contraseña"
          error={validationErrors?.password}
          required
          disabled={loading}
          className="w-full pr-12"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-9 p-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
          disabled={loading}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <Icon 
            name={showPassword ? "EyeOff" : "Eye"} 
            size={18} 
          />
        </button>
      </div>
      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-md">
          <Icon name="AlertCircle" size={16} color="var(--color-error)" />
          <span className="text-sm text-error">{error}</span>
        </div>
      )}
      {/* Login Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={loading}
        disabled={loading}
        iconName="LogIn"
        iconPosition="left"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
      {/* Password Recovery Link */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => navigate('/password-recovery')}
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          disabled={loading}
        >
          ¿Olvidó su contraseña?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;