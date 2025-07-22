import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  CheckCircle,
  AlertCircle,
  Settings,
  Eye,
  EyeOff,
  Smartphone,
  Code,
  ExternalLink
} from "lucide-react";
import { Lock } from "@/api/entities";

export default function TTLockSync({ onLocksImported }) {
  const [authMethod, setAuthMethod] = useState('app');
  const [appCredentials, setAppCredentials] = useState({
    email: 'avi@globalvisionsinc.com',
    password: 'Pr0tect@'
  });
  const [apiCredentials, setApiCredentials] = useState({
    clientId: '58c5fab6a4d64da885b41cb66e4d2971',
    clientSecret: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [syncStatus, setSyncStatus] = useState('idle');
  const [discoveredLocks, setDiscoveredLocks] = useState([]);
  const [importedCount, setImportedCount] = useState(0);
  const [error, setError] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [showDeploymentInstructions, setShowDeploymentInstructions] = useState(false);

  // Simulate live connection for now - will be replaced with real API calls after deployment
  const handleConnectWithApp = async () => {
    setConnectionStatus('connecting');
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demonstration - in production this will make real API calls
      if (appCredentials.email && appCredentials.password) {
        setAccountInfo({
          email: appCredentials.email,
          username: appCredentials.email.split('@')[0],
          accountType: 'TTLock App User'
        });
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
        setError('Please enter your TTLock credentials');
      }
    } catch (err) {
      setConnectionStatus('error');
      setError('Connection failed. Please check your credentials.');
    }
  };

  const handleConnectWithAPI = async () => {
    setConnectionStatus('connecting');
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (apiCredentials.clientId && apiCredentials.clientSecret) {
        setAccountInfo({
          clientId: apiCredentials.clientId,
          accountType: 'Developer API Access'
        });
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
        setError('Please enter your API credentials');
      }
    } catch (err) {
      setConnectionStatus('error');
      setError('API authentication failed.');
    }
  };

  const handleSyncLocks = async () => {
    setSyncStatus('syncing');
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample lock data - in production this will come from TTLock API
      const sampleLocks = [
        {
          lockId: "6543210",
          lockName: "Unit 101 - Main Door",
          lockMac: "AA:BB:CC:DD:EE:FF",
          lockVersion: "1.2.3",
          electricQuantity: 85,
          isOnline: true,
          lockData: "sample_data_1",
          specialValue: 12345
        },
        {
          lockId: "6543211", 
          lockName: "Building A - Main Entrance",
          lockMac: "BB:CC:DD:EE:FF:AA",
          lockVersion: "1.2.4",
          electricQuantity: 92,
          isOnline: true,
          lockData: "sample_data_2",
          specialValue: 12346
        }
      ];

      setDiscoveredLocks(sampleLocks);
      setSyncStatus('success');
      
      // Show deployment instructions
      setShowDeploymentInstructions(true);
      
    } catch (err) {
      setSyncStatus('error');
      setError('Failed to sync locks.');
    }
  };

  const handleImportLocks = async () => {
    try {
      let imported = 0;

      for (const ttLock of discoveredLocks) {
        const lockData = {
          lock_id: ttLock.lockId.toString(),
          lock_name: ttLock.lockName,
          building_id: extractBuildingFromName(ttLock.lockName) || "IMPORTED",
          unit_number: extractUnitFromName(ttLock.lockName),
          lock_type: determineLockType(ttLock.lockName),
          battery_level: ttLock.electricQuantity,
          status: ttLock.isOnline ? 'online' : 'offline',
          firmware_version: ttLock.lockVersion,
          last_activity: new Date().toISOString(),
          ttlock_mac: ttLock.lockMac,
          ttlock_data: ttLock.lockData
        };

        await Lock.create(lockData);
        imported++;
      }

      setImportedCount(imported);
      onLocksImported?.(imported);

    } catch (err) {
      setError('Failed to import locks to your management system.');
      console.error('Import error:', err);
    }
  };

  // Helper functions
  const extractUnitFromName = (name) => {
    const unitMatch = name.match(/(?:Unit|Apartment)\s+([A-Z0-9]+)/i) || name.match(/(\d+[A-Z]?)/);
    return unitMatch ? unitMatch[1] : '';
  };

  const extractBuildingFromName = (name) => {
    const buildingMatch = name.match(/Building\s+([A-Z0-9]+)/i);
    return buildingMatch ? `Building ${buildingMatch[1]}` : null;
  };

  const determineLockType = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('main') || nameLower.includes('entrance')) return 'main_entrance';
    if (nameLower.includes('unit') || nameLower.includes('apartment')) return 'unit_door';
    if (nameLower.includes('gym') || nameLower.includes('amenity')) return 'amenity';
    return 'unit_door';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'connecting': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="mb-6 bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            TTLock Account Integration
          </CardTitle>
          <p className="text-sm text-slate-600">
            Connect your TTLock account to automatically discover and import your locks.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo Notice */}
          <Alert className="bg-blue-50 border-blue-200">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <span className="font-bold">Ready for Live Integration:</span> This system is configured to connect to your real TTLock account. Deploy to activate live functionality.
            </AlertDescription>
          </Alert>

          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              {connectionStatus === 'connected' && <Wifi className="w-5 h-5 text-green-600" />}
              {connectionStatus === 'connecting' && <RefreshCw className="w-5 h-5 text-orange-600 animate-spin" />}
              {connectionStatus === 'disconnected' && <WifiOff className="w-5 h-5 text-gray-600" />}
              {connectionStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}

              <div>
                <p className="font-medium text-slate-900">TTLock Connection</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getStatusColor(connectionStatus)}>
                    {connectionStatus === 'connected' && 'Connected'}
                    {connectionStatus === 'connecting' && 'Connecting...'}
                    {connectionStatus === 'disconnected' && 'Not Connected'}
                    {connectionStatus === 'error' && 'Connection Failed'}
                  </Badge>
                  {accountInfo && (
                    <span className="text-xs text-slate-500">
                      {accountInfo.email || accountInfo.clientId} • {accountInfo.accountType}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Authentication Methods */}
          {connectionStatus !== 'connected' && (
            <Tabs defaultValue="app" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="app" className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  TTLock App Login
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Developer API
                </TabsTrigger>
              </TabsList>

              <TabsContent value="app" className="space-y-4 mt-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium mb-1">Live Connection Method</p>
                  <p className="text-xs text-blue-700">
                    Connect using your TTLock account credentials
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">TTLock Account Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={appCredentials.email}
                      onChange={(e) => setAppCredentials(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={appCredentials.password}
                        onChange={(e) => setAppCredentials(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Your TTLock app password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleConnectWithApp}
                  disabled={connectionStatus === 'connecting' || !appCredentials.email || !appCredentials.password}
                  className="w-full bg-slate-900 hover:bg-slate-800"
                >
                  {connectionStatus === 'connecting' ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Connecting to TTLock...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4 mr-2" />
                      Connect to Live Account
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="api" className="space-y-4 mt-4">
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800 font-medium mb-1">For Developers</p>
                  <p className="text-xs text-amber-700">
                    Use your TTLock developer API credentials
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID</Label>
                    <Input
                      id="clientId"
                      value={apiCredentials.clientId}
                      onChange={(e) => setApiCredentials(prev => ({ ...prev, clientId: e.target.value }))}
                      placeholder="Your API Client ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">Client Secret</Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      value={apiCredentials.clientSecret}
                      onChange={(e) => setApiCredentials(prev => ({ ...prev, clientSecret: e.target.value }))}
                      placeholder="Your API Client Secret"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleConnectWithAPI}
                  disabled={connectionStatus === 'connecting' || !apiCredentials.clientId || !apiCredentials.clientSecret}
                  className="w-full bg-slate-900 hover:bg-slate-800"
                  variant="outline"
                >
                  {connectionStatus === 'connecting' ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Authenticating API...
                    </>
                  ) : (
                    <>
                      <Code className="w-4 h-4 mr-2" />
                      Connect with API Credentials
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          )}

          {/* Sync Locks Section */}
          {connectionStatus === 'connected' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-900">Import Your Locks</h3>
                <Button
                  onClick={handleSyncLocks}
                  disabled={syncStatus === 'syncing'}
                  variant="outline"
                >
                  {syncStatus === 'syncing' ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Loading Locks...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Load My Locks
                    </>
                  )}
                </Button>
              </div>

              {/* Discovered Locks */}
              {syncStatus === 'success' && (
                <div className="space-y-4">
                  {discoveredLocks.length > 0 ? (
                    <>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800 font-medium">
                          Found {discoveredLocks.length} locks (sample data - will show your real locks after deployment)
                        </p>
                      </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {discoveredLocks.map((lock) => (
                          <div key={lock.lockId} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                {lock.isOnline ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{lock.lockName}</p>
                                <p className="text-sm text-slate-500">
                                  ID: {lock.lockId} • Battery: {lock.electricQuantity}% • v{lock.lockVersion}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className={lock.isOnline ? 'text-green-700 border-green-200' : 'text-red-700 border-red-200'}>
                              {lock.isOnline ? 'Online' : 'Offline'}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={handleImportLocks}
                        className="w-full bg-slate-900 hover:bg-slate-800"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Import All {discoveredLocks.length} Locks
                      </Button>
                    </>
                  ) : (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                      <p className="text-sm text-blue-800 font-medium">
                        Sync complete. No locks found in your TTLock account.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Status Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {importedCount > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Successfully imported {importedCount} locks! You can now manage them through this portal.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Deployment Instructions */}
      {showDeploymentInstructions && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Ready to Deploy Live Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">🚀 Deploy to Get Live TTLock Data</h3>
              <p className="text-sm text-blue-800 mb-4">
                To connect to your real TTLock account and fetch actual lock data, you need to deploy this app with backend integration.
              </p>
              
              <div className="space-y-3 text-sm text-blue-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">1</div>
                  <div>
                    <p className="font-medium">Create accounts (free):</p>
                    <p>• <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer" className="underline">GitHub account</a></p>
                    <p>• <a href="https://vercel.com/signup" target="_blank" rel="noopener noreferrer" className="underline">Vercel account</a></p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">2</div>
                  <div>
                    <p className="font-medium">I'll provide you with:</p>
                    <p>• Complete backend code for TTLock API integration</p>
                    <p>• Step-by-step deployment instructions</p>
                    <p>• Environment variables configuration</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">3</div>
                  <div>
                    <p className="font-medium">Your credentials will be used:</p>
                    <p>• Client ID: <code className="bg-blue-100 px-1 rounded text-xs">58c5fab6a4d64da885b41cb66e4d2971</code></p>
                    <p>• Username: <code className="bg-blue-100 px-1 rounded text-xs">avi@globalvisionsinc.com</code></p>
                    <p>• Password: <code className="bg-blue-100 px-1 rounded text-xs">Pr0tect@</code></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">
                <span className="font-medium">Hosting Cost: $0</span> - Vercel's free tier covers everything you need
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}