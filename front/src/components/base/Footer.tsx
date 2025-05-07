import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Branding & Info */}
      <div>
        <h2 className="text-xl font-semibold">QuickChat</h2>
        <p className="text-sm mt-2 text-gray-400">
          Seamless group chats powered by AI. Connect, chat, and collaborate with ease.
        </p>
        <p className="mt-4 text-xs text-gray-500">Built by <strong>[Your Name]</strong> © 2024</p>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-medium mb-3">Quick Links</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li><Link href="/dashboard">Privacy Policy</Link></li>
          <li><Link href="/dashboard">Terms of Service</Link></li>
          <li><Link href="/dashboard">About</Link></li>
          <li><Link href="/dashboard">Contact</Link></li>
        </ul>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="text-lg font-medium mb-3">Contact</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> mdhasnat067@gmail.com</li>
          <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> 6204199751</li>
        </ul>

        <div className="flex gap-4 mt-4 text-gray-400">
          <Link href="https://www.facebook.com/profile.php?id=100026182179048#" target="_blank"><Facebook className="h-5 w-5 hover:text-white" /></Link>
          <Link href="https://twitter.com" target="_blank"><Twitter className="h-5 w-5 hover:text-white" /></Link>
          <Link href="https://www.instagram.com/syed_hasnat_au/" target="_blank"><Instagram className="h-5 w-5 hover:text-white" /></Link>
          <Link href="https://www.linkedin.com/in/syed-jamal-ahmed-73b27618a/?originalSubdomain=in" target="_blank"><Linkedin className="h-5 w-5 hover:text-white" /></Link>
        </div>
      </div>

      {/* Newsletter */}
      <div>
        <h3 className="text-lg font-medium mb-3">Stay in the Loop</h3>
        <p className="text-sm text-gray-400 mb-4">
          Subscribe for updates, tips, and exclusive content.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Enter your email"
            className="bg-gray-800 border-none text-white"
          />
          <Button>Subscribe</Button>
        </div>
      </div>
    </div>
  </footer>
  );
}