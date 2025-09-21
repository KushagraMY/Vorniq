import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Key, Shield, Users, Package, Calculator, BarChart3, Settings } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface Permission {
  id: number;
  name: string;
  description: string;
  module: string;
  action: string;
  resource: string;
  created_at: string;
  roles_count: number;
}

const moduleIcons = {
  'CRM': Users,
  'HRM': Shield,
  'SIM': Package,
  'FINANCE': Calculator,
  'REPORTS': BarChart3,
  'SYSTEM': Settings,
};

const moduleColors = {
  'CRM': 'bg-purple-100 text-purple-800',
  'HRM': 'bg-green-100 text-green-800',
  'SIM': 'bg-orange-100 text-orange-800',
  'FINANCE': 'bg-blue-100 text-blue-800',
  'REPORTS': 'bg-indigo-100 text-indigo-800',
  'SYSTEM': 'bg-red-100 text-red-800',
};

export default function PermissionManagement() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('permissions').select('*').order('created_at', { ascending: false });
      setPermissions((data || []) as Permission[]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = filterModule === 'all' || permission.module === filterModule;
    const matchesAction = filterAction === 'all' || permission.action === filterAction;
    
    return matchesSearch && matchesModule && matchesAction;
  });

  const handleAddPermission = () => {
    setEditingPermission(null);
    setShowAddModal(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    setShowAddModal(true);
  };

  const handleDeletePermission = async (permissionId: number) => {
    await supabase.from('permissions').delete().eq('id', permissionId);
    fetchPermissions();
  };

  const modules = Array.from(new Set(permissions.map(p => p.module)));
  const actions = Array.from(new Set(permissions.map(p => p.action)));

  const getActionColor = (action: string) => {
    switch (action) {
      case 'VIEW': return 'bg-blue-100 text-blue-800';
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'EDIT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'PROCESS': return 'bg-purple-100 text-purple-800';
      case 'MANAGE': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Permission Management</h2>
        <button
          onClick={handleAddPermission}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Permission
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Modules</option>
                {modules.map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Actions</option>
                {actions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPermissions.map((permission) => {
                const ModuleIcon = moduleIcons[permission.module as keyof typeof moduleIcons] || Key;
                return (
                  <tr key={permission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${moduleColors[permission.module as keyof typeof moduleColors] || 'bg-gray-100 text-gray-600'}`}>
                            <ModuleIcon size={20} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {permission.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {permission.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${moduleColors[permission.module as keyof typeof moduleColors] || 'bg-gray-100 text-gray-800'}`}>
                        {permission.module}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(permission.action)}`}>
                        {permission.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {permission.resource}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{permission.roles_count}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditPermission(permission)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePermission(permission.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Permission Modal */}
      {showAddModal && (
        <PermissionModal
          permission={editingPermission}
          onClose={() => setShowAddModal(false)}
          onSave={async (permission) => {
            if (editingPermission) {
              await supabase.from('permissions').update({
                name: permission.name,
                description: permission.description,
                module: permission.module,
                action: permission.action,
                resource: permission.resource,
              }).eq('id', permission.id);
            } else {
              await supabase.from('permissions').insert([{ 
                name: permission.name,
                description: permission.description,
                module: permission.module,
                action: permission.action,
                resource: permission.resource,
              }]);
            }
            setShowAddModal(false);
            fetchPermissions();
          }}
        />
      )}
    </div>
  );
}

interface PermissionModalProps {
  permission: Permission | null;
  onClose: () => void;
  onSave: (permission: Permission) => void;
}

function PermissionModal({ permission, onClose, onSave }: PermissionModalProps) {
  const [formData, setFormData] = useState({
    name: permission?.name || '',
    description: permission?.description || '',
    module: permission?.module || 'CRM',
    action: permission?.action || 'VIEW',
    resource: permission?.resource || '',
  });

  const modules = ['CRM', 'HRM', 'SIM', 'FINANCE', 'REPORTS', 'SYSTEM'];
  const actions = ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'PROCESS', 'MANAGE'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const permissionData: Permission = {
      id: permission?.id || 0,
      ...formData,
      created_at: permission?.created_at || new Date().toISOString(),
      roles_count: permission?.roles_count || 0,
    };

    onSave(permissionData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {permission ? 'Edit Permission' : 'Add New Permission'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permission Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g., crm.customers.view"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
              placeholder="Describe what this permission allows"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Module
              </label>
              <select
                value={formData.module}
                onChange={(e) => setFormData({...formData, module: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {modules.map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action
              </label>
              <select
                value={formData.action}
                onChange={(e) => setFormData({...formData, action: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {actions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource
            </label>
            <input
              type="text"
              value={formData.resource}
              onChange={(e) => setFormData({...formData, resource: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g., customers, leads, products"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              {permission ? 'Update' : 'Create'} Permission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
