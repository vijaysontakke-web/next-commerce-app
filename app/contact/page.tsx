"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Message sent successfully!");
  };

  return (
    <div className="container py-12 md:py-16 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Get in Touch</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We'd love to hear from you. Whether you have a question about our products, pricing, or availability, our team is ready to answer all your questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
           <Card>
             <CardHeader>
               <CardTitle>Contact Information</CardTitle>
               <CardDescription>Find us using the details below.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Visit Us</h3>
                    <p className="text-muted-foreground mt-1">
                      Pinnacle Teleservices Pvt. Ltd.<br />
                      "Pinnacle House", 7-Nawab Layout, Tilak Nagar, Near Law College Square<br />
                      Nagpur - 440010<br />
                      Maharashtra, India
                      <br />
                     
                    </p>
                  </div>
                </div>
                
                <Separator />

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-muted-foreground mt-1">support@nextstore.com</p>
                    <p className="text-muted-foreground">sales@nextstore.com</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-muted-foreground mt-1">+91 7567890123</p>
                    <p className="text-sm text-muted-foreground">Mon - Fri, 9:30am - 6:30pm IST</p>
                  </div>
                </div>
             </CardContent>
           </Card>

           {/* Map Placeholder */}
           {/* Map Integration */}
           {/* Map Integration */}
           <div className="space-y-4">
               <div className="flex justify-between items-center">
                   <h3 className="text-lg font-semibold">Our Location</h3>
                   <Button variant="outline" size="sm" onClick={() => {
                       if (navigator.geolocation) {
                           navigator.geolocation.getCurrentPosition((position) => {
                               const { latitude, longitude } = position.coords;
                               const mapFrame = document.getElementById("google-map") as HTMLIFrameElement;
                               if (mapFrame) {
                                   mapFrame.src = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                               }
                               toast.success("Location updated!");
                           }, () => {
                               toast.error("Unable to retrieve your location");
                           });
                       } else {
                           toast.error("Geolocation is not supported by your browser");
                       }
                   }}>
                       <MapPin className="mr-2 h-4 w-4" />
                       Use My Location
                   </Button>
               </div>
               <div className="h-64 bg-muted rounded-xl overflow-hidden border">
                  <iframe 
                    id="google-map"
                    src="https://maps.google.com/maps?q=21.146242,79.059371&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map"
                  />
               </div>
           </div>
        </div>

        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                 <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                       <Send className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold">Message Sent!</h3>
                    <p className="text-muted-foreground">Thank you for reaching out. We will respond to your inquiry within 24 hours.</p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                       Send Another Message
                    </Button>
                 </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">First name</label>
                      <Input id="first-name" placeholder="Enter your first name" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Last name</label>
                      <Input id="last-name" placeholder="Enter your last name" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                    <Input id="email" placeholder="Enter your email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Subject</label>
                    <Input id="subject" placeholder="Enter your subject" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
                    <Textarea 
                      id="message" 
                      placeholder="Enter your message" 
                      className="min-h-[120px]"
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full hover:bg-gray-200 hover:text-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
