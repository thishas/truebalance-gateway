import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container py-12 md:py-16">
        <article className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 2025
            </p>
          </div>

          {/* Content Cards */}
          <div className="space-y-6 animate-fade-in-delay">
            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Your Data Stays Private
                  </h2>
                  <p className="text-muted-foreground">
                    TrueBalance Planner is designed with privacy as a core principle. 
                    All your financial data is stored locally on your device and never 
                    transmitted to external servers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    No Tracking or Analytics
                  </h2>
                  <p className="text-muted-foreground">
                    We do not use cookies, analytics, or any tracking technologies. 
                    Your usage of the app remains completely private.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Summary
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>No account or sign-up required</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>All data stored locally on your device</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>No data collection or transmission</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>No cookies or tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Works completely offline</span>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 TrueBalance Planner
            </p>
            <nav className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="text-sm text-foreground font-medium"
              >
                Privacy
              </Link>
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
