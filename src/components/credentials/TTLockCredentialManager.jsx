import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Hash, 
  Key,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Plus
} from "lucide-react";

export default function TTLockCredentialManager({ lock, user, onCredentialCreated }) {
  const [credentialType, setCredentialType] = useState('pin');
  const [credentialData, setCredentialData] = useState({
    pin: '',
    startDate: '',
    endDate: '',
    keyName: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, success, error
  const [message, setMessage] = useState('');

  const handleCreateCredential = async () => {
    setIsCreating(true);
    setStatus('idle');
    
    try {
      // In real implementation, this would call TTLock API
      // Example API calls:
      // - Create PIN: POST /v3/key/add (keyType: 2)
      // - Create RFID: POST /v3/key/add (keyType: 1) 
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Simulate successful creation
      const mockResponse = {
        keyId: Date.now(),
        keyType: credentialType === 'pin' ? 2 : 1,
        keyName: credentialData.keyName,
        startDate: new Date(credentialData.startDate).getTime(),
        endDate: new Date(credentialData.endDate).getTime()
      };
      
      // Save to our local database
      const credentialPayload = {
        user_id: user.id,
        lock_id: lock.id,
        credential_type: credentialType,
        credential_value: credentialType === 'pin' ? credentialData.pin : 'RFID_CARD_ID',
        ttlock_credential_id: mockResponse.keyId.toString(),
        name: credentialData.keyName,
        status: 'active',
        valid_from: credentialData.startDate,
        valid_until: credentialData.endDate
      };
      
      setStatus('success');
      setMessage(`${credentialType.toUpperCase()} credential created successfully!`);
      onCredentialCreated?.(credentialPayload);
      
      // Reset form
      setCredentialData({ pin: '', startDate: '', endDate: '', keyName: '' });
      
    } catch (error) {
      setStatus('error');
      setMessage('Failed to create credential. Please try again.');
    }
    
    setIsCreating(false);
  };

  return (
    <Card className="mb-6 bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Create TTLock Credential
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Credential Type Selection */}
        <div className="space-y-2">
          <Label>Credential Type</Label>
          <Select value={credentialType} onValueChange={setCredentialType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pin">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  PIN Code
                </div>
              </SelectItem>
              <SelectItem value="rfid_card">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  RFID Card
                </div>
              </SelectItem>
              <SelectItem value="rfid_fob">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  RFID Fob
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Credential Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Credential Name</Label>
            <Input
              value={credentialData.keyName}
              onChange={(e) => setCredentialData(prev => ({...prev, keyName: e.target.value}))}
              placeholder="e.g., John's Access Key"
            />
          </div>
          
          {credentialType === 'pin' && (
            <div className="space-y-2">
              <Label>PIN Code (4-8 digits)</Label>
              <Input
                type="password"
                value={credentialData.pin}
                onChange={(e) => setCredentialData(prev => ({...prev, pin: e.target.value}))}
                placeholder="Enter PIN"
                maxLength={8}
              />
            </div>
          )}
        </div>

        {/* Validity Period */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Valid From</Label>
            <Input
              type="datetime-local"
              value={credentialData.startDate}
              onChange={(e) => setCredentialData(prev => ({...prev, startDate: e.target.value}))}
            />
          </div>
          <div className="space-y-2">
            <Label>Valid Until</Label>
            <Input
              type="datetime-local"
              value={credentialData.endDate}
              onChange={(e) => setCredentialData(prev => ({...prev, endDate: e.target.value}))}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleCreateCredential}
          disabled={isCreating || !credentialData.keyName || (credentialType === 'pin' && !credentialData.pin)}
          className="bg-slate-900 hover:bg-slate-800"
        >
          {isCreating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Creating in TTLock...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create {credentialType.replace('_', ' ').toUpperCase()}
            </>
          )}
        </Button>

        {/* Status Messages */}
        {status === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This will create the credential directly in your TTLock system and sync it to this portal.
            {credentialType === 'rfid_card' && ' For RFID cards, you\'ll need to present the card to the lock after creation.'}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}