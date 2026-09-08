import { Heart, Droplets, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-6 h-6 text-red-500 fill-red-500" />
              <span className="font-bold text-xl text-white">BloodLink</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Connecting blood donors with those in need. Every donation saves up to 3 lives. Be a hero — donate blood today.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-400 transition-colors">Register as Donor</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Find Donors</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Request Blood</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Admin Panel</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Emergency Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                <span>Emergency: 1910 (National Blood Bank)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500" />
                <span>support@bloodlink.org</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span className="text-gray-400 text-xs">Donate blood, save lives</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} BloodLink — Blood Donation Management System. Made with <Heart className="w-3 h-3 inline fill-red-500 text-red-500" /> for a better world.</p>
        </div>
      </div>
    </footer>
  );
}
