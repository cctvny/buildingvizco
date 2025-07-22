import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Lock, Unlock, AlertTriangle, User } from "lucide-react";
import { format } from "date-fns";

const getActivityIcon = (type) => {
  switch (type) {
    case 'unlock': return <Unlock className="w-4 h-4 text-green-600" />;
    case 'lock': return <Lock className="w-4 h-4 text-blue-600" />;
    case 'failed_attempt': return <AlertTriangle className="w-4 h-4 text-red-600" />;
    default: return <Activity className="w-4 h-4 text-slate-600" />;
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'unlock': return 'bg-green-100 text-green-800 border-green-200';
    case 'lock': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'failed_attempt': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export default function RecentActivity({ activities, loading }) {
  if (loading) {
    return (
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
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
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No recent activity</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {activity.activity_type === 'unlock' && 'Lock accessed'}
                    {activity.activity_type === 'lock' && 'Lock secured'}
                    {activity.activity_type === 'failed_attempt' && 'Access denied'}
                    {activity.activity_type === 'battery_low' && 'Low battery alert'}
                    {activity.activity_type === 'offline' && 'Device offline'}
                  </p>
                  <p className="text-sm text-slate-500">
                    Lock ID: {activity.lock_id} • {activity.timestamp ? format(new Date(activity.timestamp), 'MMM d, HH:mm') : 'Recently'}
                  </p>
                </div>
                <Badge variant="outline" className={getActivityColor(activity.activity_type)}>
                  {activity.activity_type.replace('_', ' ')}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}