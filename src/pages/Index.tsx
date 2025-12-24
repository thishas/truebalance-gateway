import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, WifiOff, UserX, EyeOff, Shield, Mail } from "lucide-react";
import heroVideo from "@/assets/hero-background.mp4";

const APP_URL = "#"; // Replace with actual app URL

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

type SectionId = "home" | "about" | "privacy" | "disclaimer" | "contact";

const Index = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("home");

  const openApp = useCallback(() => {
    window.location.href = APP_URL;
  }, []);

  useEffect(() => {
    const sectionIds: SectionId[] = ["about", "privacy", "disclaimer", "contact"];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      // Check if we're at the top (Home)
      if (scrollPosition < 300) {
        setActiveSection("home");
        return;
      }

      // Check each section
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavClassName = (section: SectionId) => {
    const baseClass = "text-sm transition-colors";
    if (activeSection === section) {
      return `${baseClass} text-primary font-medium border-b-2 border-primary pb-0.5`;
    }
    return `${baseClass} text-muted-foreground hover:text-foreground`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center justify-between h-14">
          <span className="font-semibold text-foreground">TrueBalance Planner</span>
          <div className="flex items-center gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={getNavClassName("home")}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={getNavClassName("about")}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("privacy")}
              className={getNavClassName("privacy")}
            >
              Privacy
            </button>
            <button
              onClick={() => scrollToSection("disclaimer")}
              className={getNavClassName("disclaimer")}
            >
              Disclaimer
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={getNavClassName("contact")}
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Video Background */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-14">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]" />

        {/* Hero Content */}
        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
            {/* App Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>

            {/* App Name */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance">
              TrueBalance Planner
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-white/95 font-medium">
              Plan smarter. Pay down debt. Know what's left.
            </p>

            {/* Value Statement */}
            <p className="text-lg text-white/85 max-w-lg mx-auto animate-fade-in-delay">
              A private, offline-first planner for debt payoff and cashflow clarity.
            </p>

            {/* CTA Button */}
            <div className="pt-4 animate-fade-in-delay-2">
              <Button
                variant="hero"
                size="xl"
                onClick={openApp}
                className="shadow-xl"
              >
                Open App
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Privacy Note */}
            <p className="text-sm text-white/70 max-w-md mx-auto">
              No account. No tracking. Your data stays on your device.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <TrustCard
              icon={<WifiOff className="w-6 h-6 text-primary" />}
              title="Works Offline"
              description="All data stays on your device."
            />
            <TrustCard
              icon={<UserX className="w-6 h-6 text-primary" />}
              title="No Accounts Required"
              description="No sign-ups or logins."
            />
            <TrustCard
              icon={<EyeOff className="w-6 h-6 text-primary" />}
              title="No Tracking"
              description="No analytics, cookies, or background sync."
            />
            <TrustCard
              icon={<Shield className="w-6 h-6 text-primary" />}
              title="Private by Design"
              description="You control your data at all times."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-16 bg-secondary/30 scroll-mt-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              About TrueBalance Planner
            </h2>
            
            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                TrueBalance Planner is a private, offline-first planning tool designed to help users 
                understand their debt, plan payoff strategies, and manage cashflow across accounts.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The app does not connect to financial institutions, does not move money, and does not 
                require accounts or logins.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                All data is stored locally on your device unless you choose to export it.
              </p>

              <div className="pt-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Key Capabilities</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Debt payoff planning with multiple strategies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Cashflow visibility across accounts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Clean, distraction-free interface</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Designed for clarity, not complexity</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="py-12 md:py-16 bg-background scroll-mt-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
              Privacy Policy
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Last updated: January 2025
            </p>

            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Your Data Stays Private</h3>
                <p className="text-muted-foreground leading-relaxed">
                  TrueBalance Planner is designed with privacy as a core principle. All financial data is 
                  stored locally on your device and never transmitted to external servers.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">No Tracking or Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We do not use cookies, analytics, or any tracking technologies. Your usage of the app 
                  remains completely private.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="text-lg font-semibold text-foreground mb-4">Summary</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">No account or sign-up required</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">All data stored locally on your device</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">No data collection or transmission</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">No cookies or tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-muted-foreground">Works completely offline</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section id="disclaimer" className="py-12 md:py-16 bg-secondary/30 scroll-mt-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 border-l-4 border-primary">
              <h2 className="text-xl font-semibold text-foreground mb-4">Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                TrueBalance Planner is provided for educational and planning purposes only.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                It does not provide financial, legal, or tax advice. Calculations are estimates based 
                on the information you enter and standard formulas. Actual results may vary.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Always verify details with your financial institutions or a qualified professional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-16 bg-background scroll-mt-16">
        <div className="container">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary mb-4">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Contact & Feedback</h2>
              <p className="text-muted-foreground mb-4">
                We welcome feedback, questions, and bug reports.
              </p>
              <a
                href="mailto:cognitpath@gmail.com?subject=TrueBalance%20Planner%20Feedback"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                cognitpath@gmail.com
              </a>
              <p className="text-sm text-muted-foreground mt-4">
                Please do not include sensitive personal or banking information in your message.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <nav className="flex items-center justify-center gap-6">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={getNavClassName("home")}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("privacy")}
                className={getNavClassName("privacy")}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => scrollToSection("disclaimer")}
                className={getNavClassName("disclaimer")}
              >
                Disclaimer
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className={getNavClassName("about")}
              >
                About
              </button>
            </nav>
            
            <p className="text-sm text-muted-foreground">
              © 2025 TrueBalance Planner. All rights reserved.
            </p>
            
            <p className="text-xs text-muted-foreground/70 max-w-md mx-auto">
              TrueBalance Planner, its design, content, and calculation logic are protected by copyright. 
              Unauthorized reproduction or distribution is prohibited.
            </p>
          </div>
        </div>

        {/* No-JS fallback */}
        <noscript>
          <div className="container pt-6">
            <p className="text-sm text-muted-foreground text-center">
              JavaScript is disabled. Please use the{" "}
              <a href={APP_URL} className="text-primary hover:underline">
                Open App
              </a>{" "}
              link above to access TrueBalance Planner.
            </p>
          </div>
        </noscript>
      </footer>
    </div>
  );
};

interface TrustCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const TrustCard = ({ icon, title, description }: TrustCardProps) => (
  <div className="bg-card rounded-xl shadow-card p-5 text-center hover:shadow-card-hover transition-shadow">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary mb-3">
      {icon}
    </div>
    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Index;
