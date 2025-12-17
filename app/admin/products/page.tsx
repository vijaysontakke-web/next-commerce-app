"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus, ArrowLeft, Save, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
    id: string;
    name: string;
    description: string;
    slug: string;
    price: number;
    categoryId: string;
    inventory: number;
    images: string[];
    features?: string[];
}

interface Category {
    id: string;
    name: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    categoryId: "",
    inventory: "",
    image: "", // Simplify to single image URL for now
    features: [] as string[]
  });
  
  const [newFeature, setNewFeature] = useState("");

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories")
      ]);

      if (prodRes.ok && catRes.ok) {
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(prodData);
        setCategories(catData);
      }
    } catch (error) {
        toast.error("Failed to load data");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        const method = editingId ? "PUT" : "POST";
        const body = editingId ? { ...formData, id: editingId } : formData;

        // Convert data types
        const payload = {
            ...body,
            images: formData.image ? [formData.image] : [],
            features: formData.features,
             // Validation is handled by API or required attributes
        };

        const res = await fetch("/api/products", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Failed to save");

        toast.success(editingId ? "Product updated" : "Product created");
        
        // Reset form
        setFormData({ name: "", slug: "", description: "", price: "", categoryId: "", inventory: "", image: "", features: [] });
        setNewFeature("");
        setEditingId(null);
        fetchData();
    } catch (error) {
        toast.error("Something went wrong");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price.toString(),
        categoryId: product.categoryId,
        inventory: product.inventory.toString(),
        image: product.images[0] || "",
        features: product.features || []
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", slug: "", description: "", price: "", categoryId: "", inventory: "", image: "", features: [] });
    setNewFeature("");
  };
  
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({...formData, features: [...formData.features, newFeature.trim()]});
      setNewFeature("");
    }
  };
  
  const removeFeature = (index: number) => {
    setFormData({...formData, features: formData.features.filter((_, i) => i !== index)});
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this product?")) return;

    try {
        const res = await fetch(`/api/products?id=${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error("Failed to delete");

        toast.success("Product deleted");
        fetchData();
    } catch (error) {
        toast.error("Failed to delete product");
    }
  };

  const getCategoryName = (id: string) => {
      return categories.find(c => c.id === id)?.name || "Unknown";
  };

  return (
    <div className="container py-8 md:py-12 max-w-7xl">
       <div className="mb-6 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory.</p>
          </div>
       </div>

       <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Form Side */}
          <div>
             <Card>
                <CardHeader>
                    <CardTitle>{editingId ? "Edit Product" : "Add New Product"}</CardTitle>
                    <CardDescription>
                        {editingId ? "Update existing product details." : "Create a new product record."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="name">Name</Label>
                           <Input 
                                id="name" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                placeholder="Product Name"
                           />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="slug">Slug</Label>
                           <Input 
                                id="slug" 
                                value={formData.slug}
                                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                required
                                placeholder="product-slug"
                           />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <Label htmlFor="price">Price (₹)</Label>
                               <Input 
                                    id="price" 
                                    type="number"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    required
                                    placeholder="0.00"
                               />
                            </div>
                            <div className="space-y-2">
                               <Label htmlFor="inventory">Inventory</Label>
                               <Input 
                                    id="inventory" 
                                    type="number"
                                    min="0"
                                    value={formData.inventory}
                                    onChange={(e) => setFormData({...formData, inventory: e.target.value})}
                                    required
                                    placeholder="0"
                               />
                            </div>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="category">Category</Label>
                           <select 
                                id="category"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                required
                           >
                                <option value="" disabled>Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                           </select>
                        </div>
                         <div className="space-y-2">
                           <Label htmlFor="image">Image URL</Label>
                           <div className="flex gap-2">
                                <Input 
                                        id="image" 
                                        value={formData.image}
                                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                                        placeholder="/images/placeholder.svg"
                                />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="description">Description</Label>
                           <Textarea 
                                id="description" 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Product description..."
                                className="min-h-[100px]"
                           />
                        </div>
                        
                        <div className="space-y-2">
                           <Label>Features / Highlights</Label>
                           <div className="flex gap-2">
                                <Input 
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    placeholder="Add a feature"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addFeature();
                                        }
                                    }}
                                />
                                <Button type="button" variant="outline" onClick={addFeature}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                           </div>
                           {formData.features.length > 0 && (
                               <div className="space-y-1 mt-2">
                                   {formData.features.map((feature, idx) => (
                                       <div key={idx} className="flex items-center justify-between bg-muted px-3 py-2 rounded text-sm">
                                           <span>{feature}</span>
                                           <Button 
                                               type="button" 
                                               variant="ghost" 
                                               size="sm" 
                                               onClick={() => removeFeature(idx)}
                                               className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                           >
                                               <X className="h-3 w-3" />
                                           </Button>
                                       </div>
                                   ))}
                               </div>
                           )}
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                             <Button type="submit" className="w-full">
                                {editingId ? (
                                    <><Save className="w-4 h-4 mr-2" /> Update</>
                                ) : (
                                    <><Plus className="w-4 h-4 mr-2" /> Create</>
                                )}
                             </Button>
                             {editingId && (
                                <Button type="button" variant="outline" onClick={handleCancel}>
                                    <X className="w-4 h-4" />
                                </Button>
                             )}
                        </div>
                    </form>
                </CardContent>
             </Card>
          </div>

          {/* Table Side */}
          <div>
              <Card>
                  <CardHeader>
                      <CardTitle>All Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Image</TableHead>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Category</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>Stock</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {products.length === 0 ? (
                                  <TableRow>
                                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                          {loading ? "Loading..." : "No products found."}
                                      </TableCell>
                                  </TableRow>
                              ) : (
                                  products.map((prod) => (
                                      <TableRow key={prod.id}>
                                          <TableCell>
                                              {prod.images?.[0] ? (
                                                  <div className="h-10 w-10 relative overflow-hidden rounded border bg-muted">
                                                     <img src={prod.images[0]} alt={prod.name} className="object-cover w-full h-full" />
                                                  </div>
                                              ) : (
                                                  <div className="h-10 w-10 flex items-center justify-center bg-muted rounded border text-muted-foreground">
                                                      <ImageIcon className="h-4 w-4" />
                                                  </div>
                                              )}
                                          </TableCell>
                                          <TableCell className="font-medium max-w-[150px] truncate" title={prod.name}>{prod.name}</TableCell>
                                          <TableCell>{getCategoryName(prod.categoryId)}</TableCell>
                                          <TableCell>₹{prod.price}</TableCell>
                                          <TableCell>{prod.inventory}</TableCell>
                                          <TableCell className="text-right space-x-2">
                                              <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={() => handleEdit(prod)}
                                                className="h-8 w-8 p-0"
                                              >
                                                  <Edit className="h-4 w-4" />
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={() => handleDelete(prod.id)}
                                                className="h-8 w-8 p-0 hover:text-red-500 hover:bg-red-50"
                                              >
                                                  <Trash2 className="h-4 w-4" />
                                              </Button>
                                          </TableCell>
                                      </TableRow>
                                  ))
                              )}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>
          </div>
       </div>
    </div>
  );
}
