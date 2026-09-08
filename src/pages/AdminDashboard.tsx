import { useState, useEffect, useCallback } from 'react';
import { Users, AlertCircle, CheckCircle, Trash2, CreditCard as Edit2, Save, X, Search, RefreshCw, Droplets, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase, BLOOD_GROUPS, type Donor, type BloodRequest } from '../lib/supabase';

type Tab = 'donors' | 'requests';

interface EditingDonor {
  id: string;
  name: string;
  age: string;
  gender: string;
  blood_group: string;
  phone: string;
  email: string;
  city: string;
  last_donation: string;
  availability: string;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('donors');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditingDonor | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (!error && data) setDonors(data as Donor[]);
  }, []);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (!error && data) setRequests(data as BloodRequest[]);
  }, []);

  useEffect(() => {
    fetchDonors();
    fetchRequests();
  }, [fetchDonors, fetchRequests]);

  const callAdminApi = async (action: string, payload: unknown) => {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-operations`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ action, payload }),
    });
    return response.json();
  };

  const handleDeleteDonor = async (id: string) => {
    if (!window.confirm('Delete this donor record?')) return;
    const result = await callAdminApi('delete-donor', { id });
    if (!result.success) {
      showToast('Failed to delete donor.', 'error');
    } else {
      setDonors((prev) => prev.filter((d) => d.id !== id));
      showToast('Donor deleted successfully.', 'success');
    }
  };

  const handleToggleAvailability = async (id: string, current: boolean) => {
    const result = await callAdminApi('update-donor', {
      id,
      availability: !current,
      name: donors.find((d) => d.id === id)?.name || '',
      age: donors.find((d) => d.id === id)?.age || 0,
      gender: donors.find((d) => d.id === id)?.gender || '',
      blood_group: donors.find((d) => d.id === id)?.blood_group || '',
      phone: donors.find((d) => d.id === id)?.phone || '',
      email: donors.find((d) => d.id === id)?.email || '',
      city: donors.find((d) => d.id === id)?.city || '',
      last_donation: donors.find((d) => d.id === id)?.last_donation || null,
    });
    if (!result.success) {
      showToast('Failed to update availability.', 'error');
    } else {
      setDonors((prev) => prev.map((d) => d.id === id ? { ...d, availability: !current } : d));
      showToast('Availability updated.', 'success');
    }
  };

  const startEdit = (donor: Donor) => {
    setEditingId(donor.id);
    setEditForm({
      id: donor.id,
      name: donor.name,
      age: String(donor.age),
      gender: donor.gender,
      blood_group: donor.blood_group,
      phone: donor.phone,
      email: donor.email || '',
      city: donor.city,
      last_donation: donor.last_donation || '',
      availability: String(donor.availability),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async () => {
    if (!editForm) return;
    setSaving(true);
    const result = await callAdminApi('update-donor', {
      id: editForm.id,
      name: editForm.name,
      age: parseInt(editForm.age),
      gender: editForm.gender,
      blood_group: editForm.blood_group,
      phone: editForm.phone,
      email: editForm.email,
      city: editForm.city,
      last_donation: editForm.last_donation || null,
      availability: editForm.availability === 'true',
    });
    setSaving(false);

    if (!result.success) {
      showToast('Failed to save changes.', 'error');
    } else {
      setDonors((prev) => prev.map((d) => d.id === editForm.id ? {
        ...d,
        name: editForm.name,
        age: parseInt(editForm.age),
        gender: editForm.gender,
        blood_group: editForm.blood_group,
        phone: editForm.phone,
        email: editForm.email,
        city: editForm.city,
        last_donation: editForm.last_donation || null,
        availability: editForm.availability === 'true',
      } : d));
      setEditingId(null);
      setEditForm(null);
      showToast('Donor updated successfully.', 'success');
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!window.confirm('Delete this blood request?')) return;
    const result = await callAdminApi('delete-blood-request', { id });
    if (!result.success) {
      showToast('Failed to delete request.', 'error');
    } else {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      showToast('Request deleted.', 'success');
    }
  };

  const handleCompleteRequest = async (id: string) => {
    const result = await callAdminApi('update-request-status', { id, status: 'completed' });
    if (!result.success) {
      showToast('Failed to update request.', 'error');
    } else {
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: 'completed' } : r));
      showToast('Request marked as completed.', 'success');
    }
  };

  const filteredDonors = donors.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q) || d.phone.includes(q);
    const matchBg = !filterBloodGroup || d.blood_group === filterBloodGroup;
    return matchSearch && matchBg;
  });

  const stats = {
    totalDonors: donors.length,
    availableDonors: donors.filter((d) => d.availability).length,
    pendingRequests: requests.filter((r) => r.status === 'pending').length,
    urgentRequests: requests.filter((r) => r.urgency === 'urgent' && r.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage donors and blood requests</p>
          </div>
          <button
            onClick={() => { fetchDonors(); fetchRequests(); }}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Donors', value: stats.totalDonors, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Available Donors', value: stats.availableDonors, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Urgent Requests', value: stats.urgentRequests, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className={`${stat.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setTab('donors')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'donors' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Donors ({donors.length})
          </button>
          <button
            onClick={() => setTab('requests')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'requests' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Requests ({requests.length})
          </button>
        </div>

        {/* Donors Tab */}
        {tab === 'donors' && (
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, city, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <select
                value={filterBloodGroup}
                onChange={(e) => setFilterBloodGroup(e.target.value)}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-red-500 transition-colors bg-white"
              >
                <option value="">All Blood Groups</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Blood</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">City</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Age/Gender</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredDonors.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-gray-400">
                            <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                            No donors found
                          </td>
                        </tr>
                      ) : filteredDonors.map((donor) => (
                        editingId === donor.id && editForm ? (
                          <tr key={donor.id} className="bg-yellow-50 border-b border-yellow-100">
                            <td className="px-4 py-3" colSpan={7}>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-400" placeholder="Name" />
                                <input value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                                  type="number" className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-400" placeholder="Age" />
                                <select value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-400 bg-white">
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                </select>
                                <select value={editForm.blood_group} onChange={(e) => setEditForm({ ...editForm, blood_group: e.target.value })}
                                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-400 bg-white">
                                  {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                                </select>
                                <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-400" placeholder="Phone" />
                                <input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-400" placeholder="City" />
                                <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-400" placeholder="Email (optional)" />
                                <select value={editForm.availability} onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
                                  className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-400 bg-white">
                                  <option value="true">Available</option>
                                  <option value="false">Not Available</option>
                                </select>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={saveEdit} disabled={saving}
                                  className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 disabled:opacity-60">
                                  <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}
                                </button>
                                <button onClick={cancelEdit}
                                  className="flex items-center gap-1.5 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-300">
                                  <X className="w-3.5 h-3.5" /> Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-800">{donor.name}</td>
                            <td className="px-4 py-3">
                              <span className="bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-lg text-xs">{donor.blood_group}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{donor.phone}</td>
                            <td className="px-4 py-3 text-gray-600">{donor.city}</td>
                            <td className="px-4 py-3 text-gray-500">{donor.age} / {donor.gender}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleToggleAvailability(donor.id, donor.availability)}
                                className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                                  donor.availability
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                              >
                                {donor.availability ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {donor.availability ? 'Available' : 'Unavailable'}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => startEdit(donor)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit donor"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDonor(donor.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete donor"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {tab === 'requests' && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <div className="space-y-4">
                {requests.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No blood requests yet</p>
                  </div>
                ) : requests.map((req) => (
                  <div
                    key={req.id}
                    className={`bg-white rounded-2xl border shadow-sm p-5 md:p-6 ${
                      req.urgency === 'urgent' && req.status === 'pending'
                        ? 'border-red-200'
                        : 'border-gray-100'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          req.urgency === 'urgent' ? 'bg-red-100' : 'bg-blue-50'
                        }`}>
                          <span className={`font-bold text-sm ${req.urgency === 'urgent' ? 'text-red-600' : 'text-blue-600'}`}>
                            {req.blood_group}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-800">{req.patient_name}</p>
                            {req.urgency === 'urgent' && (
                              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                Urgent
                              </span>
                            )}
                            {req.status === 'completed' && (
                              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm mt-0.5">
                            {req.hospital} &bull; {req.city} &bull; {req.contact}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(req.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => handleCompleteRequest(req.id)}
                            className="flex items-center gap-1.5 bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Mark Done
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
