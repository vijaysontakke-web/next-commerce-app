"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus, ArrowLeft, Save, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: ""
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
        toast.error("Failed to load categories");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        const method = editingId ? "PUT" : "POST";
        const body = editingId ? { ...formData, id: editingId } : formData;

        const res = await fetch("/api/categories", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error("Failed to save");

        toast.success(editingId ? "Category updated" : "Category created");
        
        // Reset form
        setFormData({ name: "", slug: "", description: "" });
        setEditingId(null);
        fetchCategories();
    } catch (error) {
        toast.error("Something went wrong");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", slug: "", description: "" });
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this category?")) return;

    try {
        const res = await fetch(`/api/categories?id=${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error("Failed to delete");

        toast.success("Category deleted");
        fetchCategories();
    } catch (error) {
        toast.error("Failed to delete category");
    }
  };

  return (
    <div className="container py-8 md:py-12 max-w-5xl">
       <div className="mb-6 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage product categories.</p>
          </div>
       </div>

       <div className="grid gap-8 md:grid-cols-[350px_1fr]">
          {/* Form Side */}
          <div>
             <Card>
                <CardHeader>
                    <CardTitle>{editingId ? "Edit Category" : "Add New Category"}</CardTitle>
                    <CardDescription>
                        {editingId ? "Update existing category details." : "Create a new product category."}
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
                                placeholder="e.g. Electronics"
                           />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="slug">Slug</Label>
                           <Input 
                                id="slug" 
                                value={formData.slug}
                                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                required
                                placeholder="e.g. electronics"
                           />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="description">Description</Label>
                           <Textarea 
                                id="description" 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Optional description..."
                           />
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
                      <CardTitle>All Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Slug</TableHead>
                                  <TableHead>Description</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {categories.length === 0 ? (
                                  <TableRow>
                                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                          {loading ? "Loading..." : "No categories found."}
                                      </TableCell>
                                  </TableRow>
                              ) : (
                                  categories.map((cat) => (
                                      <TableRow key={cat.id}>
                                          <TableCell className="font-medium">{cat.name}</TableCell>
                                          <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                                          <TableCell className="text-sm truncate max-w-[150px]">{cat.description}</TableCell>
                                          <TableCell className="text-right space-x-2">
                                              <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={() => handleEdit(cat)}
                                                className="h-8 w-8 p-0"
                                              >
                                                  <Edit className="h-4 w-4" />
                                              </Button>
                                              <Button 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={() => handleDelete(cat.id)}
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
