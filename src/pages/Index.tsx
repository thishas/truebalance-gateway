import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Smartphone, X } from "lucide-react";

const APP_URL = "#"; // Replace with actual app URL
const REDIRECT_DELAY = 2000; // 2 seconds

const Index = () => {
  const [countdown, setCountdown] = useState(2);
  const [isRedirecting, setIsRedirecting] = useState(true);

  const cancelRedirect = useCallback(() => {
    setIsRedirecting(false);
  }, []);

  const openApp = useCallback(() => {
    // Navigate immediately to the app
    window.location.href = APP_URL;
  }, []);

  useEffect(() => {
    if (!isRedirecting) return;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      if (isRedirecting) {
        openApp();
      }
    }, REDIRECT_DELAY);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimeout);
    };
  }, [isRedirecting, openApp]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        {/* Gradient Hero */}
        <section className="gradient-hero relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10 py-16 md:py-24 lg:py-32">
            <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
              {/* App Icon Placeholder */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg mb-4">
                <Shield className="w-10 h-10 text-white" />
              </div>

              {/* App Name */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance">
                TrueBalance Planner
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/90 font-medium">
                Plan smarter. Pay down debt. Know what's left.
              </p>

              {/* Value Statement */}
              <p className="text-lg text-white/80 max-w-lg mx-auto animate-fade-in-delay">
                A private, offline-first planner for debt payoff and cashflow clarity.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-delay-2">
                <Button
                  variant="hero"
                  size="xl"
                  onClick={openApp}
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/95 shadow-xl"
                >
                  Open App
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Redirect Notice */}
              {isRedirecting && (
                <div className="flex items-center justify-center gap-3 pt-6">
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse-soft" />
                    <span>Redirecting to app in {countdown}s...</span>
                  </div>
                  <button
                    onClick={cancelRedirect}
                    className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Card */}
        <section className="flex-1 bg-background">
          <div className="container py-12 md:py-16">
            <div className="max-w-md mx-auto">
              <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 space-y-6 animate-fade-in-delay">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Works Offline
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Your financial data stays on your device. No cloud sync required.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Private & Secure
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      No account needed. Your data never leaves your device.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 TrueBalance Planner
            </p>
            <nav className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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

        {/* No-JS fallback */}
        <noscript>
          <div className="container pb-6">
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

export default Index;
