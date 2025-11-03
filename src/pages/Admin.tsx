import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sb } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Trash2, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ImageUpload } from "@/components/ImageUpload";

export default function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [storeName, setStoreName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");

  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productFacebook, setProductFacebook] = useState("");
  const [productTiktok, setProductTiktok] = useState("");
  const [productTelegram, setProductTelegram] = useState("");
  const [customLink, setCustomLink] = useState("");

  const [categoryName, setCategoryName] = useState("");

  const handleLogout = async () => {
    await sb.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await sb
        .from("site_settings")
        .select("*")
        .single();
      if (error) throw error;
      setStoreName(data.store_name);
      setLogoUrl(data.logo_url || "");
      setBackgroundUrl(data.background_image_url || "");
      setFacebookUrl(data.facebook_url || "");
      setTiktokUrl(data.tiktok_url || "");
      setTelegramUrl(data.telegram_url || "");
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await sb
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await sb
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async () => {
      const { error } = await sb
        .from("site_settings")
        .update({
          store_name: storeName,
          logo_url: logoUrl,
          background_image_url: backgroundUrl,
          facebook_url: facebookUrl,
          tiktok_url: tiktokUrl,
          telegram_url: telegramUrl,
        })
        .eq("id", settings?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Settings updated successfully");
    },
  });

  const addProduct = useMutation({
    mutationFn: async () => {
      const { error } = await sb.from("products").insert({
        name: productName,
        product_id: productId,
        price: parseFloat(price),
        image_url: imageUrl,
        category_id: categoryId || null,
        facebook_link: productFacebook || null,
        tiktok_link: productTiktok || null,
        telegram_link: productTelegram || null,
        custom_link: customLink || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added successfully");
      setProductName("");
      setProductId("");
      setPrice("");
      setImageUrl("");
      setCategoryId("");
      setProductFacebook("");
      setProductTiktok("");
      setProductTelegram("");
      setCustomLink("");
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
  });

  const addCategory = useMutation({
    mutationFn: async () => {
      const { error } = await sb.from("categories").insert({
        name: categoryName,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category added successfully");
      setCategoryName("");
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--secondary))] py-8">
      <div className="container px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Store
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>

                <ImageUpload
                  bucket="site-images"
                  currentImage={logoUrl}
                  onUploadComplete={setLogoUrl}
                  label="Logo Image"
                />

                <ImageUpload
                  bucket="site-images"
                  currentImage={backgroundUrl}
                  onUploadComplete={setBackgroundUrl}
                  label="Background Image"
                />

                <div>
                  <Label htmlFor="facebookUrl">Facebook URL</Label>
                  <Input
                    id="facebookUrl"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <Label htmlFor="tiktokUrl">TikTok URL</Label>
                  <Input
                    id="tiktokUrl"
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                    placeholder="https://tiktok.com/@yourpage"
                  />
                </div>

                <div>
                  <Label htmlFor="telegramUrl">Telegram URL</Label>
                  <Input
                    id="telegramUrl"
                    value={telegramUrl}
                    onChange={(e) => setTelegramUrl(e.target.value)}
                    placeholder="https://t.me/yourpage"
                  />
                </div>

                <Button
                  onClick={() => updateSettings.mutate()}
                  disabled={updateSettings.isPending}
                >
                  {updateSettings.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card className="p-6 space-y-6">
              <h2 className="text-xl font-semibold">Add New Product</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="productId">Product ID</Label>
                  <Input
                    id="productId"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <select
                    id="categoryId"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <ImageUpload
                    bucket="product-images"
                    currentImage={imageUrl}
                    onUploadComplete={setImageUrl}
                    label="Product Image"
                  />
                </div>

                <div>
                  <Label htmlFor="productFacebook">Facebook Link</Label>
                  <Input
                    id="productFacebook"
                    value={productFacebook}
                    onChange={(e) => setProductFacebook(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="productTiktok">TikTok Link</Label>
                  <Input
                    id="productTiktok"
                    value={productTiktok}
                    onChange={(e) => setProductTiktok(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="productTelegram">Telegram Link</Label>
                  <Input
                    id="productTelegram"
                    value={productTelegram}
                    onChange={(e) => setProductTelegram(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="customLink">Custom Order Link</Label>
                  <Input
                    id="customLink"
                    value={customLink}
                    onChange={(e) => setCustomLink(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={() => addProduct.mutate()}
                disabled={addProduct.isPending}
              >
                {addProduct.isPending ? "Adding..." : "Add Product"}
              </Button>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold">Existing Products</h3>
                <div className="grid gap-4">
                  {products?.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {product.product_id} | ${product.price}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteProduct.mutate(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="p-6 space-y-6">
              <h2 className="text-xl font-semibold">Add New Category</h2>
              <div className="flex gap-4">
                <Input
                  placeholder="Category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
                <Button
                  onClick={() => addCategory.mutate()}
                  disabled={addCategory.isPending}
                >
                  {addCategory.isPending ? "Adding..." : "Add"}
                </Button>
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold">Existing Categories</h3>
                <div className="grid gap-2">
                  {categories?.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="font-medium">{category.name}</span>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteCategory.mutate(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
