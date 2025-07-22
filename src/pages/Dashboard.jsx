import React, { useState, useEffect } from "react";
import { User, Building, Lock, ActivityLog, AccessPermission } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Users, 
  Lock as LockIcon, 
  Building as BuildingIcon, 
  Activity,
  Shield,
  AlertTriangle,
  Battery,
  Plus
} from "lucide-react";
import { format } from "date-fns";

import StatsCard from "../components/dashboard/StatsCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import SystemAlerts from "../components/dashboard/SystemAlerts";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    buildings: 0, 
    locks: 0,
    activePermissions: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [users, buildings, locks, permissions, activities] = await Promise.all([
        User.list(),
        Building.list(), 
        Lock.list(),
        AccessPermission.filter({ status: 'active' }),
        ActivityLog.list('-timestamp', 10)
      ]);

      setStats({
        users: users.length,
        buildings: buildings.length,
        locks: locks.length,
        activePermissions: permissions.length
      });

      setRecentActivity(activities);

      // Generate system alerts based on lock status
      const alerts = [];
      const lowBatteryLocks = locks.filter(lock => lock.battery_level && lock.battery_level < 20);
      const offlineLocks = locks.filter(lock => lock.status === 'offline');
      
      if (lowBatteryLocks.length > 0) {
        alerts.push({
          type: 'warning',
          title: 'Low Battery Alert',
          message: `${lowBatteryLocks.length} locks have low battery`,
          count: lowBatteryLocks.length
        });
      }
      
      if (offlineLocks.length > 0) {
        alerts.push({
          type: 'error', 
          title: 'Offline Locks',
          message: `${offlineLocks.length} locks are currently offline`,
          count: offlineLocks.length
        });
      }

      setSystemAlerts(alerts);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Overview of your property management system</p>
          </div>
          <QuickActions />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.users}
            icon={Users}
            color="from-blue-500 to-blue-600"
            loading={loading}
          />
          <StatsCard
            title="Buildings"
            value={stats.buildings}
            icon={BuildingIcon}
            color="from-green-500 to-green-600" 
            loading={loading}
          />
          <StatsCard
            title="Smart Locks"
            value={stats.locks}
            icon={LockIcon}
            color="from-purple-500 to-purple-600"
            loading={loading}
          />
          <StatsCard
            title="Active Access"
            value={stats.activePermissions}
            icon={Shield}
            color="from-orange-500 to-orange-600"
            loading={loading}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RecentActivity 
              activities={recentActivity}
              loading={loading}
            />
          </div>
          
          <div className="space-y-8">
            <SystemAlerts 
              alerts={systemAlerts}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}