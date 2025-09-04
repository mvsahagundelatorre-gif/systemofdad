import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WelcomeHeader = ({ user, onCreateReport, className = '' }) => {
  const getCurrentGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formatCurrentDate = () => {
    const now = new Date();
    return now?.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6 mb-8 text-white ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-6 lg:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {getCurrentGreeting()}, {user?.name || 'Usuario'}
              </h1>
              <p className="text-white/80 capitalize">{formatCurrentDate()}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-white/90 text-lg mb-2">Portal de Empleados - Sistema de Informes</p>
            <p className="text-white/70 max-w-2xl">
              Gestiona tus informes de clientes, realiza seguimiento de asignaciones y mantén un registro detallado 
              de todas tus actividades profesionales desde este panel centralizado.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/report-details-view'}
            iconName="FolderOpen"
            iconPosition="left"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Ver Todos los Informes
          </Button>
          <Button
            variant="default"
            onClick={onCreateReport}
            iconName="Plus"
            iconPosition="left"
            className="bg-white text-slate-900 hover:bg-white/90"
          >
            Crear Nuevo Informe
          </Button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={16} color="white" />
            </div>
            <div>
              <div className="text-sm text-white/70">Última Actividad</div>
              <div className="text-white font-medium">Hace 2 horas</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={16} color="white" />
            </div>
            <div>
              <div className="text-sm text-white/70">Productividad</div>
              <div className="text-white font-medium">Excelente</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center sm:justify-start space-x-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div>
              <div className="text-sm text-white/70">Estado</div>
              <div className="text-white font-medium">Activo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;