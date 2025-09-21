import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Shield, Users, Key, Settings } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import ConfirmDeleteModal from '@/react-app/components/crm/ConfirmDeleteModal';

interface Role {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  user_count: number;
  permission_count: number;
  created_at: string;
  updated_at: string;
}

interface Permission {
  id: number;
  name: string;
  description: string;
  module: string;
  action: string;
  resource: string;
}

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [{ data: rolesData }, { data: perms }] = await Promise.all([
        supabase.from('roles').select('*').order('created_at', { ascending: false }),
        supabase.from('permissions').select('*')
      ]);
      setRoles((rolesData || []).map((r: any) => ({ ...r, user_count: r.user_count || 0, permission_count: r.permission_count || 0 })));
      setPermissions((perms || []) as Permission[]);
    } catch (e) {
      console.error('Error loading roles/perms', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRole = () => {
    setEditingRole(null);
    setShowAddModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowAddModal(true);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const handleDeleteRole = (roleId: number) => setConfirmDeleteId(roleId);
  const doDelete = async () => {
    if (!confirmDeleteId) return;
    await supabase.from('roles').delete().eq('id', confirmDeleteId);
    setConfirmDeleteId(null);
    fetchData();
  };

  const handleToggleRoleStatus = (roleId: number) => {
    setRoles(roles.map(r => 
      r.id === roleId ? { ...r, is_active: !r.is_active } : r
    ));
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setShowPermissionsModal(true);
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Manager': return 'bg-green-100 text-green-800';
      case 'Employee': return 'bg-blue-100 text-blue-800';
      case 'Sales Rep': return 'bg-orange-100 text-orange-800';
      case 'HR Manager': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        <h2 className="text-xl font-semibold text-gray-900">Role Management</h2>
        <button
          onClick={handleAddRole}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Role
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role.name)}`}>
                    {role.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{role.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEditRole(role)}
                  className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Users</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{role.user_count}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Permissions</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{role.permission_count}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <button
                  onClick={() => handleToggleRoleStatus(role.id)}
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                    role.is_active 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {role.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Updated</span>
                <span>{formatDate(role.updated_at)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleManagePermissions(role)}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Settings size={16} />
                Manage Permissions
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Role Modal */}
      {showAddModal && (
        <RoleModal
          role={editingRole}
          onClose={() => setShowAddModal(false)}
          onSave={async (role) => {
            if (editingRole) {
              await supabase.from('roles').update({ name: role.name, description: role.description, is_active: role.is_active, updated_at: new Date().toISOString() }).eq('id', role.id);
            } else {
              await supabase.from('roles').insert([{ name: role.name, description: role.description, is_active: role.is_active }]);
            }
            setShowAddModal(false);
            fetchData();
          }}
        />
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedRole && (
        <PermissionsModal
          role={selectedRole}
          permissions={permissions}
          onClose={() => setShowPermissionsModal(false)}
          onSave={async (updatedRole) => {
            await supabase.from('roles').update({ permission_count: updatedRole.permission_count, updated_at: new Date().toISOString() }).eq('id', updatedRole.id);
            setShowPermissionsModal(false);
            fetchData();
          }}
        />
      )}

      <ConfirmDeleteModal
        isOpen={confirmDeleteId !== null}
        title="Delete Role"
        message="Are you sure you want to delete this role?"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={doDelete}
      />
    </div>
  );
}

interface RoleModalProps {
  role: Role | null;
  onClose: () => void;
  onSave: (role: Role) => void;
}

function RoleModal({ role, onClose, onSave }: RoleModalProps) {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    is_active: role?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const roleData: Role = {
      id: role?.id || 0,
      ...formData,
      user_count: role?.user_count || 0,
      permission_count: role?.permission_count || 0,
      created_at: role?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(roleData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {role ? 'Edit Role' : 'Add New Role'}
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
              Role Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Active Role
            </label>
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
              {role ? 'Update' : 'Create'} Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface PermissionsModalProps {
  role: Role;
  permissions: Permission[];
  onClose: () => void;
  onSave: (role: Role) => void;
}

function PermissionsModal({ role, permissions, onClose, onSave }: PermissionsModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const handleTogglePermission = (permissionId: number) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = () => {
    const updatedRole = {
      ...role,
      permission_count: selectedPermissions.length,
      updated_at: new Date().toISOString()
    };
    onSave(updatedRole);
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Manage Permissions for {role.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
            <div key={module} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{module} Module</h4>
              <div className="space-y-2">
                {modulePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`permission-${permission.id}`}
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handleTogglePermission(permission.id)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`permission-${permission.id}`} className="ml-3 flex-1">
                      <div className="text-sm font-medium text-gray-700">{permission.name}</div>
                      <div className="text-xs text-gray-500">{permission.description}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
