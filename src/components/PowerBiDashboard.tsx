import React, { useMemo } from 'react';
import { Submission } from '../lib/types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Users, Utensils, Zap, LayoutDashboard, Database, Share2 } from 'lucide-react';

interface Props {
  submissions: Submission[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const PowerBiDashboard: React.FC<Props> = ({ submissions }) => {
  // Aggregate data for visualizations
  const regionData = useMemo(() => {
    const counts: Record<string, number> = {};
    submissions.forEach(s => {
      const r = s.data.region;
      counts[r] = (counts[r] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [submissions]);

  const waterSourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    submissions.forEach(s => {
      const w = s.data.primary_water_source;
      counts[w] = (counts[w] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [submissions]);

  const avgMealsByRegion = useMemo(() => {
    const regionTotals: Record<string, { total: number, count: number }> = {};
    submissions.forEach(s => {
      const r = s.data.region;
      const meals = Number(s.data.daily_meals) || 0;
      if (!regionTotals[r]) regionTotals[r] = { total: 0, count: 0 };
      regionTotals[r].total += meals;
      regionTotals[r].count += 1;
    });
    return Object.entries(regionTotals).map(([name, data]) => ({
      name,
      average: parseFloat((data.total / data.count).toFixed(1))
    }));
  }, [submissions]);

  const stats = {
    totalSubmissions: submissions.length,
    avgHouseholdSize: (submissions.reduce((acc, s) => acc + (Number(s.data.household_size) || 0), 0) / submissions.length).toFixed(1),
    electricityPercentage: ((submissions.filter(s => s.data.has_electricity).length / submissions.length) * 100).toFixed(0),
    avgMeals: (submissions.reduce((acc, s) => acc + (Number(s.data.daily_meals) || 0), 0) / submissions.length).toFixed(1),
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            Impact Insight Hub
          </h1>
          <p className="text-slate-500">Live KoboToolbox → Power BI Visualization Simulation</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-sm font-medium">OData Feed Active</span>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
             <Share2 size={16} />
             Share Report
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Total Households" value={stats.totalSubmissions} icon={<Users />} color="blue" />
        <KPICard title="Avg Family Size" value={stats.avgHouseholdSize} icon={<Database />} color="purple" />
        <KPICard title="Electricity Access" value={`${stats.electricityPercentage}%`} icon={<Zap />} color="yellow" />
        <KPICard title="Avg Daily Meals" value={stats.avgMeals} icon={<Utensils />} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Submissions by Region</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Primary Water Sources</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={waterSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {waterSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Nutritional Status: Avg Meals by Region</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={avgMealsByRegion}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 4]} />
                <Tooltip />
                <Area type="monotone" dataKey="average" stroke="#10b981" fillOpacity={1} fill="url(#colorAvg)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <Card className="border-none shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl ${colorMap[color]} group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};