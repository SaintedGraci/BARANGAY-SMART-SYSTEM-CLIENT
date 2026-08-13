import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Megaphone,
  Calendar,
  Activity,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import Chart from 'react-apexcharts';
import api from '../../services/api';

// KPI Card Component with Modern Design
function KPICard({ label, value, icon: Icon, trend, trendValue, className = 'bg-blue-50 text-blue-700', subtitle }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-blue-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">{value?.toLocaleString() || '0'}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              trend === 'up' 
                ? 'bg-emerald-50 text-emerald-700' 
                : trend === 'down'
                ? 'bg-rose-50 text-rose-700'
                : 'bg-slate-50 text-slate-700'
            }`}>
              <TrendingUp className={`h-3.5 w-3.5 ${trend === 'down' ? 'rotate-180' : trend === 'neutral' ? 'rotate-90' : ''}`} />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${className}`}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}

// Chart Card Wrapper with Modern Design
function ChartCard({ title, description, children, loading, action }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-3 text-sm font-medium text-slate-500">Loading chart data...</p>
          </div>
        </div>
      ) : (
        <div className="relative">{children}</div>
      )}
    </div>
  );
}

// Progress Ring Component
function ProgressRing({ percentage, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold text-slate-900">{percentage}%</p>
        <p className="text-xs text-slate-500">Verified</p>
      </div>
    </div>
  );
}

