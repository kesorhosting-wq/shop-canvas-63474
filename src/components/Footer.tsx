import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { sb } from "@/lib/supabaseClient";

export const Footer = () => {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await sb
        .from("site_settings")
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
  });

  return (
    <footer className="bg-transparent text-black mt-12">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo and tagline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-black/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">R</span>
              </div>
              <h3 className="text-lg font-bold text-primary">Rickky Store</h3>
            </div>
            <p className="text-sm text-black/70">
              High-quality phone cases with unique designs.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-3">Products</h4>
            <ul className="space-y-2 text-sm text-black/70">
              <li>
                <Link to="/" className="hover:text-black transition-colors">
                  Phone Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-black/70">
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-black/70">
              {settings?.telegram_url && (
                <li>
                  <a 
                    href={settings.telegram_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-black transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                    </svg>
                    Telegram
                  </a>
                </li>
              )}
              {settings?.facebook_url && (
                <li>
                  <a 
                    href={settings.facebook_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-black transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-black/20 mt-6 pt-6 text-center">
          <p className="text-sm text-black/70">
            © 2025 Rickky Store. All rights reserved. Built with Spirit.
          </p>
        </div>
      </div>
    </footer>
  );
};
