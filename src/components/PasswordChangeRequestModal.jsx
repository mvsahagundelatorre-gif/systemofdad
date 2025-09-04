import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Icon from './AppIcon';
import Button from './ui/Button';
import Input from './ui/Input';

const PasswordChangeRequestModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { requestPasswordChange } = useAuth();

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

    if (!formData?.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }

    if (!formData?.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (formData?.newPassword?.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(formData?.newPassword)) {
      newErrors.newPassword = 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Confirme la nueva contraseña';
    } else if (formData?.newPassword !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (formData?.currentPassword === formData?.newPassword) {
      newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data, error } = await requestPasswordChange(
        formData?.currentPassword,
        formData?.newPassword,
        formData?.reason
      );

      if (error) {
        setErrors({ submit: error?.message || 'Error al enviar la solicitud' });
        return;
      }

      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        reason: ''
      });

      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (error) {
      setErrors({ submit: 'Error inesperado al enviar la solicitud' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      reason: ''
    });
    setErrors({});
    setSuccess(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Solicitar Cambio de Contraseña
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
                <Icon name="Check" size={24} className="text-success" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-foreground">
                  ¡Solicitud Enviada!
                </h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Su solicitud de cambio de contraseña ha sido enviada a los administradores. 
                  Recibirá una notificación cuando sea revisada.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password */}
              <Input
                label="Contraseña Actual"
                type="password"
                name="currentPassword"
                value={formData?.currentPassword}
                onChange={handleInputChange}
                placeholder="Ingrese su contraseña actual"
                error={errors?.currentPassword}
                required
                disabled={loading}
              />

              {/* New Password */}
              <Input
                label="Nueva Contraseña"
                type="password"
                name="newPassword"
                value={formData?.newPassword}
                onChange={handleInputChange}
                placeholder="Ingrese su nueva contraseña"
                error={errors?.newPassword}
                required
                disabled={loading}
              />

              {/* Confirm Password */}
              <Input
                label="Confirmar Nueva Contraseña"
                type="password"
                name="confirmPassword"
                value={formData?.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirme su nueva contraseña"
                error={errors?.confirmPassword}
                required
                disabled={loading}
              />

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Razón del Cambio (Opcional)
                </label>
                <textarea
                  name="reason"
                  value={formData?.reason}
                  onChange={handleInputChange}
                  placeholder="Explique brevemente por qué necesita cambiar su contraseña"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows="3"
                  disabled={loading}
                />
              </div>

              {/* Submit Error */}
              {errors?.submit && (
                <div className="flex items-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-md">
                  <Icon name="AlertCircle" size={16} className="text-error" />
                  <span className="text-sm text-error">{errors?.submit}</span>
                </div>
              )}

              {/* Info */}
              <div className="bg-info/10 border border-info/20 rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-info mt-0.5" />
                  <div className="text-xs text-info">
                    <p>Su solicitud será enviada a los administradores para su aprobación.</p>
                    <p className="mt-1">Recibirá una notificación por email cuando sea procesada.</p>
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
                  Enviar Solicitud
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeRequestModal;