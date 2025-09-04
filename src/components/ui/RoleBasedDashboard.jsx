import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const RoleBasedDashboard = ({ user, reports = [], onReportSelect, className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    completedReports: 0,
    thisMonth: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading and calculate stats
    const timer = setTimeout(() => {
      const totalReports = reports?.length;
      const pendingReports = reports?.filter(r => r?.status === 'pending')?.length;
      const completedReports = reports?.filter(r => r?.status === 'completed')?.length;
      const thisMonth = reports?.filter(r => {
        const reportDate = new Date(r.createdAt);
        const now = new Date();
        return reportDate?.getMonth() === now?.getMonth() && reportDate?.getFullYear() === now?.getFullYear();
      })?.length;

      setStats({ totalReports, pendingReports, completedReports, thisMonth });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [reports]);

  const handleReportClick = (report) => {
    if (onReportSelect) {
      onReportSelect(report);
    }
    navigate('/report-details-view', { state: { report } });
  };

  const handleNewReport = () => {
    navigate('/client-report-form');
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)]?.map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6">
              <div className="animate-pulse-gentle">
                <div className="w-8 h-8 bg-muted rounded-md mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="animate-pulse-gentle space-y-4">
            <div className="h-6 bg-muted rounded w-1/4"></div>
            {[...Array(3)]?.map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-muted-foreground">
              {user?.role === 'executive' ?'Monitor team performance and review reports across all departments.' :'Track your client reports and manage your submissions efficiently.'
              }
            </p>
          </div>
          <div className="hidden sm:block">
            <Button
              variant="default"
              onClick={handleNewReport}
              iconName="Plus"
              iconPosition="left"
            >
              New Report
            </Button>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg border border-border p-6 elevation-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-semibold text-foreground">{stats?.totalReports}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={24} color="var(--color-primary)" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 elevation-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold text-warning">{stats?.pendingReports}</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={24} color="var(--color-warning)" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 elevation-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold text-success">{stats?.completedReports}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={24} color="var(--color-success)" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 elevation-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-2xl font-semibold text-accent">{stats?.thisMonth}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={24} color="var(--color-accent)" />
            </div>
          </div>
        </div>
      </div>
      {/* Recent Reports */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {user?.role === 'executive' ? 'Recent Team Reports' : 'Your Recent Reports'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/report-details-view')}
              iconName="ArrowRight"
              iconPosition="right"
            >
              View All
            </Button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {reports?.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="FileText" size={32} color="var(--color-muted-foreground)" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No reports yet</h3>
              <p className="text-muted-foreground mb-4">
                {user?.role === 'executive' ?'Team reports will appear here once submitted.' :'Get started by creating your first client report.'
                }
              </p>
              <Button
                variant="default"
                onClick={handleNewReport}
                iconName="Plus"
                iconPosition="left"
              >
                Create First Report
              </Button>
            </div>
          ) : (
            reports?.slice(0, 5)?.map((report, index) => (
              <div
                key={report?.id || index}
                className="p-4 hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                onClick={() => handleReportClick(report)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      report?.status === 'completed' ? 'bg-success' :
                      report?.status === 'pending'? 'bg-warning' : 'bg-muted-foreground'
                    }`} />
                    <div>
                      <h4 className="font-medium text-foreground">
                        {report?.title || `Report #${report?.id || index + 1}`}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{report?.clientName || 'Client Name'}</span>
                        <span>•</span>
                        <span>{new Date(report.createdAt || Date.now())?.toLocaleDateString()}</span>
                        {user?.role === 'executive' && report?.employeeName && (
                          <>
                            <span>•</span>
                            <span>by {report?.employeeName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report?.status === 'completed' 
                        ? 'bg-success/10 text-success' :
                      report?.status === 'pending' ?'bg-warning/10 text-warning': 'bg-muted text-muted-foreground'
                    }`}>
                      {report?.status || 'Draft'}
                    </span>
                    <Icon name="ChevronRight" size={16} color="var(--color-muted-foreground)" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Mobile New Report Button */}
      <div className="sm:hidden fixed bottom-6 right-6">
        <Button
          variant="default"
          size="lg"
          onClick={handleNewReport}
          iconName="Plus"
          className="rounded-full shadow-lg"
        >
          New Report
        </Button>
      </div>
    </div>
  );
};

export default RoleBasedDashboard;