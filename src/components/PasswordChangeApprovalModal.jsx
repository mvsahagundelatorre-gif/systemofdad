import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Icon from './AppIcon';
import Button from './ui/Button';


const PasswordChangeApprovalModal = ({ isOpen, onClose, request, onApprovalComplete }) => {
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const { approvePasswordChange, userProfile } = useAuth();

  useEffect(() => {
    if (request?.user_id) {
      fetchUserDetails();
    }
  }, [request]);

  const fetchUserDetails = async () => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('full_name, email, department, role')?.eq('id', request?.user_id)?.single();

      if (error) throw error;
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleApproval = async (approved) => {
    setLoading(true);

    try {
      const { data, error } = await approvePasswordChange(
        request?.id,
        approved,
        adminNotes
      );

      if (error) {
        console.error('Error processing approval:', error);
        return;
      }

      // Create audit log
      await supabase?.from('audit_logs')?.insert({
        user_id: userProfile?.id,
        action: approved ? 'password_change_approved' : 'password_change_rejected',
        entity_type: 'password_change_request',
        entity_id: request?.id,
        old_values: { status: request?.request_status },
        new_values: { 
          status: approved ? 'approved' : 'rejected',
          admin_notes: adminNotes 
        }
      });

      // Send notification to user
      await supabase?.from('admin_notifications')?.insert({
        recipient_id: request?.user_id,
        notification_type: 'password_change_response',
        title: approved ? 'Cambio de Contraseña Aprobado' : 'Cambio de Contraseña Rechazado',
        message: approved 
          ? `Su solicitud de cambio de contraseña ha sido aprobada. ${adminNotes ? 'Notas del administrador: ' + adminNotes : ''}`
          : `Su solicitud de cambio de contraseña ha sido rechazada. ${adminNotes ? 'Razón: ' + adminNotes : ''}`,
        related_entity_type: 'password_change_request',
        related_entity_id: request?.id
      });

      onApprovalComplete?.(approved);
      handleClose();

    } catch (error) {
      console.error('Error in approval process:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAdminNotes('');
    onClose?.();
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Revisar Solicitud de Cambio de Contraseña
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
        <div className="p-6 space-y-4">
          {/* User Information */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <h4 className="font-medium text-foreground mb-3">Información del Usuario</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nombre:</span>
                <p className="font-medium">{userDetails?.full_name || 'Cargando...'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{userDetails?.email || 'Cargando...'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Departamento:</span>
                <p className="font-medium">{userDetails?.department || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Rol:</span>
                <p className="font-medium capitalize">{userDetails?.role || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <h4 className="font-medium text-foreground mb-3">Detalles de la Solicitud</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Fecha de Solicitud:</span>
                <p className="font-medium">
                  {new Date(request?.requested_at)?.toLocaleString('es-ES')}
                </p>
              </div>
              {request?.reason && (
                <div>
                  <span className="text-muted-foreground">Razón:</span>
                  <p className="font-medium">{request?.reason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notas del Administrador (Opcional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e?.target?.value)}
              placeholder="Agregue comentarios sobre esta decisión..."
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="4"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Estas notas serán visibles para el usuario solicitante.
            </p>
          </div>

          {/* Warning */}
          <div className="bg-warning/10 border border-warning/20 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="text-xs text-warning">
                <p>Esta acción no se puede deshacer.</p>
                <p className="mt-1">
                  Si aprueba la solicitud, el usuario podrá cambiar su contraseña inmediatamente.
                </p>
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
              type="button"
              variant="destructive"
              onClick={() => handleApproval(false)}
              loading={loading}
              disabled={loading}
              iconName="X"
              className="flex-1"
            >
              Rechazar
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() => handleApproval(true)}
              loading={loading}
              disabled={loading}
              iconName="Check"
              className="flex-1"
            >
              Aprobar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeApprovalModal;