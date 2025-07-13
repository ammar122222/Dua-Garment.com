import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-12"> {/* UPDATED: bg-black and text-white */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand & Newsletter */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Dua Garments</h3>
          <p className="text-sm text-white/80"> {/* UPDATED: text-white/80 */}
            Your trusted fashion destination for premium quality clothing for the whole family.
          </p>

          <div className="space-y-2">
            <h4 className="font-semibold">Newsletter</h4>
            <p className="text-sm text-white/80"> {/* UPDATED: text-white/80 */}
              Get updates on new arrivals and special offers
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                /* UPDATED: bg-white/10, border-white/20, text-white, placeholder:text-white/60 */
              />
              <Button variant="secondary" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-gray-300 transition-colors">Home</Link></li> {/* UPDATED: hover:text-gray-300 */}
            <li><Link to="/men" className="hover:text-gray-300 transition-colors">Men's Collection</Link></li> {/* UPDATED: hover:text-gray-300 */}
            <li><Link to="/women" className="hover:text-gray-300 transition-colors">Women's Collection</Link></li> {/* UPDATED: hover:text-gray-300 */}
            <li><Link to="/kids" className="hover:text-gray-300 transition-colors">Kids' Collection</Link></li> {/* UPDATED: hover:text-gray-300 */}
            <li><Link to="/new-arrivals" className="hover:text-gray-300 transition-colors">New Arrivals</Link></li> {/* UPDATED: hover:text-gray-300 */}
            <li><Link to="/sale" className="hover:text-gray-300 transition-colors">Sale</Link></li> {/* UPDATED: hover:text-gray-300 */}
          </ul>
        </div>

        {/* Customer Service */}
        <div className="space-y-4">
          <h4 className="font-semibold">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-gray-300 transition-colors">Contact Us</Link></li> {/* UPDATED: hover:text-gray-300 */}
            <li><a href="#" className="hover:text-gray-300 transition-colors">Size Guide</a></li> {/* UPDATED: hover:text-gray-300 */}
            <li><a href="#" className="hover:text-gray-300 transition-colors">Shipping Info</a></li> {/* UPDATED: hover:text-gray-300 */}
            <li><a href="#" className="hover:text-gray-300 transition-colors">Returns & Exchanges</a></li> {/* UPDATED: hover:text-gray-300 */}
            <li><a href="#" className="hover:text-gray-300 transition-colors">FAQs</a></li> {/* UPDATED: hover:text-gray-300 */}
            <li><a href="#" className="hover:text-gray-300 transition-colors">Track Your Order</a></li> {/* UPDATED: hover:text-gray-300 */}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="font-semibold">Contact Info</h4> {/* Reverted title to "Contact Info" */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Bahria Safari Valley Safari Valley Commercial Block Bahria Safari Valley, Rawalpindi</span> {/* UPDATED Address */}
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <a href="tel:+923077700707" className="hover:text-gray-300 transition-colors">+92 3077 700 707</a> {/* UPDATED Phone */}
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:DuaGarments@gmail.com" className="hover:text-gray-300 transition-colors">DuaGarments@gmail.com</a> {/* UPDATED Email */}
            </div>
          </div>

          <div className="flex space-x-4 mt-4">
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300"> {/* UPDATED: text-white, hover:text-gray-300 */}
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300"> {/* UPDATED: text-white, hover:text-gray-300 */}
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:text-gray-300"> {/* UPDATED: text-white, hover:text-gray-300 */}
              <Instagram className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

<footer className="text-center text-xs text-muted-foreground py-4">
  © 2025 CodeStudioX. All rights reserved. |
  <a href="/copyright-policy" className="underline">Copyright Policy</a>
</footer>

      <Separator className="my-8 bg-white/20" /> {/* UPDATED: bg-white/20 */}

      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/80"> {/* UPDATED: text-white/80 */}
        <p>&copy; {new Date().getFullYear()} Dua Garments. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a> {/* UPDATED: hover:text-gray-300 */}
          <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a> {/* UPDATED: hover:text-gray-300 */}
          <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a> {/* UPDATED: hover:text-gray-300 */}
        </div>
      </div>
    </footer>
  );
};
<Link to="/copyright-policy" className="text-sm underline">
  Copyright Policy
</Link>
