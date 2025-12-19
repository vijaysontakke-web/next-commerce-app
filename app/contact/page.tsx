"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  Loader2,
  Globe,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Contact form submitted:", values);
      setIsSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const updateMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapFrame = document.getElementById(
            "google-map"
          ) as HTMLIFrameElement;
          if (mapFrame) {
            mapFrame.src = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
          }
          toast.success("Location updated!");
        },
        () => {
          toast.error("Unable to retrieve your location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="container py-12 md:py-20 max-w-7xl animate-in fade-in duration-700">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
          <Globe className="w-4 h-4 mr-2" /> Global Support
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
          Get in Touch
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          We're here to help. Whether you have questions about products,
          technical issues, or just want to say hello, our team is ready to
          assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Information */}
        <div className="lg:col-span-5 space-y-8">
          <Card className="border-primary/5 shadow-xl bg-gradient-to-br from-background to-muted/30">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Contact Details
              </CardTitle>
              <CardDescription>
                Reach out to us through any of these channels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-primary/10 rounded-xl text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Headquarters</h3>
                  <address className="text-muted-foreground mt-2 not-italic leading-relaxed">
                    Pinnacle Teleservices Pvt. Ltd.
                    <br />
                    "Pinnacle House", 7-Nawab Layout
                    <br />
                    Tilak Nagar, Nagpur - 440010
                    <br />
                    Maharashtra, India
                  </address>
                </div>
              </div>

              <Separator className="bg-primary/5" />

              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-primary/10 rounded-xl text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email Support</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                      support@nextstore.com
                    </p>
                    <p className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                      sales@nextstore.com
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-primary/5" />

              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-primary/10 rounded-xl text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Call Us Directly</h3>
                  <p className="text-muted-foreground mt-2 font-medium">
                    +91 7567890123
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mon - Fri, 9:30 AM - 6:30 PM (IST)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-bold">Our Location</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={updateMap}
                className="rounded-full shadow-sm hover:bg-primary/5"
              >
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                Find Near Me
              </Button>
            </div>
            <div className="h-72 bg-muted rounded-2xl overflow-hidden border-2 border-primary/5 shadow-inner">
              <iframe
                id="google-map"
                src="https://maps.google.com/maps?q=21.146242,79.059371&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.2) contrast(1.1)" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <Card className="border-none shadow-2xl overflow-hidden">
            <div className="h-2 bg-primary w-full" />
            <CardHeader className="p-8">
              <CardTitle className="text-2xl font-bold">
                Drop us a line
              </CardTitle>
              <CardDescription className="text-base">
                We usually respond within 24 business hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-in zoom-in duration-500">
                  <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-extrabold text-foreground">
                      Message Dispatched!
                    </h3>
                    <p className="text-muted-foreground text-lg max-w-sm mx-auto italic">
                      "Communication leads to community, that is, to
                      understanding."
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="rounded-full px-8 border-primary/20 hover:bg-primary/5"
                  >
                    Send Another message
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter First Name"
                                className="h-12 border-muted-foreground/20 focus:border-primary transition-all"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter Last Name"
                                className="h-12 border-muted-foreground/20 focus:border-primary transition-all"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">
                            Business Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Business Email"
                              type="email"
                              className="h-12 border-muted-foreground/20 focus:border-primary transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">
                            Subject
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="How can we help?"
                              className="h-12 border-muted-foreground/20 focus:border-primary transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">
                            Detailed Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Type your message here..."
                              className="min-h-[160px] resize-none border-muted-foreground/20 focus:border-primary transition-all p-4"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-bold rounded-xl shadow-xl shadow-primary/10 transition-all hover:-translate-y-1 active:scale-95 group"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Transmitting...
                        </>
                      ) : (
                        <>
                          Transmit Message{" "}
                          <Send className="ml-2 h-5 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
