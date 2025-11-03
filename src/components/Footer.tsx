import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-transparent text-black mt-20">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-black/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">R</span>
              </div>
              <h3 className="text-xl font-bold text-primary">Rickky Store</h3>
            </div>
            <p className="text-sm text-black/70">
              High-quality phone cases with unique designs.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Products</h4>
            <ul className="space-y-2 text-black/70">
              <li>
                <Link to="/" className="hover:text-black transition-colors">
                  Phone Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-black/70">
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-black/70">
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  System Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-black/70">Accepted Payments:</span>
              <div className="bg-red-600 px-4 py-2 rounded font-bold text-sm text-white">
                KHQR
              </div>
            </div>
            <p className="text-sm text-black/70">
              © 2025 Rickky Store. All rights reserved. Built with Spirit.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
