import { Link } from "@tanstack/react-router";
import { FaLinkedin, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import logo from "@/assets/pystack_logo.png";

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground mt-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img 
              src={logo} 
              alt="Pystack Academy" 
              className="h-13 w-13 rounded-lg object-cover"
            />
            <span className="font-display text-lg font-bold">Pystack Academy</span>
          </div>
          <p className="text-sm text-navy-foreground/70 leading-relaxed">
            Empowering careers through industry-oriented software training and placement support.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-base">Quick Links</h4>
          <ul className="space-y-2 text-sm text-navy-foreground/70">
            <li><Link to="/" className="hover:text-primary-glow">Home</Link></li>
            <li><Link to="/about" className="hover:text-primary-glow">About</Link></li>
            <li><Link to="/courses" className="hover:text-primary-glow">Courses</Link></li>
            <li><Link to="/contact" className="hover:text-primary-glow">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-base">Contact</h4>
          <ul className="space-y-3 text-sm text-navy-foreground/70">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-0.5 text-primary-glow flex-shrink-0" /> 
              <span>Ashwath Nagar, 30, 1st cross,1st main, Ashwath nagar, Upstairs of punari chai, marathahalli, Bengaluru-560037</span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-primary-glow" /> 
              <span>+91 8618415182</span><br />
              <span>+91 8660298124</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-primary-glow" /> 
              <span>pystackacademy.in@gmail.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-base">Follow Us</h4>
          <div className="flex gap-3">
            {[FaLinkedin, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-lg bg-sidebar-accent hover:bg-primary transition-colors">
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-sidebar-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 text-xs text-navy-foreground/60 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Pystack Academy. All rights reserved.</span>
          <span>Built with passion for learners.</span>
        </div>
      </div>
    </footer>
  );
}