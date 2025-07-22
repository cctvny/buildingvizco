import React, { useState, useEffect } from "react";
import { Credential, User, Lock } from "@/api/entities";
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
  CreditCard, 
  Search, 
  Plus,
  Key,
  Fingerprint,
  Smartphone,
  Hash,
  Calendar,
  Trash2,
  Power
} from "lucide-react";
import { format } from "date-fns";

import CredentialForm from "../components/credentials/CredentialForm";
import CredentialFilters from "../components/credentials/CredentialFilters";
import TTLockManager from "../components/credentials/TTLockManager";

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState([]);
  const [filteredCredentials, setFilteredCredentials] = useState([]);
  const [users, setUsers] = useState([]);
  const [locks, setLocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCredentialForm, setShowCredentialForm] = useState(false);
  const [editingCredential, setEditingCredential] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    user: "all",
    lock: "all"
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCredentials();
  }, [credentials, searchTerm, filters]);

  const loadData = async () => {
    try {
      const [credentialData, userData, lockData] = await Promise.all([
        Credential.list('-created_date'),
        User.list(),
        Lock.list()
      ]);
      setCredentials(credentialData);
      setUsers(userData);
      setLocks(lockData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const filterCredentials = () => {
    let filtered = credentials.filter(credential => {
      const matchesSearch = 
        credential.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        credential.credential_value?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filters.type === "all" || credential.credential_type === filters.type;
      const matchesStatus = filters.status === "all" || credential.status === filters.status;
      const matchesUser = filters.user === "all" || credential.user_id === filters.user;
      const matchesLock = filters.lock === "all" || credential.lock_id === filters.lock;

      return matchesSearch && matchesType && matchesStatus && matchesUser && matchesLock;
    });

    setFilteredCredentials(filtered);
  };

  const handleCredentialSave = async (credentialData) => {
    try {
      if (editingCredential) {
        await Credential.update(editingCredential.id, credentialData);
      } else {
        await Credential.create(credentialData);
      }
      setShowCredentialForm(false);
      setEditingCredential(null);
      loadData();
    } catch (error) {
      console.error("Error saving credential:", error);
    }
  };

  const handleToggleStatus = async (credential) => {
    const newStatus = credential.status === 'active' ? 'inactive' : 'active';
    await Credential.update(credential.id, { status: newStatus });
    loadData();
  };

  const handleDeleteCredential = async (credential) => {
    if (window.confirm(`Are you sure you want to delete "${credential.name}"?`)) {
      await Credential.delete(credential.id);
      loadData();
    }
  };

  const getCredentialIcon = (type) => {
    switch (type) {
      case 'pin': return <Hash className="w-4 h-4 text-blue-600" />;
      case 'rfid_card': return <CreditCard className="w-4 h-4 text-purple-600" />;
      case 'rfid_fob': return <Key className="w-4 h-4 text-green-600" />;
      case 'fingerprint': return <Fingerprint className="w-4 h-4 text-orange-600" />;
      case 'app_key': return <Smartphone className="w-4 h-4 text-cyan-600" />;
      default: return <Key className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCredentialTypeColor = (type) => {
    switch (type) {
      case 'pin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rfid_card': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rfid_fob': return 'bg-green-100 text-green-800 border-green-200';
      case 'fingerprint': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'app_key': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'revoked': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.full_name || user?.email || 'Unknown User';
  };

  const getLockName = (lockId) => {
    const lock = locks.find(l => l.id === lockId);
    return lock?.lock_name || 'Unknown Lock';
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <CreditCard className="w-8 h-8" />
              Credential Management
            </h1>
            <p className="text-slate-600">Manage RFID cards, PIN codes, and access credentials</p>
          </div>
          <Button 
            onClick={() => setShowCredentialForm(true)}
            className="bg-slate-900 hover:bg-slate-800 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Credential
          </Button>
        </div>

        {/* TTLock Integration Status */}
        <TTLockManager />

        {/* Search and Filters */}
        <Card className="mb-6 bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search credentials by name or value..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300"
                />
              </div>
              <CredentialFilters 
                filters={filters}
                onFiltersChange={setFilters}
                users={users}
                locks={locks}
              />
            </div>
          </CardContent>
        </Card>

        {/* Credentials Table */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">
              Access Credentials ({filteredCredentials.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-semibold text-slate-900">Credential</TableHead>
                    <TableHead className="font-semibold text-slate-900">Type</TableHead>
                    <TableHead className="font-semibold text-slate-900">User</TableHead>
                    <TableHead className="font-semibold text-slate-900">Lock</TableHead>
                    <TableHead className="font-semibold text-slate-900">Status</TableHead>
                    <TableHead className="font-semibold text-slate-900">Valid Until</TableHead>
                    <TableHead className="font-semibold text-slate-900">Usage</TableHead>
                    <TableHead className="font-semibold text-slate-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i} className="border-slate-100">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse" />
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                              <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><div className="h-6 w-20 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-24 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-24 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-6 w-16 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-20 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-4 w-12 bg-slate-200 rounded animate-pulse" /></TableCell>
                        <TableCell><div className="h-8 w-20 bg-slate-200 rounded animate-pulse" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredCredentials.map((credential) => (
                      <TableRow key={credential.id} className="border-slate-100 hover:bg-slate-50">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                              {getCredentialIcon(credential.credential_type)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{credential.name}</p>
                              <p className="text-sm text-slate-500">
                                {credential.credential_type === 'pin' ? '••••' : credential.credential_value}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCredentialTypeColor(credential.credential_type)}>
                            {credential.credential_type?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-slate-900">
                            {getUserName(credential.user_id)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-slate-600">
                            {getLockName(credential.lock_id)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(credential.status)}>
                            {credential.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {credential.valid_until ? (
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(credential.valid_until), 'MMM d, yyyy')}
                            </div>
                          ) : (
                            <span className="text-slate-400">Permanent</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {credential.usage_count || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(credential)}
                              className="text-xs"
                            >
                              <Power className="w-3 h-3 mr-1" />
                              {credential.status === 'active' ? 'Disable' : 'Enable'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCredential(credential)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Credential Form Modal */}
        {showCredentialForm && (
          <CredentialForm
            credential={editingCredential}
            users={users}
            locks={locks}
            onSave={handleCredentialSave}
            onCancel={() => {
              setShowCredentialForm(false);
              setEditingCredential(null);
            }}
          />
        )}
      </div>
    </div>
  );
}