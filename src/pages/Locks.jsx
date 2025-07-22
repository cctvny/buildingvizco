
import React, { useState, useEffect } from "react";
import { Lock } from "@/api/entities";
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
  Lock as LockIcon, 
  Search, 
  Plus,
  Battery,
  Wifi,
  WifiOff,
  AlertTriangle,
  MapPin,
  Settings,
  RefreshCw,
  Trash2 // Added for clear button
} from "lucide-react";
import { format } from "date-fns";

import LockForm from "../components/locks/LockForm";
import LockFilters from "../components/locks/LockFilters";
import TTLockSync from "../components/locks/TTLockSync"; // New import for TTLockSync component

export default function LocksPage() {
  const [locks, setLocks] = useState([]);
  const [filteredLocks, setFilteredLocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLockForm, setShowLockForm] = useState(false);
  const [editingLock, setEditingLock] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    lockType: "all",
    building: "all",
    batteryLevel: "all"
  });
  const [showTTLockSync, setShowTTLockSync] = useState(false); // New state for TTLock sync modal

  useEffect(() => {
    loadLocks();
  }, []);

  useEffect(() => {
    filterLocks();
  }, [locks, searchTerm, filters]);

  const loadLocks = async () => {
    try {
      const lockData = await Lock.list('-created_date');
      setLocks(lockData);
    } catch (error) {
      console.error("Error loading locks:", error);
    }
    setLoading(false);
  };

  const filterLocks = () => {
    let filtered = locks.filter(lock => {
      const matchesSearch = 
        lock.lock_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lock.lock_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lock.unit_number?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status === "all" || lock.status === filters.status;
      const matchesType = filters.lockType === "all" || lock.lock_type === filters.lockType;
      const matchesBuilding = filters.building === "all" || lock.building_id === filters.building;
      
      let matchesBattery = true;
      if (filters.batteryLevel === "low") {
        matchesBattery = lock.battery_level && lock.battery_level < 20;
      } else if (filters.batteryLevel === "medium") {
        matchesBattery = lock.battery_level && lock.battery_level >= 20 && lock.battery_level < 60;
      } else if (filters.batteryLevel === "high") {
        matchesBattery = lock.battery_level && lock.battery_level >= 60;
      }

      return matchesSearch && matchesStatus && matchesType && matchesBuilding && matchesBattery;
    });

    setFilteredLocks(filtered);
  };

  const handleLockSave = async (lockData) => {
    if (editingLock) {
      await Lock.update(editingLock.id, lockData);
    } else {
      await Lock.create(lockData);
    }
    setShowLockForm(false);
    setEditingLock(null);
    loadLocks();
  };
  
  const handleClearAllLocks = async () => {
    if (window.confirm("Are you sure you want to delete ALL locks from the database? This action cannot be undone.")) {
      try {
        setLoading(true);
        const allLocks = await Lock.list();
        for (const lock of allLocks) {
          await Lock.delete(lock.id);
        }
        await loadLocks();
      } catch (error) {
        console.error("Failed to clear all locks:", error);
        alert("An error occurred while trying to clear the locks.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLocksImported = (count) => {
    // Refresh the locks list after import
    loadLocks();
    setShowTTLockSync(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      case 'low_battery': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLockTypeColor = (type) => {
    switch (type) {
      case 'main_entrance': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'unit_door': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'common_area': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'amenity': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBatteryColor = (level) => {
    if (level >= 60) return 'text-green-600';
    if (level >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <Wifi className="w-4 h-4 text-green-600" />;
      case 'offline': return <WifiOff className="w-4 h-4 text-red-600" />;
      case 'low_battery': return <Battery className="w-4 h-4 text-orange-600" />;
      case 'maintenance': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <LockIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <LockIcon className="w-8 h-8" />
              Lock Management
            </h1>
            <p className="text-slate-600">Monitor and control TTLock smart locks</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowTTLockSync(true)}
              variant="outline"
              className="border-slate-300 hover:bg-slate-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync TTLock Account
            </Button>
            <Button 
              onClick={() => setShowLockForm(true)}
              className="bg-slate-900 hover:bg-slate-800 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Manual Lock
            </Button>
             <Button 
              onClick={handleClearAllLocks}
              variant="destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Locks
            </Button>
          </div>
        </div>

        {/* TTLock Sync Component */}
        {showTTLockSync && (
          <div className="mb-6">
            <TTLockSync onLocksImported={handleLocksImported} />
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowTTLockSync(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-6 bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search locks by name, ID, or unit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300"
                />
              </div>
              <LockFilters 
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </CardContent>
        </Card>

        {/* Locks Table */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">
              Smart Locks ({filteredLocks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-slate-900">Lock</TableHead>
                    <TableHead className="font-semibold text-slate-900">Location</TableHead>
                    <TableHead className="font-semibold text-slate-900">Type</TableHead>
                    <TableHead className="font-semibold text-slate-900">Status</TableHead>
                    <TableHead className="font-semibold text-slate-900">Battery</TableHead>
                    <TableHead className="font-semibold text-slate-900">Last Activity</TableHead>
                    <TableHead className="font-semibold text-slate-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i} className="border-slate-100">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                              <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><div className="h-4 w-20 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-6 w-24 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-6 w-20 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-16 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-24 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-8 w-16 bg-slate-200 rounded animate-pulse" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredLocks.map((lock) => (
                      <TableRow key={lock.id} className="border-slate-100 hover:bg-slate-50">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                              <LockIcon className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{lock.lock_name}</p>
                              <p className="text-sm text-slate-500">ID: {lock.lock_id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <div>
                              <p className="font-medium">{lock.unit_number || 'N/A'}</p>
                              <p className="text-slate-500 text-xs">{lock.building_id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getLockTypeColor(lock.lock_type)}>
                            {lock.lock_type?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(lock.status)}
                            <Badge variant="outline" className={getStatusColor(lock.status)}>
                              {lock.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {lock.battery_level ? (
                            <div className="flex items-center gap-2">
                              <Battery className={`w-4 h-4 ${getBatteryColor(lock.battery_level)}`} />
                              <span className={`font-medium ${getBatteryColor(lock.battery_level)}`}>
                                {lock.battery_level}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {lock.last_activity ? (
                            <span className="text-sm text-slate-600">
                              {format(new Date(lock.last_activity), 'MMM d, HH:mm')}
                            </span>
                          ) : (
                            <span className="text-slate-400">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingLock(lock);
                                setShowLockForm(true);
                              }}
                            >
                              <Settings className="w-3 h-3 mr-1" />
                              Edit
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

        {/* Lock Form Modal */}
        {showLockForm && (
          <LockForm
            lock={editingLock}
            onSave={handleLockSave}
            onCancel={() => {
              setShowLockForm(false);
              setEditingLock(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
