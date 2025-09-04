import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Icon from './AppIcon';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

const AdminUserCreationModal = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'employee',
    department: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { createUser, isAdmin } = useAuth();

  const roleOptions = [
    { value: 'employee', label: 'Empleado' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Administrador' }
  ];

  const departmentOptions = [
    { value: 'sistemas', label: 'Sistemas' },
    { value: 'recursos_humanos', label: 'Recursos Humanos' },
    { value: 'finanzas', label: 'Finanzas' },
    { value: 'operaciones', label: 'Operaciones' },
    { value: 'ventas', label: 'Ventas' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'calidad', label: 'Calidad' },
    { value: 'logistica', label: 'Logística' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Ingrese un email válido';
    }

    if (!formData?.full_name?.trim()) {
      newErrors.full_name = 'El nombre completo es requerido';
    }

    if (!formData?.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(formData?.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Confirme la contraseña';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData?.role) {
      newErrors.role = 'Seleccione un rol';
    }

    if (!formData?.department) {
      newErrors.department = 'Seleccione un departamento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!isAdmin()) {
      setErrors({ submit: 'Solo los administradores pueden crear usuarios' });
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data, error } = await createUser({
        email: formData?.email,
        password: formData?.password,
        full_name: formData?.full_name,
        role: formData?.role,
        department: formData?.department,
        phone: formData?.phone || null
      });

      if (error) {
        setErrors({ submit: error?.message || 'Error al crear el usuario' });
        return;
      }

      setSuccess(true);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        role: 'employee',
        department: '',
        phone: ''
      });

      // Notify parent component
      onUserCreated?.(data);

      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      setErrors({ submit: 'Error inesperado al crear el usuario' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
      role: 'employee',
      department: '',
      phone: ''
    });
    setErrors({});
    setSuccess(false);
    onClose?.();
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one of each required character type
    password += 'abcdefghijklmnopqrstuvwxyz'?.[Math.floor(Math.random() * 26)];
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'?.[Math.floor(Math.random() * 26)];
    password += '0123456789'?.[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'?.[Math.floor(Math.random() * 8)];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset?.[Math.floor(Math.random() * charset?.length)];
    }
    
    // Shuffle the password
    password = password?.split('')?.sort(() => Math.random() - 0.5)?.join('');
    
    setFormData(prev => ({
      ...prev,
      password,
      confirmPassword: password
    }));
  };

  if (!isOpen || !isAdmin()) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h3 className="text-lg font-semibold text-foreground">
            Crear Nuevo Usuario
          </h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            disabled={loading}
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <Icon name="UserPlus" size={24} className="text-success" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-foreground">
                  ¡Usuario Creado!
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  El usuario ha sido creado exitosamente y puede iniciar sesión ahora.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData?.email}
                onChange={handleInputChange}
                placeholder="usuario@empresa.com"
                error={errors?.email}
                required
                disabled={loading}
              />

              {/* Full Name */}
              <Input
                label="Nombre Completo"
                type="text"
                name="full_name"
                value={formData?.full_name}
                onChange={handleInputChange}
                placeholder="Juan Pérez García"
                error={errors?.full_name}
                required
                disabled={loading}
              />

              {/* Role */}
              <Select
                label="Rol"
                name="role"
                value={formData?.role}
                onChange={handleInputChange}
                options={roleOptions}
                error={errors?.role}
                required
                disabled={loading}
              />

              {/* Department */}
              <Select
                label="Departamento"
                name="department"
                value={formData?.department}
                onChange={handleInputChange}
                options={departmentOptions}
                error={errors?.department}
                required
                disabled={loading}
                placeholder="Seleccione un departamento"
              />

              {/* Phone */}
              <Input
                label="Teléfono (Opcional)"
                type="tel"
                name="phone"
                value={formData?.phone}
                onChange={handleInputChange}
                placeholder="+34 600 000 000"
                error={errors?.phone}
                disabled={loading}
              />

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-foreground">
                    Contraseña
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generatePassword}
                    disabled={loading}
                  >
                    <Icon name="RefreshCw" size={14} className="mr-1" />
                    Generar
                  </Button>
                </div>
                <Input
                  type="password"
                  name="password"
                  value={formData?.password}
                  onChange={handleInputChange}
                  placeholder="Ingrese una contraseña segura"
                  error={errors?.password}
                  required
                  disabled={loading}
                />
              </div>

              {/* Confirm Password */}
              <Input
                label="Confirmar Contraseña"
                type="password"
                name="confirmPassword"
                value={formData?.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirme la contraseña"
                error={errors?.confirmPassword}
                required
                disabled={loading}
              />

              {/* Submit Error */}
              {errors?.submit && (
                <div className="flex items-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-md">
                  <Icon name="AlertCircle" size={16} className="text-error" />
                  <span className="text-sm text-error">{errors?.submit}</span>
                </div>
              )}

              {/* Password Requirements */}
              <div className="bg-info/10 border border-info/20 rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-info mt-0.5" />
                  <div className="text-xs text-info">
                    <p>La contraseña debe contener:</p>
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                      <li>Al menos 8 caracteres</li>
                      <li>Una letra mayúscula</li>
                      <li>Una letra minúscula</li>
                      <li>Un número</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  loading={loading}
                  disabled={loading}
                  className="flex-1"
                >
                  Crear Usuario
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserCreationModal;