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
  Sparkles,
  PieChart as PieIcon,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';
import Chart from 'react-apexcharts';
import api from '../../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { cn } from '../../lib/utils';

// KPI Card Component with shadcn Card
function KPICard({ label, value, icon: Icon, trend, trendValue, color = 'emerald', subtitle }) {
  const colorMap = {
    emerald: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', accent: 'from-emerald-500 to-teal-600' },
    blue: { bg: 'bg-blue-50 text-blue-600 border-blue-100', accent: 'from-blue-500 to-indigo-600' },
    amber: { bg: 'bg-amber-50 text-amber-600 border-amber-100', accent: 'from-amber-500 to-orange-600' },
    indigo: { bg: 'bg-indigo-50 text-indigo-600 border-indigo-100', accent: 'from-indigo-500 to-purple-600' },
    orange: { bg: 'bg-orange-50 text-orange-600 border-orange-100', accent: 'from-orange-500 to-amber-600' },
    teal: { bg: 'bg-teal-50 text-teal-600 border-teal-100', accent: 'from-teal-500 to-cyan-600' },
    violet: { bg: 'bg-violet-50 text-violet-600 border-violet-100', accent: 'from-violet-500 to-purple-600' },
    rose: { bg: 'bg-rose-50 text-rose-600 border-rose-100', accent: 'from-rose-500 to-red-600' },
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {typeof value === 'number' ? value.toLocaleString() : value || '0'}
            </h3>
            {subtitle && (
              <p className="mt-1 text-xs text-slate-500 truncate">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className="mt-2.5 inline-flex items-center gap-1">
                <Badge 
                  variant={trend === 'up' ? 'success' : trend === 'down' ? 'destructive' : 'secondary'}
                  className="text-[11px] font-semibold px-2 py-0.5"
                >
                  <TrendingUp className={cn("h-3 w-3 mr-1", trend === 'down' && "rotate-180")} />
                  {trendValue}
                </Badge>
              </div>
            )}
          </div>
          <div className={cn("w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105 shadow-sm", scheme.bg)}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Chart Container Card Wrapper with shadcn
function ChartCard({ title, description, children, loading, icon: Icon = BarChart3 }) {
  return (
    <Card className="overflow-hidden border-slate-200/80 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
              {description && <CardDescription className="text-xs">{description}</CardDescription>}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
              <p className="mt-3 text-xs font-medium text-slate-500">Loading chart data…</p>
            </div>
          </div>
        ) : (
          <div className="relative w-full">{children}</div>
        )}
      </CardContent>
    </Card>
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
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
          <p className="mt-3 text-sm font-semibold text-slate-600">Loading system analytics…</p>
        </div>
      </div>
    );
  }

  // ── ApexChart Modern Configurations ──────────────────────────────────────
  const baseChartTheme = {
    fontFamily: 'Inter, system-ui, sans-serif',
    foreColor: '#64748b',
  };

  // 1. Line Chart: Registration Trend
  const lineChartOptions = {
    chart: { ...baseChartTheme, type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#10b981'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    xaxis: { 
      categories: registrationTrend?.months || [],
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { labels: { formatter: (v) => Math.round(v) } },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    tooltip: { theme: 'light', style: { fontSize: '12px' } },
  };

  // 2. Bar Chart: Document Requests
  const barChartOptions = {
    chart: { ...baseChartTheme, type: 'bar', toolbar: { show: false } },
    colors: ['#3b82f6'],
    plotOptions: { 
      bar: { 
        borderRadius: 6, 
        horizontal: false, 
        columnWidth: '45%',
        distributed: true
      } 
    },
    colors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899'],
    xaxis: { 
      categories: documentRequests?.types || [],
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    legend: { show: false },
    dataLabels: { enabled: false },
  };

  // 3. Donut Chart: Request Status
  const donutChartOptions = {
    chart: { ...baseChartTheme, type: 'donut' },
    colors: ['#f59e0b', '#3b82f6', '#10b981', '#f43f5e', '#64748b'],
    labels: requestStatus?.labels || [],
    legend: { position: 'bottom', fontSize: '12px', fontWeight: 500 },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '12px',
              color: '#64748b',
              formatter: () => requestStatus?.counts?.reduce((a, b) => a + b, 0) || 0,
            },
          },
        },
      },
    },
  };

  // 4. Pie Chart: Complaint Stats
  const pieChartOptions = {
    chart: { ...baseChartTheme, type: 'donut' },
    colors: ['#f59e0b', '#3b82f6', '#10b981'],
    labels: complaintStats?.labels || [],
    legend: { position: 'bottom', fontSize: '12px', fontWeight: 500 },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: '70%' } } },
  };

  // 5. Gender Donut
  const genderDonutOptions = {
    chart: { ...baseChartTheme, type: 'donut' },
    colors: ['#3b82f6', '#ec4899', '#8b5cf6'],
    labels: demographics?.gender?.labels || [],
    legend: { position: 'bottom', fontSize: '12px', fontWeight: 500 },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: '70%' } } },
  };

  // 6. Age Group Bar
  const ageBarOptions = {
    chart: { ...baseChartTheme, type: 'bar', toolbar: { show: false } },
    colors: ['#8b5cf6'],
    plotOptions: { bar: { borderRadius: 6, horizontal: true, barHeight: '50%' } },
    xaxis: { categories: demographics?.age?.labels || [] },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    dataLabels: { enabled: false },
  };

  // 7. Area Chart: Monthly Activity
  const areaChartOptions = {
    chart: { ...baseChartTheme, type: 'area', toolbar: { show: false } },
    stroke: { curve: 'smooth', width: 2.5 },
    colors: ['#10b981', '#3b82f6', '#f59e0b'],
    xaxis: { categories: monthlyActivity?.months || [] },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
      },
    },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    legend: { position: 'top', horizontalAlign: 'right', fontSize: '12px' },
    dataLabels: { enabled: false },
  };

  const verificationPercent = verificationProgress?.percentage || 0;

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <Card className="overflow-hidden border-slate-200/80 bg-white shadow-sm">
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600" />
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  Analytics & Insights
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Real-time metrics, document trends, and resident demographics for Barangay Bakilid
                </p>
              </div>
            </div>

            <Button
              onClick={fetchAnalytics}
              disabled={refreshing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-4 py-2.5 shadow-sm transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
              <span>Refresh Metrics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Total Registered"
          value={kpis?.totalResidents}
          icon={Users}
          color="blue"
          subtitle="Registered resident accounts"
        />
        <KPICard
          label="Active Accounts"
          value={kpis?.activeResidents}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Currently active residents"
        />
        <KPICard
          label="Pending Requests"
          value={kpis?.pendingRequests}
          icon={Clock}
          color="amber"
          subtitle="Awaiting staff approval"
        />
        <KPICard
          label="Approved Requests"
          value={kpis?.approvedRequests}
          icon={FileText}
          color="indigo"
          subtitle="Documents released"
        />
        <KPICard
          label="Pending Verification"
          value={kpis?.pendingVerifications}
          icon={AlertCircle}
          color="orange"
          subtitle="ID verifications pending"
        />
        <KPICard
          label="Resolved Complaints"
          value={kpis?.resolvedComplaints}
          icon={ShieldCheck}
          color="teal"
          subtitle="Complaints resolved"
        />
        <KPICard
          label="Active Announcements"
          value={kpis?.activeAnnouncements}
          icon={Megaphone}
          color="violet"
          subtitle="Published community posts"
        />
        <KPICard
          label="Monthly Growth Rate"
          value={`${kpis?.monthlyGrowthRate || 0}%`}
          icon={TrendingUp}
          trend={kpis?.monthlyGrowthRate >= 0 ? 'up' : 'down'}
          trendValue={`${kpis?.monthlyGrowthRate || 0}% this month`}
          color="rose"
        />
      </div>

      {/* Quick Statistics Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Top Requested Doc</span>
            </div>
            <p className="text-lg font-bold text-white truncate">{quickStats?.mostRequestedDocument || 'N/A'}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-300" />
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Avg Processing</span>
            </div>
            <p className="text-2xl font-extrabold text-white">{quickStats?.avgProcessingTime || 0} <span className="text-sm font-normal text-blue-200">days</span></p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-900 to-emerald-900 text-white border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Resolution Rate</span>
            </div>
            <p className="text-2xl font-extrabold text-white">{quickStats?.resolutionRate || 0}%</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white border-none shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-purple-300" />
              <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">Approval Rate</span>
            </div>
            <p className="text-2xl font-extrabold text-white">{quickStats?.approvalRate || 0}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Resident Registration Trend" description="Monthly registration growth over time" icon={TrendingUp}>
          <Chart
            options={lineChartOptions}
            series={[{ name: 'Registrations', data: registrationTrend?.counts || [] }]}
            type="area"
            height={300}
          />
        </ChartCard>

        <ChartCard title="Document Request Analytics" description="Breakdown by document category" icon={FileText}>
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
        <ChartCard title="Request Status Distribution" description="Current document request workflow status" icon={PieIcon}>
          <Chart
            options={donutChartOptions}
            series={requestStatus?.counts || []}
            type="donut"
            height={300}
          />
        </ChartCard>

        <ChartCard title="Complaint Analytics" description="Status distribution of community complaints" icon={AlertCircle}>
          <Chart
            options={pieChartOptions}
            series={complaintStats?.counts || []}
            type="donut"
            height={300}
          />
        </ChartCard>

        <ChartCard title="Verification Progress" description="Resident identity verification rate" icon={ShieldCheck}>
          <div className="flex flex-col items-center justify-center h-[300px] space-y-5 px-4 text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-500/20 flex items-center justify-center shadow-inner">
              <span className="text-2xl font-extrabold text-emerald-600">{verificationPercent}%</span>
            </div>
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Verified Residents</span>
                <span>{verificationPercent}%</span>
              </div>
              <Progress value={verificationPercent} className="h-3" />
              <p className="text-xs text-slate-400 pt-1">
                {verificationProgress?.verifiedCount || 0} of {verificationProgress?.totalCount || 0} residents verified
              </p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Demographics Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Gender Demographics" description="Resident distribution by gender" icon={Users}>
          <Chart
            options={genderDonutOptions}
            series={demographics?.gender?.counts || []}
            type="donut"
            height={300}
          />
        </ChartCard>

        <ChartCard title="Age Group Breakdown" description="Demographic breakdown across age brackets" icon={BarChart3}>
          <Chart
            options={ageBarOptions}
            series={[{ name: 'Residents', data: demographics?.age?.counts || [] }]}
            type="bar"
            height={300}
          />
        </ChartCard>
      </div>

      {/* Monthly Activity */}
      <ChartCard title="Monthly System Activity" description="Comprehensive tracking of registrations, requests, and complaints" icon={Activity}>
        <Chart
          options={areaChartOptions}
          series={[
            { name: 'Registrations', data: monthlyActivity?.registrations || [] },
            { name: 'Requests', data: monthlyActivity?.requests || [] },
            { name: 'Complaints', data: monthlyActivity?.complaints || [] },
          ]}
          type="area"
          height={340}
        />
      </ChartCard>
    </div>
  );
}
