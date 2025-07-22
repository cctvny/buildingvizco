import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Users, Lock } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="flex gap-3 flex-wrap">
      <Link to={createPageUrl("Users")}>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
          <Users className="w-4 h-4 mr-2" />
          Manage Users
        </Button>
      </Link>
      <Link to={createPageUrl("Locks")}>
        <Button variant="outline" className="border-slate-300 hover:bg-slate-100">
          <Lock className="w-4 h-4 mr-2" />
          View Locks
        </Button>
      </Link>
    </div>
  );
}