export default function AnalyticsTab() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [kpis, setKpis] = useState(null);
  const [registrationTrend, setRegistrationTrend] = useState(null);
  const [documentRequests, setDocumentRequests] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [complaintStats, setComplaintStats] = useState(null);
  const [demographics, setDemographics] = useState(null);
  const [monthlyActivity, setMonthlyActivity] = useState(null);
  const [verificationProgress, setVerificationProgress] = useState(null);
  const [quickStats, setQuickStats] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const [
        kpisRes,
        regTrendRes,
        docReqRes,
        reqStatusRes,
        complaintsRes,
        demoRes,
        activityRes,
        verificationRes,
        quickStatsRes,
      ] = await Promise.all([
        api.get('/analytics/kpis'),
        api.get('/analytics/registration-trend'),
        api.get('/analytics/document-requests'),
        api.get('/analytics/request-status'),
        api.get('/analytics/complaints'),
        api.get('/analytics/demographics'),
        api.get('/analytics/monthly-activity'),
        api.get('/analytics/verification-progress'),
        api.get('/analytics/quick-stats'),
      ]);

      setKpis(kpisRes.data.data);
      setRegistrationTrend(regTrendRes.data.data);
      setDocumentRequests(docReqRes.data.data);
      setRequestStatus(reqStatusRes.data.data);
      setComplaintStats(complaintsRes.data.data);
      setDemographics(demoRes.data.data);
      setMonthlyActivity(activityRes.data.data);
      setVerificationProgress(verificationRes.data.data);
      setQuickStats(quickStatsRes.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Chart configurations
  const lineChartOptions = {
    chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#3b82f6'],
    xaxis: { categories: registrationTrend?.months || [] },
    yaxis: { title: { text: 'Registrations' } },
    grid: { borderColor: '#e2e8f0' },
    tooltip: { theme: 'light' },
  };

  const barChartOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    colors: ['#3b82f6'],
    plotOptions: { bar: { borderRadius: 8, horizontal: false, columnWidth: '60%' } },
    xaxis: { categories: documentRequests?.types || [] },
    yaxis: { title: { text: 'Count' } },
    grid: { borderColor: '#e2e8f0' },
    dataLabels: { enabled: false },
  };

  const donutChartOptions = {
    chart: { type: 'donut' },
    colors: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'],
    labels: requestStatus?.labels || [],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => requestStatus?.counts?.reduce((a, b) => a + b, 0) || 0,
            },
          },
        },
      },
    },
  };

  const pieChartOptions = {
    chart: { type: 'pie' },
    colors: ['#f59e0b', '#3b82f6', '#10b981'],
    labels: complaintStats?.labels || [],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true },
  };

  const genderDonutOptions = {
    chart: { type: 'donut' },
    colors: ['#3b82f6', '#ec4899', '#8b5cf6'],
    labels: demographics?.gender?.labels || [],
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        },
      },
    },
  };

  const ageBarOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    colors: ['#3b82f6'],
    plotOptions: { bar: { borderRadius: 8, horizontal: true } },
    xaxis: { categories: demographics?.age?.labels || [] },
    yaxis: { title: { text: 'Age Groups' } },
    grid: { borderColor: '#e2e8f0' },
  };

  const areaChartOptions = {
    chart: { type: 'area', toolbar: { show: false } },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
    xaxis: { categories: monthlyActivity?.months || [] },
    yaxis: { title: { text: 'Activity Count' } },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    legend: { position: 'top', horizontalAlign: 'right' },
    dataLabels: { enabled: false },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Comprehensive insights and system metrics</p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Total Residents"
          value={kpis?.totalResidents}
          icon={Users}
          className="bg-blue-50 text-blue-700"
        />
        <KPICard
          label="Active Residents"
          value={kpis?.activeResidents}
          icon={CheckCircle2}
          className="bg-emerald-50 text-emerald-700"
        />
        <KPICard
          label="Pending Requests"
          value={kpis?.pendingRequests}
          icon={Clock}
          className="bg-amber-50 text-amber-700"
        />
        <KPICard
          label="Approved Requests"
          value={kpis?.approvedRequests}
          icon={FileText}
          className="bg-indigo-50 text-indigo-700"
        />
        <KPICard
          label="Pending Verifications"
          value={kpis?.pendingVerifications}
          icon={AlertCircle}
          className="bg-orange-50 text-orange-700"
        />
        <KPICard
          label="Resolved Complaints"
          value={kpis?.resolvedComplaints}
          icon={CheckCircle2}
          className="bg-teal-50 text-teal-700"
        />
        <KPICard
          label="Active Announcements"
          value={kpis?.activeAnnouncements}
          icon={Megaphone}
          className="bg-violet-50 text-violet-700"
        />
        <KPICard
          label="Monthly Growth Rate"
          value={`${kpis?.monthlyGrowthRate || 0}%`}
          icon={TrendingUp}
          trend={kpis?.monthlyGrowthRate >= 0 ? 'up' : 'down'}
          className="bg-rose-50 text-rose-700"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Resident Registration Trend" description="Monthly registrations for the last 12 months">
          <Chart
            options={lineChartOptions}
            series={[{ name: 'Registrations', data: registrationTrend?.counts || [] }]}
            type="line"
            height={300}
          />
        </ChartCard>

        <ChartCard title="Document Request Analytics" description="Distribution by document type">
          <Chart
            options={barChartOptions}
            series={[{ name: 'Requests', data: documentRequests?.counts || [] }]}
            type="bar"
            height={300}
          />
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Request Status Distribution" description="Current request status breakdown">
          <Chart
            options={donutChartOptions}
            series={requestStatus?.counts || []}
            type="donut"
            height={300}
          />
        </ChartCard>

        <ChartCard title="Complaint Analytics" description="Complaint status distribution">
          <Chart
            options={pieChartOptions}
            series={complaintStats?.counts || []}
            type="pie"
            height={300}
          />
        </ChartCard>

        <ChartCard title="Verification Progress" description="Percentage of verified residents">
          <div className="flex h-[300px] items-center justify-center">
            <ProgressRing percentage={verificationProgress?.percentage || 0} size={160} strokeWidth={12} />
          </div>
        </ChartCard>
      </div>

      {/* Demographics Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Gender Distribution" description="Resident demographics by gender">
          <Chart
            options={genderDonutOptions}
            series={demographics?.gender?.counts || []}
            type="donut"
            height={300}
          />
        </ChartCard>

        <ChartCard title="Age Group Distribution" description="Resident demographics by age">
          <Chart
            options={ageBarOptions}
            series={[{ name: 'Residents', data: demographics?.age?.counts || [] }]}
            type="bar"
            height={300}
          />
        </ChartCard>
      </div>

      {/* Monthly Activity */}
      <ChartCard title="Monthly System Activity" description="Last 6 months of system activity">
        <Chart
          options={areaChartOptions}
          series={[
            { name: 'Registrations', data: monthlyActivity?.registrations || [] },
            { name: 'Requests', data: monthlyActivity?.requests || [] },
            { name: 'Complaints', data: monthlyActivity?.complaints || [] },
          ]}
          type="area"
          height={350}
        />
      </ChartCard>

      {/* Quick Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Most Requested Document</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{quickStats?.mostRequestedDocument || 'N/A'}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Avg Processing Time</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{quickStats?.avgProcessingTime || 0} days</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Resolution Rate</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{quickStats?.resolutionRate || 0}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Approval Rate</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{quickStats?.approvalRate || 0}%</p>
        </div>
      </div>
    </div>
  );
}
