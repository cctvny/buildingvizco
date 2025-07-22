import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Calendar, Save, Plus, Trash2 } from "lucide-react";

export default function ScheduleForm({ schedule, users, locks, credentials, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: schedule?.name || "",
    user_id: schedule?.user_id || "",
    lock_id: schedule?.lock_id || "",
    credential_id: schedule?.credential_id || "",
    schedule_type: schedule?.schedule_type || "recurring",
    start_date: schedule?.start_date || "",
    end_date: schedule?.end_date || "",
    days_of_week: schedule?.days_of_week || [],
    time_slots: schedule?.time_slots || [{ start_time: "09:00", end_time: "17:00" }],
    max_uses: schedule?.max_uses || "",
    status: schedule?.status || "active"
  });

  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day]
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      time_slots: [...prev.time_slots, { start_time: "09:00", end_time: "17:00" }]
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      time_slots: prev.time_slots.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      time_slots: prev.time_slots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Calendar className="w-5 h-5" />
            {schedule ? 'Edit Schedule' : 'Create New Schedule'}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Schedule Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Schedule Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Weekday Access"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule_type">Schedule Type</Label>
                  <Select
                    value={formData.schedule_type}
                    onValueChange={(value) => handleChange('schedule_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="one_time">One Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Assignment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Assignment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user_id">User</Label>
                  <Select
                    value={formData.user_id}
                    onValueChange={(value) => handleChange('user_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name || user.email} {user.apartment_unit && `(${user.apartment_unit})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lock_id">Lock</Label>
                  <Select
                    value={formData.lock_id}
                    onValueChange={(value) => handleChange('lock_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lock" />
                    </SelectTrigger>
                    <SelectContent>
                      {locks.map(lock => (
                        <SelectItem key={lock.id} value={lock.id}>
                          {lock.lock_name} {lock.unit_number && `(${lock.unit_number})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Date Range */}
            {(formData.schedule_type === 'temporary' || formData.schedule_type === 'one_time') && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Date Range
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleChange('start_date', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleChange('end_date', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Days of Week */}
            {(formData.schedule_type === 'recurring' || formData.schedule_type === 'permanent') && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Days of Week
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {daysOfWeek.map(day => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.value}
                        checked={formData.days_of_week.includes(day.value)}
                        onCheckedChange={() => handleDayToggle(day.value)}
                      />
                      <Label htmlFor={day.value} className="text-sm font-medium">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time Slots */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Time Slots
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTimeSlot}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Slot
                </Button>
              </div>
              <div className="space-y-3">
                {formData.time_slots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Start Time</Label>
                        <Input
                          type="time"
                          value={slot.start_time}
                          onChange={(e) => updateTimeSlot(index, 'start_time', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">End Time</Label>
                        <Input
                          type="time"
                          value={slot.end_time}
                          onChange={(e) => updateTimeSlot(index, 'end_time', e.target.value)}
                        />
                      </div>
                    </div>
                    {formData.time_slots.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeTimeSlot(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Additional Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_uses">Max Uses (Optional)</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    min="1"
                    value={formData.max_uses}
                    onChange={(e) => handleChange('max_uses', parseInt(e.target.value))}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-slate-900 hover:bg-slate-800"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : (schedule ? 'Update Schedule' : 'Create Schedule')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}