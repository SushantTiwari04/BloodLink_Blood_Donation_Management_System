import { useState, useEffect } from 'react';
import { Search, Phone, MapPin, Droplets, User, CheckCircle, XCircle, Filter } from 'lucide-react';
import { supabase, BLOOD_GROUPS, type Donor } from '../lib/supabase';

interface SearchPageProps {
  initialBloodGroup?: string;
  initialCity?: string;
}

export default function SearchPage({ initialBloodGroup = '', initialCity = '' }: SearchPageProps) {
  const [bloodGroup, setBloodGroup] = useState(initialBloodGroup);
  const [city, setCity] = useState(initialCity);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    if (initialBloodGroup || initialCity) {
      handleSearch(initialBloodGroup, initialCity);
    }
  }, []);

  const handleSearch = async (bg = bloodGroup, ct = city) => {
    setLoading(true);
    setSearched(true);

    let query = supabase.from('donors').select('*').order('created_at', { ascending: false });

    if (bg) query = query.eq('blood_group', bg);
    if (ct) query = query.ilike('city', `%${ct}%`);
    if (availableOnly) query = query.eq('availability', true);

    const { data, error } = await query;
    setLoading(false);

    if (!error && data) {
      setDonors(data as Donor[]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const filteredDonors = availableOnly ? donors.filter((d) => d.availability) : donors;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Blood Donors</h1>
          <p className="text-gray-500">Find available donors by blood group and location</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors bg-white"
              >
                <option value="">All Blood Groups</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <input
                type="text"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3 pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setAvailableOnly(!availableOnly)}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${availableOnly ? 'bg-red-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${availableOnly ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Available only</span>
              </label>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-red-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-red-700 transition-colors shadow-md whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Searching donors...</p>
          </div>
        ) : searched ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 font-medium">
                {filteredDonors.length === 0
                  ? 'No donors found'
                  : `${filteredDonors.length} donor${filteredDonors.length !== 1 ? 's' : ''} found`}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Filter className="w-4 h-4" />
                Sorted by latest
              </div>
            </div>

            {filteredDonors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No donors found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your search criteria or removing filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDonors.map((donor) => (
                  <DonorCard key={donor.id} donor={donor} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Start searching</h3>
            <p className="text-gray-500 text-sm">Enter a blood group or city above to find matching donors.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DonorCard({ donor }: { donor: Donor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-500 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{donor.name}</p>
            <p className="text-red-200 text-xs">{donor.gender}, {donor.age} yrs</p>
          </div>
        </div>
        <span className="bg-white text-red-700 font-bold text-lg px-3 py-1 rounded-lg shadow-sm">
          {donor.blood_group}
        </span>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4 text-red-400 shrink-0" />
          <span className="text-sm">{donor.city}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4 text-red-400 shrink-0" />
          <a href={`tel:${donor.phone}`} className="text-sm hover:text-red-600 transition-colors font-medium">
            {donor.phone}
          </a>
        </div>
        {donor.last_donation && (
          <div className="flex items-center gap-2 text-gray-500">
            <Droplets className="w-4 h-4 text-red-300 shrink-0" />
            <span className="text-xs">Last donated: {new Date(donor.last_donation).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        )}

        <div className="pt-2 border-t border-gray-100">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
              donor.availability
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {donor.availability ? (
              <><CheckCircle className="w-3.5 h-3.5" /> Available</>
            ) : (
              <><XCircle className="w-3.5 h-3.5" /> Not Available</>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
