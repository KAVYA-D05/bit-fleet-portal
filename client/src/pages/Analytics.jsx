import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  BarChart3,
  TrendingUp,
  Fuel,
  Truck,
  Building,
  CheckCircle2,
  Calendar,
  Download,
  Receipt
} from 'lucide-react';

export const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.getDashboardStats();
        if (res.success) {
          setStats(res.stats);
          setCharts(res.charts);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleExportCSV = () => {
    if (!stats) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Bookings,${stats.totalBookings}\n`
      + `Completed Excursions,${stats.completedBookings}\n`
      + `Total Vehicles,${stats.totalVehicles}\n`
      + `Available Fleet,${stats.availableVehicles}\n`
      + `Fleet Utilization Rate,${stats.fleetUtilizationRate}%\n`
      + `Total Distance Travelled (KM),${stats.totalDistanceKm}\n`
      + `Total Fuel Expenditure (INR),₹${stats.totalFuelCost}\n`
      + `Total Fastag / Tolls (INR),₹${stats.totalTollCost}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BIT_Fleet_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
            Institutional Auditing & Utilization
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Fleet Performance & Departmental Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time fleet utilization index, fuel economy logs & departmental trip volume distribution
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
        >
          <Download className="w-4 h-4 text-amber-400" />
          Export Institutional CSV
        </button>
      </div>

      {/* Main KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Fleet Utilization Index</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mt-2">
            {stats?.fleetUtilizationRate || 0}%
          </h3>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats?.fleetUtilizationRate || 0}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {stats?.availableVehicles} of {stats?.totalVehicles} Vehicles Ready in Depot
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Official Distance</span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mt-2">
            {stats?.totalDistanceKm?.toLocaleString() || 0} <span className="text-sm font-bold text-slate-500">KM</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-3">
            Across {stats?.completedBookings || 0} completed campus excursions
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Fuel Consumption Value</span>
            <Fuel className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mt-2">
            ₹{stats?.totalFuelCost?.toLocaleString() || 0}
          </h3>
          <p className="text-[11px] text-slate-400 mt-3">
            Automated log based on driver returns
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Toll / Fastag Expenditure</span>
            <Receipt className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mt-2">
            ₹{stats?.totalTollCost?.toLocaleString() || 0}
          </h3>
          <p className="text-[11px] text-slate-400 mt-3">
            Highway toll pass reconciliations
          </p>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Usage Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-blue-600" />
            Department Requisition Distribution
          </h3>

          <div className="space-y-3">
            {charts?.departmentStats && Object.keys(charts.departmentStats).length > 0 ? (
              Object.entries(charts.departmentStats).map(([dept, count]) => {
                const percentage = Math.round((count / (stats?.totalBookings || 1)) * 100);
                return (
                  <div key={dept} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-700">Department of {dept}</span>
                      <span className="text-slate-900 font-bold">{count} Trips ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No departmental data logged yet.</p>
            )}
          </div>
        </div>

        {/* Trip Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Trip Classification Breakdown
          </h3>

          <div className="space-y-3">
            {charts?.tripTypeStats && Object.keys(charts.tripTypeStats).length > 0 ? (
              Object.entries(charts.tripTypeStats).map(([type, count]) => {
                const percentage = Math.round((count / (stats?.totalBookings || 1)) * 100);
                return (
                  <div key={type} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-700">{type.replace('_', ' ')}</span>
                      <span className="text-slate-900 font-bold">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No trip category data logged yet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
