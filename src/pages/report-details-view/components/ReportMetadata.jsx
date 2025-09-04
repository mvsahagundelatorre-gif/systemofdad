import React from 'react';
import Icon from '../../../components/AppIcon';

const ReportMetadata = ({ report, user }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const metadataItems = [
    {
      label: 'Fecha de Creación',
      value: formatDate(report?.fechaCreacion),
      icon: 'Calendar'
    },
    {
      label: 'Última Actualización',
      value: formatDate(report?.fechaActualizacion),
      icon: 'Clock'
    },
    {
      label: 'Fecha de Vencimiento',
      value: formatDate(report?.fechaVencimiento),
      icon: 'AlertCircle'
    },
    {
      label: 'Tipo de Asignación',
      value: report?.tipoAsignacion,
      icon: 'Tag'
    }
  ];

  if (user?.role === 'executive') {
    metadataItems?.push(
      {
        label: 'Empleado Asignado',
        value: report?.coordinador,
        icon: 'User'
      },
      {
        label: 'Departamento',
        value: report?.departamento || 'Calidad',
        icon: 'Building'
      }
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="Info" size={20} className="mr-2" />
        Información del Reporte
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metadataItems?.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-md">
            <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
              <Icon name={item?.icon} size={16} color="var(--color-primary)" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {item?.label}
              </p>
              <p className="text-sm font-medium text-foreground mt-1 break-words">
                {item?.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportMetadata;