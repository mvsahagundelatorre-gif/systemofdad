import React from 'react';
import Icon from '../../../components/AppIcon';

const AuditTrail = ({ report, user }) => {
  // Solo mostrar para ejecutivos
  if (user?.role !== 'executive') {
    return null;
  }

  const auditEvents = [
    {
      id: 1,
      action: 'Reporte creado',
      user: report?.coordinador,
      timestamp: report?.fechaCreacion,
      details: `Reporte ${report?.numeroAsignacion} creado para cliente ${report?.nombreCliente}`,
      icon: 'Plus',
      color: 'text-success'
    },
    {
      id: 2,
      action: 'Estado actualizado',
      user: report?.coordinador,
      timestamp: report?.fechaActualizacion,
      details: `Estado cambiado a "${report?.estado}"`,
      icon: 'Edit',
      color: 'text-primary'
    },
    {
      id: 3,
      action: 'Revisión ejecutiva',
      user: user?.name,
      timestamp: new Date()?.toISOString(),
      details: 'Reporte revisado por ejecutivo',
      icon: 'Eye',
      color: 'text-accent'
    }
  ];

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    const date = new Date(timestamp);
    return date?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="History" size={20} className="mr-2" />
        Historial de Auditoría
      </h3>
      <div className="space-y-4">
        {auditEvents?.map((event, index) => (
          <div key={event?.id} className="flex items-start space-x-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
            <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${event?.color}`}>
              <Icon name={event?.icon} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-foreground">
                  {event?.action}
                </h4>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatTimestamp(event?.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-1">
                Por: {event?.user}
              </p>
              
              <p className="text-xs text-muted-foreground">
                {event?.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditTrail;