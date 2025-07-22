import React, { useState, useEffect } from "react";
import { Gateway, Lock } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Router, 
  Wifi, 
  WifiOff,
  Signal,
  Clock
} from "lucide-react";
import { format } from "date-fns";

export default function GatewaysPage() {
  const [gateways, setGateways] = useState([]);
  const [locks, setLocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gatewayData, lockData] = await Promise.all([
        Gateway.list('-created_date'),
        Lock.list()
      ]);
      setGateways(gatewayData);
      setLocks(lockData);
    } catch (error) {
      console.error("Error loading gateway data:", error);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusIcon = (status) => {
    return status === 'online' ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />;
  };
  
  const getLocksForGateway = (gatewayId) => {
    return locks.filter(lock => lock.gateway_id === gatewayId);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Router className="w-8 h-8" />
              Gateway Management
            </h1>
            <p className="text-slate-600">Monitor the status and connectivity of your TTLock gateways</p>
          </div>
        </div>

        {/* Gateways Table */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">
              Network Gateways ({gateways.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-slate-900">Gateway</TableHead>
                    <TableHead className="font-semibold text-slate-900">Status</TableHead>
                    <TableHead className="font-semibold text-slate-900">Network</TableHead>
                    <TableHead className="font-semibold text-slate-900">Connected Locks</TableHead>
                    <TableHead className="font-semibold text-slate-900">Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <TableRow key={i} className="border-slate-100">
                        <TableCell className="py-4"><div className="h-4 w-40 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-6 w-24 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-32 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-16 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-28 bg-slate-200 rounded animate-pulse" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    gateways.map((gateway) => (
                      <TableRow key={gateway.id} className="border-slate-100 hover:bg-slate-50">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                              <Router className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{gateway.gateway_name}</p>
                              <p className="text-sm text-slate-500">MAC: {gateway.gateway_mac}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(gateway.status)}
                            <Badge variant="outline" className={getStatusColor(gateway.status)}>
                              {gateway.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Signal className="w-4 h-4 text-slate-500" />
                            <span>{gateway.network_name || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-slate-800">
                            {getLocksForGateway(gateway.id).length}
                          </span>
                        </TableCell>
                        <TableCell>
                          {gateway.last_activity ? (
                             <div className="flex items-center gap-2 text-sm text-slate-600">
                               <Clock className="w-3 h-3" />
                               {format(new Date(gateway.last_activity), 'MMM d, yyyy HH:mm')}
                             </div>
                          ) : (
                            <span className="text-slate-400">Never</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}