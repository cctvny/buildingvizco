import React, { useState, useEffect } from "react";
import { ActivityLog, User, Lock } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Unlock,
  Lock as LockIcon,
  AlertTriangle,
  User as UserIcon,
  Key,
  CheckCircle,
  XCircle,
  Smartphone,
  CreditCard,
  Fingerprint,
  Hash,
  Download
} from "lucide-react";
import { format } from "date-fns";

import ReportFilters from "../components/reports/ReportFilters";

export default function ReportsPage() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [locks, setLocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: { from: null, to: null },
    user: "all",
    lock: "all",
    eventType: "all",
    outcome: "all"
  });

  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    filterActivities();
  }, [activities, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [activityData, userData, lockData] = await Promise.all([
        ActivityLog.list('-timestamp'),
        User.list(),
        Lock.list()
      ]);
      setActivities(activityData);
      setFilteredActivities(activityData);
      setUsers(userData);
      setLocks(lockData);
    } catch (error) {
      console.error("Error loading report data:", error);
    }
    setLoading(false);
  };
  
  const filterActivities = () => {
    let filtered = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      const matchesDate = 
        (!filters.dateRange.from || activityDate >= filters.dateRange.from) &&
        (!filters.dateRange.to || activityDate <= filters.dateRange.to);
        
      const matchesUser = filters.user === "all" || activity.user_id === filters.user;
      const matchesLock = filters.lock === "all" || activity.lock_id === filters.lock;
      const matchesEventType = filters.eventType === "all" || activity.activity_type === filters.eventType;
      
      let matchesOutcome = true;
      if (filters.outcome === 'success') matchesOutcome = activity.success === true;
      if (filters.outcome === 'failed') matchesOutcome = activity.success === false;

      return matchesDate && matchesUser && matchesLock && matchesEventType && matchesOutcome;
    });
    setFilteredActivities(filtered);
  };

  const getUserName = (userId) => users.find(u => u.id === userId)?.full_name || 'System/Unknown';
  const getLockName = (lockId) => locks.find(l => l.id === lockId)?.lock_name || 'Unknown Lock';

  const getEventIcon = (type) => {
    switch(type) {
      case 'unlock': return <Unlock className="w-4 h-4 text-green-600"/>;
      case 'lock': return <LockIcon className="w-4 h-4 text-blue-600"/>;
      case 'failed_attempt': return <AlertTriangle className="w-4 h-4 text-red-600"/>;
      default: return <Key className="w-4 h-4 text-gray-500"/>;
    }
  };
  
  const getMethodIcon = (method) => {
    switch(method) {
      case 'app': return <Smartphone className="w-4 h-4"/>;
      case 'keypad': return <Hash className="w-4 h-4"/>;
      case 'card': return <CreditCard className="w-4 h-4"/>;
      case 'fingerprint': return <Fingerprint className="w-4 h-4"/>;
      case 'key': return <Key className="w-4 h-4"/>;
      default: return <Key className="w-4 h-4 text-gray-400"/>;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <FileText className="w-8 h-8" />
              Activity Reports
            </h1>
            <p className="text-slate-600">View and export detailed audit trails and access logs</p>
          </div>
          <Button variant="outline"><Download className="w-4 h-4 mr-2"/> Export CSV</Button>
        </div>

        {/* Filters */}
        <ReportFilters filters={filters} onFiltersChange={setFilters} users={users} locks={locks} />

        {/* Activity Table */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">
              Audit Trail ({filteredActivities.length} records)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-slate-900">Event</TableHead>
                    <TableHead className="font-semibold text-slate-900">User</TableHead>
                    <TableHead className="font-semibold text-slate-900">Lock</TableHead>
                    <TableHead className="font-semibold text-slate-900">Method</TableHead>
                    <TableHead className="font-semibold text-slate-900">Date & Time</TableHead>
                    <TableHead className="font-semibold text-slate-900">Outcome</TableHead>
                    <TableHead className="font-semibold text-slate-900">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(10).fill(0).map((_, i) => (
                      <TableRow key={i}><TableCell colSpan="7" className="p-4"><div className="h-4 w-full bg-slate-200 rounded animate-pulse" /></TableCell></TableRow>
                    ))
                  ) : (
                    filteredActivities.map((activity) => (
                      <TableRow key={activity.id} className="border-slate-100 hover:bg-slate-50">
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            {getEventIcon(activity.activity_type)}
                            <span className="font-medium text-slate-800 capitalize">{activity.activity_type.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            {getUserName(activity.user_id)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <LockIcon className="w-4 h-4 text-slate-400" />
                            {getLockName(activity.lock_id)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 capitalize text-sm">
                            {getMethodIcon(activity.method)}
                            {activity.method}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {format(new Date(activity.timestamp), 'MMM d, yyyy HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          {activity.success ? 
                            <CheckCircle className="w-5 h-5 text-green-600" /> : 
                            <XCircle className="w-5 h-5 text-red-600" />}
                        </TableCell>
                        <TableCell className="text-sm text-red-600 font-mono">
                          {activity.details}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}