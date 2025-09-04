import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ActivityTable = ({ reports = [], onViewReport, onEditReport, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'draft', label: 'Borrador' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'completed', label: 'Completado' },
    { value: 'rejected', label: 'Rechazado' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Fecha' },
    { value: 'client', label: 'Cliente' },
    { value: 'assignment', label: 'Número de Asignación' },
    { value: 'status', label: 'Estado' }
  ];

  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports?.filter(report => {
      const matchesSearch = 
        report?.clientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        report?.assignmentNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        report?.assignmentType?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || report?.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });

    filtered?.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.reportDate || a.createdAt);
          bValue = new Date(b.reportDate || b.createdAt);
          break;
        case 'client':
          aValue = a?.clientName?.toLowerCase() || '';
          bValue = b?.clientName?.toLowerCase() || '';
          break;
        case 'assignment':
          aValue = a?.assignmentNumber?.toLowerCase() || '';
          bValue = b?.assignmentNumber?.toLowerCase() || '';
          break;
        case 'status':
          aValue = a?.status?.toLowerCase() || '';
          bValue = b?.status?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [reports, searchTerm, sortBy, sortOrder, filterStatus]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: 'Borrador', color: 'bg-muted text-muted-foreground' },
      pending: { label: 'Pendiente', color: 'bg-warning/10 text-warning' },
      completed: { label: 'Completado', color: 'bg-success/10 text-success' },
      rejected: { label: 'Rechazado', color: 'bg-error/10 text-error' }
    };

    const config = statusConfig?.[status] || statusConfig?.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-10 bg-muted rounded flex-1"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>
        </div>
        <div className="divide-y divide-border">
          {[...Array(5)]?.map((_, index) => (
            <div key={index} className="p-4 animate-pulse-gentle">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Historial de Actividades</h2>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Buscar por cliente, asignación o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Filtrar por estado"
            />
          </div>
          <div className="w-full sm:w-32">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Ordenar por"
            />
          </div>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('assignment')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Nº Asignación</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('client')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Cliente</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Fecha Informe</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tipo Asignación</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-foreground transition-colors"
                >
                  <span>Estado</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAndSortedReports?.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Icon name="FileText" size={32} color="var(--color-muted-foreground)" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">No hay informes</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || filterStatus !== 'all' ?'No se encontraron informes que coincidan con los filtros.' :'Aún no has creado ningún informe. ¡Comienza creando tu primer informe!'
                        }
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedReports?.map((report, index) => (
                <tr key={report?.id || index} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-sm text-foreground">{report?.assignmentNumber}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{report?.clientName}</div>
                      {report?.clientPartNumber && (
                        <div className="text-sm text-muted-foreground">P/N: {report?.clientPartNumber}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground">{formatDate(report?.reportDate)}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground">{report?.assignmentType}</span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(report?.status)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewReport(report)}
                        iconName="Eye"
                        iconSize={16}
                      >
                        Ver
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditReport(report)}
                        iconName="Edit"
                        iconSize={16}
                      >
                        Editar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {filteredAndSortedReports?.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Icon name="FileText" size={32} color="var(--color-muted-foreground)" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">No hay informes</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm || filterStatus !== 'all' ?'No se encontraron informes que coincidan con los filtros.' :'Aún no has creado ningún informe. ¡Comienza creando tu primer informe!'
                  }
                </p>
              </div>
            </div>
          </div>
        ) : (
          filteredAndSortedReports?.map((report, index) => (
            <div key={report?.id || index} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="font-mono text-sm text-primary mb-1">{report?.assignmentNumber}</div>
                  <div className="font-medium text-foreground">{report?.clientName}</div>
                  {report?.clientPartNumber && (
                    <div className="text-sm text-muted-foreground">P/N: {report?.clientPartNumber}</div>
                  )}
                </div>
                {getStatusBadge(report?.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Fecha:</span>
                  <div className="text-foreground">{formatDate(report?.reportDate)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <div className="text-foreground">{report?.assignmentType}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewReport(report)}
                  iconName="Eye"
                  iconPosition="left"
                  className="flex-1"
                >
                  Ver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditReport(report)}
                  iconName="Edit"
                  iconPosition="left"
                  className="flex-1"
                >
                  Editar
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityTable;