import React from 'react';
import Icon from '../../../components/AppIcon';

const ReportContent = ({ report }) => {
  const contentSections = [
    {
      title: 'Información del Cliente',
      icon: 'Building2',
      items: [
        { label: 'Nombre del Cliente', value: report?.nombreCliente },
        { label: 'Número de Parte del Cliente', value: report?.numeroParteCliente },
        { label: 'Fecha del Reporte del Cliente', value: report?.fechaReporteCliente },
        { label: 'Número de Reporte del Cliente', value: report?.numeroReporteCliente }
      ]
    },
    {
      title: 'Información del Proveedor',
      icon: 'Truck',
      items: [
        { label: 'Número de Parte del Proveedor', value: report?.numeroParteProveedor },
        { label: 'Nombre del Proveedor', value: report?.nombreProveedor || 'No especificado' }
      ]
    },
    {
      title: 'Detalles de la Asignación',
      icon: 'ClipboardList',
      items: [
        { label: 'Tipo de Asignación', value: report?.tipoAsignacion },
        { label: 'Número de Asignación', value: report?.numeroAsignacion },
        { label: 'Estado', value: report?.estado?.charAt(0)?.toUpperCase() + report?.estado?.slice(1) }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {contentSections?.map((section, sectionIndex) => (
        <div key={sectionIndex} className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name={section?.icon} size={20} className="mr-2" />
            {section?.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section?.items?.map((item, itemIndex) => (
              <div key={itemIndex} className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">
                  {item?.label}
                </label>
                <p className="text-sm text-foreground bg-muted/30 p-2 rounded-md">
                  {item?.value || 'No especificado'}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Descripción del Defecto */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="AlertTriangle" size={20} className="mr-2" />
          Descripción del Defecto
        </h3>
        
        <div className="bg-muted/30 rounded-md p-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {report?.descripcionDefecto || 'No se ha proporcionado descripción del defecto.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportContent;