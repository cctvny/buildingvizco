import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function CredentialFilters({ filters, onFiltersChange, users, locks }) {
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
        value={filters.type}
        onValueChange={(value) => handleFilterChange('type', value)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="pin">PIN</SelectItem>
          <SelectItem value="rfid_card">RFID Card</SelectItem>
          <SelectItem value="rfid_fob">RFID Fob</SelectItem>
          <SelectItem value="fingerprint">Fingerprint</SelectItem>
          <SelectItem value="app_key">App Key</SelectItem>
        </SelectContent>
      </Select>

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
          <SelectItem value="expired">Expired</SelectItem>
          <SelectItem value="revoked">Revoked</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.user}
        onValueChange={(value) => handleFilterChange('user', value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="User" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          {users.map(user => (
            <SelectItem key={user.id} value={user.id}>{user.full_name || user.email}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.lock}
        onValueChange={(value) => handleFilterChange('lock', value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Lock" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locks</SelectItem>
          {locks.map(lock => (
            <SelectItem key={lock.id} value={lock.id}>{lock.lock_name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}