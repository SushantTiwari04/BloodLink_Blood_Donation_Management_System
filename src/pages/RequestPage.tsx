import { useState } from 'react';
import { AlertCircle, CheckCircle, Phone, Building, MapPin, Droplets, Zap } from 'lucide-react';
import { supabase, BLOOD_GROUPS } from '../lib/supabase';

interface RequestPageProps {
  onNavigate: (page: string) => void;
}

interface FormData {
  patient_name: string;
  blood_group: string;
  hospital: string;
  city: string;
  contact: string;
  urgency: 'normal' | 'urgent';
}

const initialForm: FormData = {
  patient_name: '',
  blood_group: '',
  hospital: '',
  city: '',
  contact: '',
  urgency: 'normal',
};

export default function RequestPage({ onNavigate }: RequestPageProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = (): string => {
    if (!form.patient_name.trim()) return 'Patient name is required.';
    if (!form.blood_group) return 'Please select required blood group.';
    if (!form.hospital.trim()) return 'Hospital name is required.';
    if (!form.city.trim()) return 'City is required.';
    if (!form.contact.trim() || !/^\d{10}$/.test(form.contact.trim())) return 'Enter a valid 10-digit contact number.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');

    const { error: dbError } = await supabase.from('blood_requests').insert({
      patient_name: form.patient_name.trim(),
      blood_group: form.blood_group,
      hospital: form.hospital.trim(),
      city: form.city.trim(),
      contact: form.contact.trim(),
      urgency: form.urgency,
      status: 'pending',
    });

    setLoading(false);

    if (dbError) {
      setError('Failed to submit request. Please try again.');
    } else {
      setSuccess(true);
      setForm(initialForm);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Request Submitted!</h2>
          <p className="text-gray-500 mb-8">
            Your blood request has been submitted successfully. Our team and nearby donors will be notified immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
            >
              Submit Another
            </button>
            <button
              onClick={() => onNavigate('search')}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Find Donors
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Blood Request</h1>
          <p className="text-gray-500">Submit a request for blood. We will help connect you with donors.</p>
        </div>

        {/* Urgency toggle */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, urgency: 'normal' }))}
            className={`flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 font-semibold transition-all ${
              form.urgency === 'normal'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            <Droplets className="w-5 h-5" />
            Normal Request
          </button>
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, urgency: 'urgent' }))}
            className={`flex items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 font-semibold transition-all ${
              form.urgency === 'urgent'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
          >
            <Zap className="w-5 h-5" />
            Urgent / Emergency
          </button>
        </div>

        {form.urgency === 'urgent' && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <Zap className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-red-700 text-sm font-medium">Urgent request will be prioritized and donors will be notified immediately.</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Name *</label>
              <input
                type="text"
                name="patient_name"
                value={form.patient_name}
                onChange={handleChange}
                placeholder="Full name of the patient"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Required Blood Group *</label>
              <select
                name="blood_group"
                value={form.blood_group}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors bg-white"
              >
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1 text-gray-400" />
                Hospital Name *
              </label>
              <input
                type="text"
                name="hospital"
                value={form.hospital}
                onChange={handleChange}
                placeholder="e.g. AIIMS Delhi"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1 text-gray-400" />
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1 text-gray-400" />
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  maxLength={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-semibold py-4 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                form.urgency === 'urgent' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  {form.urgency === 'urgent' ? <Zap className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  Submit {form.urgency === 'urgent' ? 'Urgent ' : ''}Request
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          For life-threatening emergencies, also call <span className="font-semibold text-red-600">1910</span> (National Blood Bank Helpline)
        </p>
      </div>
    </div>
  );
}
