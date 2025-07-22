import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Users as UsersIcon, 
  Search, 
  Filter,
  Plus,
  Mail,
  Phone,
  Building,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

import UserForm from "../components/users/UserForm";
import UserFilters from "../components/users/UserFilters";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    accessLevel: "all",
    building: "all"
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filters]);

  const loadUsers = async () => {
    try {
      const userData = await User.list('-created_date');
      setUsers(userData);
    } catch (error) {
      console.error("Error loading users:", error);
    }
    setLoading(false);
  };

  const filterUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apartment_unit?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status === "all" || user.status === filters.status;
      const matchesAccessLevel = filters.accessLevel === "all" || user.access_level === filters.accessLevel;
      const matchesBuilding = filters.building === "all" || user.building_id === filters.building;

      return matchesSearch && matchesStatus && matchesAccessLevel && matchesBuilding;
    });

    setFilteredUsers(filtered);
  };

  const handleUserSave = async (userData) => {
    if (editingUser) {
      await User.update(editingUser.id, userData);
    } else {
      await User.create(userData);
    }
    setShowUserForm(false);
    setEditingUser(null);
    loadUsers();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccessLevelColor = (level) => {
    switch (level) {
      case 'super_admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'property_manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resident': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <UsersIcon className="w-8 h-8" />
              User Management
            </h1>
            <p className="text-slate-600">Manage residents and property staff access</p>
          </div>
          <Button 
            onClick={() => setShowUserForm(true)}
            className="bg-slate-900 hover:bg-slate-800 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name, email, or unit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300"
                />
              </div>
              <UserFilters 
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-slate-900">User</TableHead>
                    <TableHead className="font-semibold text-slate-900">Contact</TableHead>
                    <TableHead className="font-semibold text-slate-900">Unit</TableHead>
                    <TableHead className="font-semibold text-slate-900">Access Level</TableHead>
                    <TableHead className="font-semibold text-slate-900">Status</TableHead>
                    <TableHead className="font-semibold text-slate-900">Move In</TableHead>
                    <TableHead className="font-semibold text-slate-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i} className="border-slate-100">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                              <div className="h-3 w-32 bg-slate-200 rounded animate-pulse" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><div className="h-4 w-20 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-16 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-6 w-24 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-6 w-20 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-20 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-8 w-16 bg-slate-200 rounded animate-pulse" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                              <span className="text-slate-600 font-semibold text-sm">
                                {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{user.full_name || 'N/A'}</p>
                              <p className="text-sm text-slate-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.phone_number ? (
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Phone className="w-3 h-3" />
                              {user.phone_number}
                            </div>
                          ) : (
                            <span className="text-slate-400">No phone</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Building className="w-3 h-3 text-slate-400" />
                            {user.apartment_unit || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getAccessLevelColor(user.access_level)}>
                            {user.access_level?.replace('_', ' ') || 'resident'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(user.status)}>
                            {user.status || 'active'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.move_in_date ? (
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(user.move_in_date), 'MMM d, yyyy')}
                            </div>
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingUser(user);
                              setShowUserForm(true);
                            }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* User Form Modal */}
        {showUserForm && (
          <UserForm
            user={editingUser}
            onSave={handleUserSave}
            onCancel={() => {
              setShowUserForm(false);
              setEditingUser(null);
            }}
          />
        )}
      </div>
    </div>
  );
}