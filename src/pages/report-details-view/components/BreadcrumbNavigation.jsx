import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const BreadcrumbNavigation = ({ user, reportId }) => {
  const navigate = useNavigate();

  const breadcrumbItems = [
    {
      label: 'Dashboard',
      path: user?.role === 'executive' ? '/executive-dashboard' : '/employee-dashboard',
      icon: 'Home'
    },
    {
      label: 'Detalles del Reporte',
      path: '/report-details-view',
      icon: 'FileText',
      current: true
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      {breadcrumbItems?.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          )}
          
          {item?.current ? (
            <span className="flex items-center space-x-1 text-foreground font-medium">
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
              {reportId && (
                <span className="text-muted-foreground">
                  ({reportId})
                </span>
              )}
            </span>
          ) : (
            <button
              onClick={() => handleNavigate(item?.path)}
              className="flex items-center space-x-1 hover:text-foreground transition-colors duration-200"
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNavigation;