import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportHeader = ({ report, user, onEdit, onDownloadPDF, onEmailSupervisor }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completado': return 'bg-success/10 text-success border-success/20';
      case 'pendiente': return 'bg-warning/10 text-warning border-warning/20';
      case 'borrador': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-error/10 text-error border-error/20';
      case 'media': return 'bg-warning/10 text-warning border-warning/20';
      case 'baja': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="FileText" size={24} color="var(--color-primary)" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {report?.numeroAsignacion}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Fecha de Captura:</span>
                <p className="font-medium text-foreground">{report?.fechaCaptura}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Coordinador:</span>
                <p className="font-medium text-foreground">{report?.coordinador}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Cliente:</span>
                <p className="font-medium text-foreground">{report?.nombreCliente}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(report?.estado)}`}>
              {report?.estado?.charAt(0)?.toUpperCase() + report?.estado?.slice(1)}
            </span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(report?.prioridad)}`}>
              Prioridad {report?.prioridad?.charAt(0)?.toUpperCase() + report?.prioridad?.slice(1)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadPDF}
              iconName="Download"
              iconPosition="left"
            >
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onEmailSupervisor}
              iconName="Mail"
              iconPosition="left"
            >
              Enviar
            </Button>
            {(user?.role === 'executive' || report?.coordinador === user?.name) && (
              <Button
                variant="default"
                size="sm"
                onClick={onEdit}
                iconName="Edit"
                iconPosition="left"
              >
                Editar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;