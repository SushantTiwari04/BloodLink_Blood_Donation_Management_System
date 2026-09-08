import { useState } from 'react';
import { Heart, Search, AlertCircle, Users, Droplets, Award, ChevronRight, Activity } from 'lucide-react';
import { BLOOD_GROUPS } from '../lib/supabase';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

const stats = [
  { label: 'Registered Donors', value: '2,400+', icon: Users },
  { label: 'Lives Saved', value: '7,200+', icon: Heart },
  { label: 'Cities Covered', value: '120+', icon: Activity },
  { label: 'Blood Groups', value: '8', icon: Droplets },
];

const bloodFacts = [
  'Every 2 seconds, someone needs blood.',
  'One donation can save up to 3 lives.',
  'Only 7% of people have O- (universal donor) blood.',
  'Blood cannot be manufactured — it can only come from donors.',
  'A healthy adult can donate blood every 56 days.',
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const [searchBloodGroup, setSearchBloodGroup] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('search', { bloodGroup: searchBloodGroup, city: searchCity });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-20 w-96 h-96 rounded-full bg-red-300 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-red-500 bg-opacity-50 text-red-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                Save Lives Today
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Donate Blood,
              <br />
              <span className="text-red-200">Give the Gift of Life</span>
            </h1>
            <p className="text-lg md:text-xl text-red-100 mb-10 leading-relaxed max-w-2xl">
              Connect with blood donors in your city instantly. Register as a donor, search for blood, or submit an emergency request — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('register')}
                className="flex items-center justify-center gap-2 bg-white text-red-700 font-semibold px-8 py-4 rounded-xl hover:bg-red-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Heart className="w-5 h-5 fill-red-700" />
                Become a Donor
              </button>
              <button
                onClick={() => onNavigate('request')}
                className="flex items-center justify-center gap-2 bg-red-900 bg-opacity-60 border-2 border-red-300 text-white font-semibold px-8 py-4 rounded-xl hover:bg-red-900 transition-all"
              >
                <AlertCircle className="w-5 h-5" />
                Emergency Request
              </button>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <stat.icon className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Find a Donor Near You</h2>
            <p className="text-gray-500">Search for available blood donors by blood group and city</p>
          </div>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <select
              value={searchBloodGroup}
              onChange={(e) => setSearchBloodGroup(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors bg-white"
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter city name..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-red-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">How It Works</h2>
          <p className="text-gray-500">Simple steps to save a life</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Register as a Donor',
              desc: 'Fill in your details, blood group, and location. It only takes 2 minutes.',
              action: 'register',
              actionLabel: 'Register Now',
              color: 'bg-red-50 border-red-100',
              iconBg: 'bg-red-100',
              iconColor: 'text-red-600',
            },
            {
              step: '02',
              title: 'Search for Blood',
              desc: 'Search donors by blood group and city to find a match near you.',
              action: 'search',
              actionLabel: 'Search Donors',
              color: 'bg-rose-50 border-rose-100',
              iconBg: 'bg-rose-100',
              iconColor: 'text-rose-600',
            },
            {
              step: '03',
              title: 'Request Emergency Blood',
              desc: 'Submit an urgent request and we will connect you with nearby donors.',
              action: 'request',
              actionLabel: 'Request Now',
              color: 'bg-orange-50 border-orange-100',
              iconBg: 'bg-orange-100',
              iconColor: 'text-orange-600',
            },
          ].map((item) => (
            <div key={item.step} className={`${item.color} border rounded-2xl p-8 hover:shadow-md transition-shadow`}>
              <div className={`${item.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <span className={`${item.iconColor} font-bold text-lg`}>{item.step}</span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{item.desc}</p>
              <button
                onClick={() => onNavigate(item.action)}
                className={`flex items-center gap-1 text-sm font-semibold ${item.iconColor} hover:underline`}
              >
                {item.actionLabel} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Blood Groups Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-8 md:p-10 text-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Blood Group Compatibility</h2>
            <p className="text-red-200">Quick reference guide for blood transfusion compatibility</p>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {BLOOD_GROUPS.map((bg) => (
              <div key={bg} className="bg-white bg-opacity-15 backdrop-blur rounded-xl p-3 text-center hover:bg-opacity-25 transition-colors">
                <Droplets className="w-5 h-5 mx-auto mb-1 text-red-200" />
                <span className="font-bold text-lg">{bg}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Did You Know */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Did You Know?</h2>
          <p className="text-gray-500">Important facts about blood donation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bloodFacts.map((fact, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-red-100 rounded-full w-8 h-8 flex items-center justify-center shrink-0 mt-0.5">
                <Heart className="w-4 h-4 text-red-600 fill-red-600" />
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{fact}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
