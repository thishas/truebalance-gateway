import { Link } from "react-router-dom";
import { ArrowLeft, Target, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
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
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              About TrueBalance
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              A simple, private tool to help you understand your finances better.
            </p>
          </div>

          {/* Content Cards */}
          <div className="space-y-6 animate-fade-in-delay">
            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Our Mission
                  </h2>
                  <p className="text-muted-foreground">
                    TrueBalance Planner was built to give everyone access to 
                    simple, effective financial planning tools. We believe 
                    managing your money shouldn't be complicated or require 
                    sharing your personal data.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    How It Works
                  </h2>
                  <p className="text-muted-foreground">
                    Enter your income, debts, and expenses. TrueBalance calculates 
                    your optimal payoff strategy and shows you exactly what's left 
                    after each payment. No sync, no cloud, no complexity.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Key Features
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Debt payoff planning with multiple strategies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Cashflow visibility and projections</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Offline-first design for privacy</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span>Clean, distraction-free interface</span>
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
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/about"
                className="text-sm text-foreground font-medium"
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

export default About;
