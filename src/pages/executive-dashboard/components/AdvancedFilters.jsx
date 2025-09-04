import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const AdvancedFilters = ({ onFiltersChange, resultsCount = 0 }) => {
  const [filters, setFilters] = useState({
    department: '',
    employee: '',
    assignmentType: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    searchQuery: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const departmentOptions = [
    { value: '', label: 'Todos los Departamentos' },
    { value: 'calidad', label: 'Control de Calidad' },
    { value: 'logistica', label: 'Logística' },
    { value: 'servicios', label: 'Servicios al Cliente' },
    { value: 'auditoria', label: 'Auditoría Interna' },
    { value: 'proveedores', label: 'Gestión de Proveedores' }
  ];

  const employeeOptions = [
    { value: '', label: 'Todos los Empleados' },
    { value: 'maria.garcia', label: 'María García' },
    { value: 'carlos.rodriguez', label: 'Carlos Rodríguez' },
    { value: 'ana.martinez', label: 'Ana Martínez' },
    { value: 'luis.fernandez', label: 'Luis Fernández' },
    { value: 'sofia.lopez', label: 'Sofía López' }
  ];

  const assignmentTypeOptions = [
    { value: '', label: 'Todos los Tipos' },
    { value: 'reclamo_calidad', label: 'Reclamo de Calidad' },
    { value: 'reclamo_logistica', label: 'Reclamo de Logística' },
    { value: 'reclamo_servicio', label: 'Reclamo de Servicio' },
    { value: 'reclamo_proveedor', label: 'Reclamo de Proveedor' },
    { value: 'auditoria_interna', label: 'Auditoría Interna' },
    { value: 'auditoria_externa', label: 'Auditoría Externa' },
    { value: 'no_conformidad', label: 'No Conformidad' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos los Estados' },
    { value: 'borrador', label: 'Borrador' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_revision', label: 'En Revisión' },
    { value: 'completado', label: 'Completado' },
    { value: 'archivado', label: 'Archivado' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      department: '',
      employee: '',
      assignmentType: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      searchQuery: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      {/* Search and Quick Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Buscar por nombre de cliente, número de asignación, empleado..."
            value={filters?.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Filtros Avanzados
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Departamento"
              options={departmentOptions}
              value={filters?.department}
              onChange={(value) => handleFilterChange('department', value)}
            />
            <Select
              label="Empleado"
              options={employeeOptions}
              value={filters?.employee}
              onChange={(value) => handleFilterChange('employee', value)}
              searchable
            />
            <Select
              label="Tipo de Asignación"
              options={assignmentTypeOptions}
              value={filters?.assignmentType}
              onChange={(value) => handleFilterChange('assignmentType', value)}
            />
            <Select
              label="Estado"
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Fecha Desde"
              value={filters?.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
            />
            <Input
              type="date"
              label="Fecha Hasta"
              value={filters?.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
            />
          </div>
        </div>
      )}
      {/* Results Count */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Search" size={16} />
          <span>
            {resultsCount} resultado{resultsCount !== 1 ? 's' : ''} encontrado{resultsCount !== 1 ? 's' : ''}
          </span>
        </div>
        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} color="var(--color-primary)" />
            <span className="text-sm text-primary font-medium">Filtros activos</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedFilters;