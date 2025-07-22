import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function UserFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex gap-3 items-center">
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
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.accessLevel}
        onValueChange={(value) => handleFilterChange('accessLevel', value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Access Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="resident">Resident</SelectItem>
          <SelectItem value="property_manager">Property Manager</SelectItem>
          <SelectItem value="super_admin">Super Admin</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}