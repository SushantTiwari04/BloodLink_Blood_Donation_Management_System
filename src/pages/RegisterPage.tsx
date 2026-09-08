import { useState } from 'react';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase, BLOOD_GROUPS } from '../lib/supabase';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

interface FormData {
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

const initialForm: FormData = {
  name: '',
  age: '',
  gender: '',
  blood_group: '',
  phone: '',
  email: '',
  city: '',
  last_donation: '',
  availability: 'true',
};

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = (): string => {
    if (!form.name.trim()) return 'Full name is required.';
    if (!form.age || parseInt(form.age) < 18 || parseInt(form.age) > 65) return 'Age must be between 18 and 65.';
    if (!form.gender) return 'Please select gender.';
    if (!form.blood_group) return 'Please select blood group.';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) return 'Enter a valid 10-digit phone number.';
    if (!form.city.trim()) return 'City is required.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');

    const { error: dbError } = await supabase.from('donors').insert({
      name: form.name.trim(),
      age: parseInt(form.age),
      gender: form.gender,
      blood_group: form.blood_group,
      phone: form.phone.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      last_donation: form.last_donation || null,
      availability: form.availability === 'true',
    });

    setLoading(false);

    if (dbError) {
      setError('Failed to register. Please try again.');
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
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Registration Successful!</h2>
          <p className="text-gray-500 mb-8">
            Thank you for registering as a blood donor. Your information has been saved. You may be contacted when someone in your area needs blood.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
            >
              Register Another
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Go Home
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
            <UserPlus className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Become a Blood Donor</h1>
          <p className="text-gray-500">Fill in your details to register as a donor and help save lives</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age * (18–65)</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  min="18"
                  max="65"
                  placeholder="25"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors bg-white"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Blood Group & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group *</label>
                <select
                  name="blood_group"
                  value={form.blood_group}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors bg-white"
                >
                  <option value="">Select group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  maxLength={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Last Donation & Availability */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Donation Date <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input
                  type="date"
                  name="last_donation"
                  value={form.last_donation}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Currently Available? *</label>
                <select
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors bg-white"
                >
                  <option value="true">Yes, available</option>
                  <option value="false">No, not available</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white font-semibold py-4 rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Register as Donor
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Your information is kept private and only shared with those in genuine medical need.
        </p>
      </div>
    </div>
  );
}
