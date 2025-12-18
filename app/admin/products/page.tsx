"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Save,
  X,
  ImageIcon,
  Upload,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Papa from "papaparse";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  categoryId: z.string().min(1, "Please select a category"),
  inventory: z.coerce.number().int().min(0, "Inventory must be at least 0"),
  image: z.string().min(1, "Image URL is required"),
  features: z.array(z.string()).default([]),
});

type ProductValues = z.infer<typeof productSchema>;

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
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
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [mounted, setMounted] = useState(false);

  // Using any on resolver to bypass complex generic type mismatch issues with coercion/defaults in Zod
  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      categoryId: "",
      inventory: 0,
      image: "/images/placeholder.svg",
      features: [],
    },
  });

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
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
    setMounted(true);
    fetchData();
  }, []);

  const onSubmit = async (values: ProductValues) => {
    try {
      const method = editingId ? "PUT" : "POST";

      const payload = {
        ...values,
        id: editingId,
        images: values.image ? [values.image] : [],
      };

      const res = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(editingId ? "Product updated" : "Product created");

      form.reset({
        name: "",
        slug: "",
        description: "",
        price: 0,
        categoryId: "",
        inventory: 0,
        image: "/images/placeholder.svg",
        features: [],
      });
      setNewFeature("");
      setEditingId(null);
      fetchData();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    form.reset({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      inventory: product.inventory,
      image: product.images[0] || "",
      features: product.features || [],
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    form.reset({
      name: "",
      slug: "",
      description: "",
      price: 0,
      categoryId: "",
      inventory: 0,
      image: "/images/placeholder.svg",
      features: [],
    });
    setNewFeature("");
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = form.getValues("features") || [];
      form.setValue("features", [...currentFeatures, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features") || [];
    form.setValue(
      "features",
      currentFeatures.filter((_, i) => i !== index)
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Product deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || "Unknown";
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const res = await fetch("/api/products/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products: results.data }),
          });

          if (res.ok) {
            const data = await res.json();
            toast.success(
              `Successfully uploaded ${data.count} products. ${data.ignored} products were ignored due to missing category.`
            );
            fetchData();
            setShowBulkUpload(false);
          } else {
            const errText = await res.text();
            toast.error(errText || "Bulk upload failed");
          }
        } catch (error) {
          toast.error("Failed to process file");
        } finally {
          setIsUploading(false);
          e.target.value = "";
        }
      },
      error: (error) => {
        toast.error("CSV parsing failed: " + error.message);
        setIsUploading(false);
      },
    });
  };

  const downloadSampleCSV = () => {
    const csvData = [
      {
        name: "Sample Product",
        category: categories[0]?.name || "Electronics",
        price: "999",
        inventory: "10",
        description: "High quality sample product description.",
        slug: "sample-product",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        features: "Feature 1; Feature 2; Feature 3",
      },
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "products_sample.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted) return null;

  return (
    <div className="container py-8 md:py-12 max-w-7xl">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Products
            </h1>
            <p className="text-muted-foreground">
              Manage your product inventory.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowBulkUpload(!showBulkUpload)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button variant="outline" onClick={downloadSampleCSV}>
            <Download className="mr-2 h-4 w-4" />
            Sample CSV
          </Button>
        </div>
      </div>

      {showBulkUpload && (
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Bulk Product Upload</CardTitle>
            <CardDescription>
              Upload a CSV file with product details. Make sure the category
              matches existing category names.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Input
                type="file"
                accept=".csv"
                onChange={handleBulkUpload}
                disabled={isUploading}
                className="max-w-sm"
              />
              {isUploading && (
                <p className="text-sm animate-pulse">Processing...</p>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Columns expected: name, category, price, inventory, description,
              slug, image, features (separated by semicolon).
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        <div className="min-w-0">
          <Card className="border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Product" : "Add New Product"}
              </CardTitle>
              <CardDescription>
                {editingId
                  ? "Update existing product details."
                  : "Create a new product record."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Product Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="product-slug" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="inventory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inventory</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="/images/placeholder.svg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Product description..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-2">
                    <Label className="text-base font-semibold">
                      Features / Highlights
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add a feature"
                        onKeyPress={(e: any) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={addFeature}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {form.watch("features").length > 0 && (
                      <div className="space-y-2 mt-2">
                        {form.watch("features").map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-md text-sm border border-border/50 group"
                          >
                            <span className="truncate mr-2">{feature}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFeature(idx)}
                              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-6">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Saving...
                        </>
                      ) : editingId ? (
                        <>
                          <Save className="w-4 h-4 mr-2" /> Update Product
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" /> Create Product
                        </>
                      )}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="min-w-0">
          <Card className="border-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle>All Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
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
                        <TableCell
                          colSpan={6}
                          className="text-center py-12 text-muted-foreground"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />{" "}
                              Loading products...
                            </div>
                          ) : (
                            "No products found."
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((prod) => (
                        <TableRow
                          key={prod.id}
                          className="group transition-colors hover:bg-muted/50"
                        >
                          <TableCell>
                            {prod.images?.[0] ? (
                              <div className="h-10 w-10 relative overflow-hidden rounded-md border bg-muted group-hover:border-primary/20 transition-colors shadow-sm">
                                <Image
                                  src={prod.images[0]}
                                  alt={prod.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-md border text-muted-foreground shadow-sm">
                                <ImageIcon className="h-4 w-4" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell
                            className="font-medium max-w-[200px] truncate transition-colors group-hover:text-primary"
                            title={prod.name}
                          >
                            {prod.name}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary/80 border border-primary/10">
                              {getCategoryName(prod.categoryId)}
                            </span>
                          </TableCell>
                          <TableCell className="font-bold text-primary italic">
                            ₹{prod.price}
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "font-bold",
                                prod.inventory < 10
                                  ? "text-destructive"
                                  : "text-foreground/80"
                              )}
                            >
                              {prod.inventory}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
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
                              className="h-8 w-8 p-0 hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
