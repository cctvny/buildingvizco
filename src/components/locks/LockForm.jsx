import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Lock, Save } from "lucide-react";

export default function LockForm({ lock, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    lock_id: lock?.lock_id || "",
    lock_name: lock?.lock_name || "",
    building_id: lock?.building_id || "",
    unit_number: lock?.unit_number || "",
    lock_type: lock?.lock_type || "unit_door",
    status: lock?.status || "online",
    battery_level: lock?.battery_level || 100,
    firmware_version: lock?.firmware_version || ""
  });

  const [loading, setLoading] = useState(false);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Lock className="w-5 h-5" />
            {lock ? 'Edit Lock' : 'Add New Lock'}
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
                Lock Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lock_id">Lock ID</Label>
                  <Input
                    id="lock_id"
                    value={formData.lock_id}
                    onChange={(e) => handleChange('lock_id', e.target.value)}
                    placeholder="TTLock device ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lock_name">Lock Name</Label>
                  <Input
                    id="lock_name"
                    value={formData.lock_name}
                    onChange={(e) => handleChange('lock_name', e.target.value)}
                    placeholder="Descriptive lock name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lock_type">Lock Type</Label>
                  <Select
                    value={formData.lock_type}
                    onValueChange={(value) => handleChange('lock_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lock type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main_entrance">Main Entrance</SelectItem>
                      <SelectItem value="unit_door">Unit Door</SelectItem>
                      <SelectItem value="common_area">Common Area</SelectItem>
                      <SelectItem value="amenity">Amenity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firmware_version">Firmware Version</Label>
                  <Input
                    id="firmware_version"
                    value={formData.firmware_version}
                    onChange={(e) => handleChange('firmware_version', e.target.value)}
                    placeholder="e.g., 2.4.1"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Location Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="building_id">Building ID</Label>
                  <Input
                    id="building_id"
                    value={formData.building_id}
                    onChange={(e) => handleChange('building_id', e.target.value)}
                    placeholder="Building identifier"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit_number">Unit Number</Label>
                  <Input
                    id="unit_number"
                    value={formData.unit_number}
                    onChange={(e) => handleChange('unit_number', e.target.value)}
                    placeholder="e.g., 2A, 101, Main Lobby"
                  />
                </div>
              </div>
            </div>

            {/* Status & Battery */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Status & Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="low_battery">Low Battery</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="battery_level">Battery Level (%)</Label>
                  <Input
                    id="battery_level"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.battery_level}
                    onChange={(e) => handleChange('battery_level', parseInt(e.target.value))}
                    placeholder="Battery percentage"
                  />
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
                {loading ? 'Saving...' : (lock ? 'Update Lock' : 'Create Lock')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}