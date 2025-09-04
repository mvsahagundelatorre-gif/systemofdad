import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportsDataTable = ({ reports = [], loading = false, onExport }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const navigate = useNavigate();

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleViewReport = (report) => {
    navigate('/report-details-view', { state: { report } });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'borrador': { color: 'bg-muted text-muted-foreground', label: 'Borrador' },
      'pendiente': { color: 'bg-warning/10 text-warning', label: 'Pendiente' },
      'en_revision': { color: 'bg-primary/10 text-primary', label: 'En Revisión' },
      'completado': { color: 'bg-success/10 text-success', label: 'Completado' },
      'archivado': { color: 'bg-secondary/10 text-secondary', label: 'Archivado' }
    };

    const config = statusConfig?.[status] || statusConfig?.['borrador'];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'alta':
        return <Icon name="AlertTriangle" size={16} color="var(--color-error)" />;
      case 'media':
        return <Icon name="Minus" size={16} color="var(--color-warning)" />;
      case 'baja':
        return <Icon name="ArrowDown" size={16} color="var(--color-success)" />;
      default:
        return <Icon name="Minus" size={16} color="var(--color-muted-foreground)" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedReports = React.useMemo(() => {
    if (!reports?.length) return [];
    
    return [...reports]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];
      
      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [reports, sortConfig]);

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
            <div className="h-9 bg-muted rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="divide-y divide-border">
          {[...Array(5)]?.map((_, i) => (
            <div key={i} className="p-4">
              <div className="grid grid-cols-7 gap-4">
                {[...Array(7)]?.map((_, j) => (
                  <div key={j} className="h-4 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Table Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Informes de Empleados
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
          >
            Exportar
          </Button>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              {[
                { key: 'assignmentNumber', label: 'Número de Asignación' },
                { key: 'employeeName', label: 'Empleado' },
                { key: 'clientName', label: 'Cliente' },
                { key: 'assignmentType', label: 'Tipo' },
                { key: 'createdAt', label: 'Fecha Creación' },
                { key: 'status', label: 'Estado' },
                { key: 'actions', label: 'Acciones' }
              ]?.map((column) => (
                <th
                  key={column?.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider ${
                    column?.key !== 'actions' ? 'cursor-pointer hover:bg-muted/50' : ''
                  }`}
                  onClick={column?.key !== 'actions' ? () => handleSort(column?.key) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column?.label}</span>
                    {column?.key !== 'actions' && (
                      <Icon
                        name={
                          sortConfig?.key === column?.key
                            ? sortConfig?.direction === 'asc' ?'ChevronUp' :'ChevronDown' :'ChevronsUpDown'
                        }
                        size={14}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedReports?.map((report, index) => (
              <tr key={report?.id || index} className="hover:bg-muted/30 transition-colors duration-200">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(report?.priority)}
                    <span className="text-sm font-medium text-foreground font-mono">
                      {report?.assignmentNumber}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="var(--color-primary)" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{report?.employeeName}</div>
                      <div className="text-xs text-muted-foreground">{report?.department}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">{report?.clientName}</div>
                  <div className="text-xs text-muted-foreground">{report?.clientPartNumber}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-foreground">{report?.assignmentTypeLabel}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-foreground font-mono">
                    {formatDate(report?.createdAt)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(report?.status)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewReport(report)}
                    iconName="Eye"
                    iconPosition="left"
                  >
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {sortedReports?.map((report, index) => (
          <div key={report?.id || index} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getPriorityIcon(report?.priority)}
                  <span className="text-sm font-medium text-foreground font-mono">
                    {report?.assignmentNumber}
                  </span>
                </div>
                {getStatusBadge(report?.status)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="User" size={16} color="var(--color-muted-foreground)" />
                  <span className="text-sm text-foreground">{report?.employeeName}</span>
                  <span className="text-xs text-muted-foreground">({report?.department})</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="Building" size={16} color="var(--color-muted-foreground)" />
                  <span className="text-sm text-foreground">{report?.clientName}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
                  <span className="text-sm text-foreground font-mono">
                    {formatDate(report?.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">{report?.assignmentTypeLabel}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewReport(report)}
                  iconName="Eye"
                  iconPosition="left"
                >
                  Ver Detalles
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {!loading && sortedReports?.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={32} color="var(--color-muted-foreground)" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron informes</h3>
          <p className="text-muted-foreground">
            No hay informes que coincidan con los criterios de búsqueda actuales.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportsDataTable;