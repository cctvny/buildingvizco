
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X, CreditCard, Save, Calendar, RefreshCw } from "lucide-react";

export default function CredentialForm({ credential, users, locks, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: credential?.name || "",
    user_id: credential?.user_id || "",
    lock_id: credential?.lock_id || "",
    credential_type: credential?.credential_type || "pin",
    credential_value: credential?.credential_value || "",
    status: credential?.status || "active",
    valid_from: credential?.valid_from ? credential.valid_from.split('T')[0] : "",
    valid_until: credential?.valid_until ? credential.valid_until.split('T')[0] : "",
    has_expiry: !!credential?.valid_until
  });

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false); // Changed from generatingPin

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = { ...formData };
      delete submitData.has_expiry;
      
      if (!formData.has_expiry) {
        delete submitData.valid_until;
      }
      
      await onSave(submitData);
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

  const generateRandomValue = (type) => {
    setGenerating(true);
    let value = '';
    if (type.includes('pin')) { // Handles both 'pin' and 'one_time_pin'
      // Generate 6 digit PIN
      value = Math.floor(100000 + Math.random() * 900000).toString();
    } else if (type.includes('rfid')) { // Handles 'rfid_card' and 'rfid_fob'
      // Generate a random RFID-like hex string (8 characters for consistency)
      value = Array.from({length: 8}, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    }
    setFormData(prev => ({ ...prev, credential_value: value }));
    setTimeout(() => setGenerating(false), 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <CreditCard className="w-5 h-5" />
            {credential ? 'Edit Credential' : 'Add New Credential'}
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
                Credential Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Credential Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., John's Access Card"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credential_type">Type</Label>
                  <Select
                    value={formData.credential_type}
                    onValueChange={(value) => handleChange('credential_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select credential type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pin">PIN Code (Permanent)</SelectItem>
                      <SelectItem value="one_time_pin">PIN Code (One-Time)</SelectItem>
                      <SelectItem value="rfid_card">RFID Card</SelectItem>
                      <SelectItem value="rfid_fob">RFID Fob</SelectItem>
                      <SelectItem value="fingerprint">Fingerprint</SelectItem>
                      <SelectItem value="app_key">App Key (eKey)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Credential Value */}
              <div className="space-y-2">
                <Label htmlFor="credential_value">
                  {formData.credential_type.includes('pin') && 'PIN Code'}
                  {formData.credential_type.includes('rfid') && 'RFID ID'}
                  {formData.credential_type === 'fingerprint' && 'Fingerprint Template ID'}
                  {formData.credential_type === 'app_key' && 'App Key'}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="credential_value"
                    value={formData.credential_value}
                    onChange={(e) => handleChange('credential_value', e.target.value)}
                    placeholder={
                      formData.credential_type.includes('pin') ? 'e.g., 123456' :
                      formData.credential_type.includes('rfid') ? 'e.g., A1B2C3D4' :
                      'Enter value'
                    }
                    type={formData.credential_type.includes('pin') ? 'password' : 'text'}
                    maxLength={formData.credential_type.includes('pin') ? 8 : undefined}
                    required
                    readOnly={formData.credential_type === 'app_key'}
                  />
                  {(formData.credential_type.includes('pin') || formData.credential_type.includes('rfid')) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => generateRandomValue(formData.credential_type)}
                      disabled={generating}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
                      {generating ? 'Generating...' : 'Generate'}
                    </Button>
                  )}
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

            {/* Validity & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                Validity & Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_expiry"
                    checked={formData.has_expiry}
                    onCheckedChange={(checked) => handleChange('has_expiry', checked)}
                  />
                  <Label htmlFor="has_expiry" className="text-sm font-medium">
                    Set expiration date
                  </Label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valid_from">Valid From</Label>
                    <Input
                      id="valid_from"
                      type="date"
                      value={formData.valid_from}
                      onChange={(e) => handleChange('valid_from', e.target.value)}
                    />
                  </div>
                  {formData.has_expiry && (
                    <div className="space-y-2">
                      <Label htmlFor="valid_until">Valid Until</Label>
                      <Input
                        id="valid_until"
                        type="date"
                        value={formData.valid_until}
                        onChange={(e) => handleChange('valid_until', e.target.value)}
                      />
                    </div>
                  )}
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
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="revoked">Revoked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                {loading ? 'Saving...' : (credential ? 'Update Credential' : 'Create Credential')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
