"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react"; // Import useState
import * as z from "zod";

import Button from "@/components/universal/Button";
import Input from "../../components/inputs/input";
import Textarea from "@/components/inputs/TextArea";
import Heading from "@/components/universal/Heading";
import { toast, Toaster } from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const [loading, setLoading] = useState(false); // 🔹 State for loading

  async function handleSubmit() {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fill out all fields correctly.");
      return;
    }

    setLoading(true); // 🔹 Start loading state

    try {
      const values = form.getValues();
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to send message.");

      toast.success("Message sent successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false); // 🔹 Stop loading state
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* <Toaster position="top-right" /> */}
      <Heading title="Contact Us" />

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <span>+91 7069672169</span>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary" />
              <span>support@yourstore.com</span>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary" />
              <span>123 Store Street, City, State 12345</span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>

          <div className="space-y-6">
            <Input
              id="name"
              label="Your Name"
              type="text"
              register={form.register as any}
              errors={form.formState.errors}
            />
            <Input
              id="email"
              label="Email Address"
              type="email"
              register={form.register as any}
              errors={form.formState.errors}
            />
            <Textarea
              id="message"
              label="Your Message"
              register={form.register as any}
              errors={form.formState.errors}
            />

            {/* Button with Loading State */}
            <Button
              lable={loading ? "Sending..." : "Send Message"}
              onClick={handleSubmit}
              disabled={loading} // 🔹 Disable button when loading
            />
          </div>
        </div>
      </div>
    </div>
  );
}
