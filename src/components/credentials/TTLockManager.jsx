
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Settings, 
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function TTLockManager() {
  const [apiStatus, setApiStatus] = useState('connecting');
  const [lastSync, setLastSync] = useState(null);
  const [syncInProgress, setSyncInProgress] = useState(false);

  useEffect(() => {
    // Simulate API connection check
    const checkApiStatus = () => {
      // In real implementation, this would check TTLock API connectivity
      setTimeout(() => {
        setApiStatus('connected');
        setLastSync(new Date());
      }, 2000);
    };

    checkApiStatus();
  }, []);

  const handleSync = async () => {
    setSyncInProgress(true);
    try {
      // In real implementation, this would:
      // 1. Fetch all locks from TTLock API
      // 2. Sync credentials with TTLock
      // 3. Update local database
      
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      setLastSync(new Date());
    } catch (error) {
      console.error('Sync failed:', error);
    }
    setSyncInProgress(false);
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'connected': return <Wifi className="w-4 h-4 text-green-600" />;
      case 'disconnected': return <WifiOff className="w-4 h-4 text-red-600" />;
      case 'connecting': return <RefreshCw className="w-4 h-4 text-orange-600 animate-spin" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected': return 'bg-red-100 text-red-800 border-red-200';
      case 'connecting': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="mb-6 bg-white border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          TTLock Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="font-medium text-slate-900">API Status:</span>
              <Badge variant="outline" className={getStatusColor()}>
                {apiStatus === 'connected' && 'Connected'}
                {apiStatus === 'disconnected' && 'Disconnected'}
                {apiStatus === 'connecting' && 'Connecting'}
              </Badge>
            </div>
            {lastSync && (
              <div className="text-sm text-slate-600">
                Last sync: {lastSync.toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSync}
              disabled={syncInProgress || apiStatus !== 'connected'}
              className="flex items-center gap-2"
            >
              {syncInProgress ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Sync with TTLock
                </>
              )}
            </Button>
          </div>
        </div>

        {apiStatus === 'connected' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              TTLock API is connected. You can now create PIN codes, add RFID credentials, and manage access schedules directly through this portal.
            </AlertDescription>
          </Alert>
        )}

        {apiStatus === 'disconnected' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to connect to TTLock API. Please check your API credentials and network connection.
            </AlertDescription>
          </Alert>
        )}

        {apiStatus === 'connecting' && (
          <Alert>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Establishing connection to TTLock API...
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
