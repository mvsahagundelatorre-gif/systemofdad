import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ report, user, onEdit, onDownloadPDF, onEmailSupervisor, onBack }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await onDownloadPDF();
      // Simular descarga
      setTimeout(() => {
        setIsDownloading(false);
      }, 2000);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      setIsDownloading(false);
    }
  };

  const handleEmailSupervisor = async () => {
    setIsSending(true);
    try {
      await onEmailSupervisor();
      // Simular envío
      setTimeout(() => {
        setIsSending(false);
      }, 2000);
    } catch (error) {
      console.error('Error al enviar email:', error);
      setIsSending(false);
    }
  };

  const canEdit = user?.role === 'executive' || report?.coordinador === user?.name;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="Settings" size={20} className="mr-2" />
        Acciones del Reporte
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Button
          variant="default"
          onClick={handleDownloadPDF}
          loading={isDownloading}
          iconName="Download"
          iconPosition="left"
          fullWidth
        >
          {isDownloading ? 'Generando...' : 'Descargar PDF'}
        </Button>

        <Button
          variant="outline"
          onClick={handleEmailSupervisor}
          loading={isSending}
          iconName="Mail"
          iconPosition="left"
          fullWidth
        >
          {isSending ? 'Enviando...' : 'Enviar Email'}
        </Button>

        {canEdit && (
          <Button
            variant="secondary"
            onClick={onEdit}
            iconName="Edit"
            iconPosition="left"
            fullWidth
          >
            Editar Reporte
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={onBack}
          iconName="ArrowLeft"
          iconPosition="left"
          fullWidth
        >
          Volver al Dashboard
        </Button>
      </div>

      {/* Información adicional para ejecutivos */}
      {user?.role === 'executive' && (
        <div className="mt-6 p-4 bg-muted/30 rounded-md">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
            <Icon name="Shield" size={16} className="mr-2" />
            Permisos de Ejecutivo
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Acceso completo de lectura a todos los reportes</li>
            <li>• Capacidad de editar reportes de cualquier empleado</li>
            <li>• Historial de auditoría y metadatos extendidos</li>
            <li>• Generación de reportes consolidados</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionButtons;