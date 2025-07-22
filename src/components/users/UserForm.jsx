import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, User, Save } from "lucide-react";

export default function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    apartment_unit: user?.apartment_unit || "",
    building_id: user?.building_id || "",
    access_level: user?.access_level || "resident",
    status: user?.status || "active",
    move_in_date: user?.move_in_date || "",
    emergency_contact: user?.emergency_contact || ""
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
            <User className="w-5 h-5" />
            {user ? 'Edit User' : 'Add New User'}
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
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => handleChange('phone_number', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Emergency Contact</Label>
                  <Input
                    id="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={(e) => handleChange('emergency_contact', e.target.value)}
                    placeholder="Emergency contact info"
                  />
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Property Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apartment_unit">Apartment Unit</Label>
                  <Input
                    id="apartment_unit"
                    value={formData.apartment_unit}
                    onChange={(e) => handleChange('apartment_unit', e.target.value)}
                    placeholder="e.g., 2A, 101, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="building_id">Building ID</Label>
                  <Input
                    id="building_id"
                    value={formData.building_id}
                    onChange={(e) => handleChange('building_id', e.target.value)}
                    placeholder="Building identifier"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="move_in_date">Move In Date</Label>
                  <Input
                    id="move_in_date"
                    type="date"
                    value={formData.move_in_date}
                    onChange={(e) => handleChange('move_in_date', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Access & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Access & Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="access_level">Access Level</Label>
                  <Select
                    value={formData.access_level}
                    onValueChange={(value) => handleChange('access_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resident">Resident</SelectItem>
                      <SelectItem value="property_manager">Property Manager</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="suspended">Suspended</SelectItem>
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
                {loading ? 'Saving...' : (user ? 'Update User' : 'Create User')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}