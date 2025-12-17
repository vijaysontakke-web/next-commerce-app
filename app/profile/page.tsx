"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, MapPin } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: {
        street: "",
        city: "",
        zip: "",
        country: ""
    }
  });

  useEffect(() => {
    if (status === "unauthenticated") {
        router.push("/login");
    }

    const fetchProfile = async () => {
        try {
            const response = await fetch("/api/user/profile");
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    name: data.name || "",
                    phone: data.phone || "",
                    address: {
                        street: data.address?.street || "",
                        city: data.address?.city || "",
                        zip: data.address?.zip || "",
                        country: data.address?.country || ""
                    }
                });
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    if (session?.user) {
        fetchProfile();
    }
  }, [session, status, router]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
        const response = await fetch("/api/user/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error("Failed to update profile");
        }

        toast.success("Profile updated successfully!");
        router.push("/");
        router.refresh(); // Refresh to update session data if needed
    } catch (error) {
        toast.error("Something went wrong");
    } finally {
        setLoading(false);
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="container py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
      
      {/* Steps Indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {s}
                </div>
                <span className="text-xs mt-2">
                    {s === 1 ? "Personal" : s === 2 ? "Address" : "Review"}
                </span>
            </div>
        ))}
      </div>

      <Card>
        <CardHeader>
           <CardTitle>
             {step === 1 && "Personal Details"}
             {step === 2 && "Shipping Address"}
             {step === 3 && "Review & Save"}
           </CardTitle>
           <CardDescription>
             {step === 1 && "Update your personal information."}
             {step === 2 && "Where should we send your orders?"}
             {step === 3 && "Please review your details before saving."}
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {step === 1 && (
             <>
                <div className="space-y-2">
                   <Label htmlFor="name">Full Name</Label>
                   <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="pl-9"
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <Label htmlFor="phone">Phone Number</Label>
                   <Input 
                      id="phone" 
                      placeholder="+91 1234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   />
                </div>
             </>
           )}

           {step === 2 && (
             <>
                <div className="space-y-2">
                   <Label htmlFor="street">Street Address</Label>
                   <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="street" 
                        placeholder="Enter your street address"
                        value={formData.address.street}
                        onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                        className="pl-9"
                      />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        placeholder="Enter your city"
                        value={formData.address.city}
                        onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                      />
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="zip">Zip Code</Label>
                      <Input 
                        id="zip" 
                        placeholder="Enter your zip code"
                        value={formData.address.zip}
                        onChange={(e) => setFormData({...formData, address: {...formData.address, zip: e.target.value}})}
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <Label htmlFor="country">Country</Label>
                   <Input 
                      id="country" 
                      placeholder="Enter your country"
                      value={formData.address.country}
                      onChange={(e) => setFormData({...formData, address: {...formData.address, country: e.target.value}})}
                   />
                </div>
             </>
           )}

           {step === 3 && (
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                      <p className="font-semibold text-muted-foreground">Name</p>
                      <p>{formData.name}</p>
                   </div>
                   <div>
                      <p className="font-semibold text-muted-foreground">Phone</p>
                      <p>{formData.phone || "-"}</p>
                   </div>
                   <div className="col-span-2">
                      <p className="font-semibold text-muted-foreground">Address</p>
                      <p>{formData.address.street}</p>
                      <p>{formData.address.city}, {formData.address.zip}</p>
                      <p>{formData.address.country}</p>
                   </div>
                </div>
             </div>
           )}
        </CardContent>
        <CardFooter className="flex justify-between">
           {step > 1 ? (
              <Button variant="outline" onClick={handleBack} disabled={loading}>Back</Button>
           ) : (
              <div></div> // Spacer
           )}
           
           {step < 3 ? (
              <Button onClick={handleNext}>Next</Button>
           ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                 {loading ? "Saving..." : "Save Profile"}
              </Button>
           )}
        </CardFooter>
      </Card>
    </div>
  );
}
