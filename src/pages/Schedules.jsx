import React, { useState, useEffect } from "react";
import { AccessSchedule, User, Lock, Credential } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Calendar, 
  Search, 
  Plus,
  Clock,
  User as UserIcon,
  Lock as LockIcon,
  Settings,
  Trash2
} from "lucide-react";
import { format } from "date-fns";

import ScheduleForm from "../components/schedules/ScheduleForm";
import ScheduleFilters from "../components/schedules/ScheduleFilters";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [users, setUsers] = useState([]);
  const [locks, setLocks] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    user: "all",
    lock: "all"
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [schedules, searchTerm, filters]);

  const loadData = async () => {
    try {
      const [scheduleData, userData, lockData, credentialData] = await Promise.all([
        AccessSchedule.list('-created_date'),
        User.list(),
        Lock.list(),
        Credential.list()
      ]);
      setSchedules(scheduleData);
      setUsers(userData);
      setLocks(lockData);
      setCredentials(credentialData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const filterSchedules = () => {
    let filtered = schedules.filter(schedule => {
      const matchesSearch = 
        schedule.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filters.type === "all" || schedule.schedule_type === filters.type;
      const matchesStatus = filters.status === "all" || schedule.status === filters.status;
      const matchesUser = filters.user === "all" || schedule.user_id === filters.user;
      const matchesLock = filters.lock === "all" || schedule.lock_id === filters.lock;

      return matchesSearch && matchesType && matchesStatus && matchesUser && matchesLock;
    });

    setFilteredSchedules(filtered);
  };

  const handleScheduleSave = async (scheduleData) => {
    try {
      if (editingSchedule) {
        await AccessSchedule.update(editingSchedule.id, scheduleData);
      } else {
        await AccessSchedule.create(scheduleData);
      }
      setShowScheduleForm(false);
      setEditingSchedule(null);
      loadData();
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  const handleDeleteSchedule = async (schedule) => {
    if (window.confirm(`Are you sure you want to delete "${schedule.name}"?`)) {
      await AccessSchedule.delete(schedule.id);
      loadData();
    }
  };

  const getScheduleTypeColor = (type) => {
    switch (type) {
      case 'permanent': return 'bg-green-100 text-green-800 border-green-200';
      case 'temporary': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'recurring': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'one_time': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.full_name || user?.email || 'Unknown User';
  };

  const getLockName = (lockId) => {
    const lock = locks.find(l => l.id === lockId);
    return lock?.lock_name || 'Unknown Lock';
  };

  const formatDaysOfWeek = (days) => {
    if (!days || days.length === 0) return 'All days';
    return days.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(', ');
  };

  const formatTimeSlots = (timeSlots) => {
    if (!timeSlots || timeSlots.length === 0) return 'All day';
    return timeSlots.map(slot => `${slot.start_time}-${slot.end_time}`).join(', ');
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Calendar className="w-8 h-8" />
              Access Schedules
            </h1>
            <p className="text-slate-600">Manage time-based access permissions and schedules</p>
          </div>
          <Button 
            onClick={() => setShowScheduleForm(true)}
            className="bg-slate-900 hover:bg-slate-800 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Schedule
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search schedules by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300"
                />
              </div>
              <ScheduleFilters 
                filters={filters}
                onFiltersChange={setFilters}
                users={users}
                locks={locks}
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedules Table */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">
              Access Schedules ({filteredSchedules.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-slate-900">Schedule</TableHead>
                    <TableHead className="font-semibold text-slate-900">Type</TableHead>
                    <TableHead className="font-semibold text-slate-900">User</TableHead>
                    <TableHead className="font-semibold text-slate-900">Lock</TableHead>
                    <TableHead className="font-semibold text-slate-900">Days</TableHead>
                    <TableHead className="font-semibold text-slate-900">Time</TableHead>
                    <TableHead className="font-semibold text-slate-900">Status</TableHead>
                    <TableHead className="font-semibold text-slate-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i} className="border-slate-100">
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                          </div>
                        </TableCell>
                        <TableCell><div className="h-6 w-20 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-24 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-24 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-16 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-20 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-6 w-16 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-8 w-20 bg-slate-200 rounded animate-pulse" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredSchedules.map((schedule) => (
                      <TableRow key={schedule.id} className="border-slate-100 hover:bg-slate-50">
                        <TableCell className="py-4">
                          <div>
                            <p className="font-semibold text-slate-900">{schedule.name}</p>
                            <p className="text-sm text-slate-500">
                              {schedule.start_date && schedule.end_date && (
                                <>
                                  {format(new Date(schedule.start_date), 'MMM d')} - {format(new Date(schedule.end_date), 'MMM d, yyyy')}
                                </>
                              )}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getScheduleTypeColor(schedule.schedule_type)}>
                            {schedule.schedule_type?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-900">
                              {getUserName(schedule.user_id)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <LockIcon className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {getLockName(schedule.lock_id)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">
                            {formatDaysOfWeek(schedule.days_of_week)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {formatTimeSlots(schedule.time_slots)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingSchedule(schedule);
                                setShowScheduleForm(true);
                              }}
                              className="text-xs"
                            >
                              <Settings className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSchedule(schedule)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Form Modal */}
        {showScheduleForm && (
          <ScheduleForm
            schedule={editingSchedule}
            users={users}
            locks={locks}
            credentials={credentials}
            onSave={handleScheduleSave}
            onCancel={() => {
              setShowScheduleForm(false);
              setEditingSchedule(null);
            }}
          />
        )}
      </div>
    </div>
  );
}