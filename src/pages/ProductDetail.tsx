import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { sb } from "@/lib/supabaseClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await sb
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--secondary))]">
        <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
        <div className="container px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--secondary))]">
        <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
        <div className="container px-4 py-20 text-center">
          <p className="text-muted-foreground">Product not found</p>
          <Link to="/">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const socialLinks = [
    { url: product.facebook_link, icon: "facebook", label: "Facebook" },
    { url: product.tiktok_link, icon: "tiktok", label: "TikTok" },
    { url: product.telegram_link, icon: "telegram", label: "Telegram" },
  ].filter((link) => link.url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--secondary))]">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="container px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-3xl p-6 shadow-lg">
            <div className="aspect-square rounded-2xl overflow-hidden mb-6">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-center">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-lg text-muted-foreground">ID: {product.product_id}</p>
              <p className="text-2xl font-bold text-primary">${product.price}</p>

              <div className="py-4">
                <p className="text-lg mb-2 font-khmer">ពីតម្លៃលើនេះឡើង</p>
              </div>

              {socialLinks.length > 0 && (
                <div className="flex justify-center gap-4 pt-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.icon}
                      href={link.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      {link.icon === "facebook" && (
                        <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center">
                          <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </div>
                      )}
                      {link.icon === "tiktok" && (
                        <div className="h-14 w-14 rounded-full bg-black flex items-center justify-center">
                          <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                          </svg>
                        </div>
                      )}
                      {link.icon === "telegram" && (
                        <div className="h-14 w-14 rounded-full bg-blue-500 flex items-center justify-center">
                          <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                          </svg>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}

              {product.custom_link && (
                <div className="pt-4">
                  <a
                    href={product.custom_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button size="lg" className="rounded-full px-8">
                      Order Now
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
