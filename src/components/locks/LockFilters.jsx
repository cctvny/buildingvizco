import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function LockFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex gap-3 items-center flex-wrap">
      <Filter className="w-4 h-4 text-slate-500" />
      <Select
        value={filters.status}
        onValueChange={(value) => handleFilterChange('status', value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="offline">Offline</SelectItem>
          <SelectItem value="low_battery">Low Battery</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.lockType}
        onValueChange={(value) => handleFilterChange('lockType', value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Lock Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="main_entrance">Main Entrance</SelectItem>
          <SelectItem value="unit_door">Unit Door</SelectItem>
          <SelectItem value="common_area">Common Area</SelectItem>
          <SelectItem value="amenity">Amenity</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.batteryLevel}
        onValueChange={(value) => handleFilterChange('batteryLevel', value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Battery" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="high">High (60%+)</SelectItem>
          <SelectItem value="medium">Medium (20-60%)</SelectItem>
          <SelectItem value="low">Low (&lt;20%)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}