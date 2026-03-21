import { Sprout } from "lucide-react";
import Link from "next/link";

export const Footer = () => (
  <footer id="about" className="bg-foreground text-primary-foreground/70 py-16">
    <div className="container mx-auto px-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-primary-foreground">Pomegrid</span>
          </Link>
          <p className="text-sm leading-relaxed">
            The B2B marketplace connecting agricultural producers with global importers.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-primary-foreground mb-4 text-sm">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/register" className="hover:text-primary-foreground transition-colors">For Farmers</Link></li>
            <li><Link href="/register" className="hover:text-primary-foreground transition-colors">For Importers</Link></li>
            <li><Link href="/#features" className="hover:text-primary-foreground transition-colors">Features</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-primary-foreground mb-4 text-sm">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
            <li><a href="#" className="hover:text-primary-foreground transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-primary-foreground mb-4 text-sm">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-xs">
        &copy; {new Date().getFullYear()} Pomegrid. All rights reserved.
      </div>
    </div>
  </footer>
);
