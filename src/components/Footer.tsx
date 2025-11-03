import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-[hsl(0_0%_8%)] text-white mt-20">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">R</span>
              </div>
              <h3 className="text-xl font-bold text-primary">Rickky Store</h3>
            </div>
            <p className="text-sm text-gray-400">
              High-quality phone cases with unique designs.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Phone Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  System Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">Accepted Payments:</span>
              <div className="bg-red-600 px-4 py-2 rounded font-bold text-sm">
                KHQR
              </div>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 Rickky Store. All rights reserved. Built with Spirit.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
