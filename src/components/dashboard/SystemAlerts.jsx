import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Battery, Wifi, ChevronRight } from "lucide-react";

const getAlertIcon = (type) => {
  switch (type) {
    case 'warning': return <Battery className="w-5 h-5 text-orange-600" />;
    case 'error': return <Wifi className="w-5 h-5 text-red-600" />;
    default: return <AlertTriangle className="w-5 h-5 text-slate-600" />;
  }
};

const getAlertColor = (type) => {
  switch (type) {
    case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'error': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export default function SystemAlerts({ alerts, loading }) {
  if (loading) {
    return (
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">System Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-slate-600 font-medium">All systems operational</p>
              <p className="text-sm text-slate-500">No alerts at this time</p>
            </div>
          ) : (
            alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors duration-200"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  alert.type === 'warning' ? 'bg-orange-100' : 'bg-red-100'
                }`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{alert.title}</p>
                  <p className="text-sm text-slate-500">{alert.message}</p>
                </div>
                <Badge variant="outline" className={getAlertColor(alert.type)}>
                  {alert.count}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}