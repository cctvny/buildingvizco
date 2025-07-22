import React from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Filter, User, Lock, ListFilter, Check, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

export default function ReportFilters({ filters, onFiltersChange, users, locks }) {
  const handleDateChange = (dateRange) => {
    onFiltersChange(prev => ({ ...prev, dateRange }));
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="mb-6 bg-white border-slate-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <Filter className="w-5 h-5 text-slate-600" />
          
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, 'LLL dd, y')} -{' '}
                      {format(filters.dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(filters.dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={filters.dateRange}
                onSelect={handleDateChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* User Filter */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            <Select value={filters.user} onValueChange={(v) => handleFilterChange('user', v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lock Filter */}
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-500" />
            <Select value={filters.lock} onValueChange={(v) => handleFilterChange('lock', v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Locks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locks</SelectItem>
                {locks.map(lock => (
                  <SelectItem key={lock.id} value={lock.id}>{lock.lock_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Event Type Filter */}
          <div className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-slate-500" />
            <Select value={filters.eventType} onValueChange={(v) => handleFilterChange('eventType', v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Event Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Event Types</SelectItem>
                <SelectItem value="unlock">Unlock</SelectItem>
                <SelectItem value="lock">Lock</SelectItem>
                <SelectItem value="failed_attempt">Failed Attempt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Outcome Filter */}
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-slate-500" />
            <Select value={filters.outcome} onValueChange={(v) => handleFilterChange('outcome', v)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Outcomes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcomes</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}