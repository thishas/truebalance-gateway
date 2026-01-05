import { ArrowLeft, ArrowUp, List, ChevronDown, ChevronRight, ChevronsUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

interface TocItem {
  id: string;
  label: string;
  level: number;
}

// Nested TOC structure matching the document
const tocSections: TocItem[] = [
  { id: "overview", label: "Overview", level: 2 },
  { id: "strategy-vs-order", label: "Understanding Strategy vs Order", level: 2 },
  { id: "strategy-how-applied", label: "Strategy = How extra money is applied", level: 3 },
  { id: "order-tab", label: "Order Tab", level: 2 },
  { id: "custom-rank", label: "Custom Rank Explained", level: 2 },
  { id: "common-scenarios", label: "Common Scenarios", level: 2 },
  { id: "key-takeaways", label: "Key Takeaways", level: 3 },
  { id: "strategy-tab", label: "Strategy Tab", level: 2 },
  { id: "debts-tab", label: "Debts Tab", level: 2 },
  { id: "debts-walkthrough", label: "Debts Tab – Detailed Walkthrough", level: 3 },
  { id: "schedule-tab", label: "Schedule Tab", level: 2 },
  { id: "charts-tab", label: "Charts Tab", level: 2 },
  { id: "cashflow-tab", label: "Budget Tab", level: 2 },
  { id: "budget-walkthrough", label: "Budget Tab – Detailed Walkthrough", level: 3 },
  { id: "accounts-section", label: "Accounts Section", level: 3 },
  { id: "bills-section", label: "Bills & Payments Section", level: 3 },
  { id: "budget-impact", label: "How the Budget Tab Impacts the Overall App", level: 3 },
  { id: "settings-tab", label: "Sync Tab", level: 2 },
  { id: "sync-walkthrough", label: "Sync Tab – Export & Import", level: 3 },
  { id: "export-debt-data", label: "Export Debt Data", level: 3 },
  { id: "export-budget-data", label: "Export Budget Data", level: 3 },
  { id: "import-debts", label: "Import Debts", level: 3 },
  { id: "import-accounts", label: "Import Accounts", level: 3 },
  { id: "import-bills", label: "Import Bills", level: 3 },
  { id: "data-management", label: "Data Management", level: 2 },
  { id: "sync-impact", label: "How the Sync Tab Impacts the Overall App", level: 3 },
  { id: "disclaimer", label: "Disclaimer", level: 2 },
];

const UserGuide = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(tocSections.filter(s => s.level === 2).map(s => s.id)));
  const detailsRefs = useRef<Map<string, HTMLDetailsElement>>(new Map());

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
      
      // Find active section
      const sections = tocSections.map(s => document.getElementById(s.id)).filter(Boolean);
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.getBoundingClientRect().top <= 100) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = useCallback((id: string) => {
    // First, expand the section if collapsed
    const detailsEl = detailsRefs.current.get(id);
    if (detailsEl && !detailsEl.open) {
      detailsEl.open = true;
      setExpandedSections(prev => new Set([...prev, id]));
    }

    // Also check if this is a subsection - find and expand parent
    const tocItem = tocSections.find(s => s.id === id);
    if (tocItem && tocItem.level === 3) {
      // Find parent H2 section
      const idx = tocSections.indexOf(tocItem);
      for (let i = idx - 1; i >= 0; i--) {
        if (tocSections[i].level === 2) {
          const parentDetailsEl = detailsRefs.current.get(tocSections[i].id);
          if (parentDetailsEl && !parentDetailsEl.open) {
            parentDetailsEl.open = true;
            setExpandedSections(prev => new Set([...prev, tocSections[i].id]));
          }
          break;
        }
      }
    }

    // Then scroll after a brief delay to let DOM update
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setShowToc(false);
      }
    }, 100);
  }, []);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(tocSections.filter(s => s.level === 2).map(s => s.id)));
    // Open all details elements
    detailsRefs.current.forEach((el) => {
      el.open = true;
    });
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
    // Close all details elements
    detailsRefs.current.forEach((el) => {
      el.open = false;
    });
  };

  const setDetailsRef = (id: string) => (el: HTMLDetailsElement | null) => {
    if (el) {
      detailsRefs.current.set(id, el);
    }
  };

  // Render TOC with nesting
  const renderTocItems = () => {
    return tocSections.map((section) => (
      <button
        key={section.id}
        onClick={() => scrollToSection(section.id)}
        className={`block w-full text-left text-sm hover:text-primary hover:bg-secondary/50 px-2 py-1.5 rounded transition-colors ${
          section.level === 3 ? "pl-6" : ""
        } ${activeSection === section.id ? "text-primary bg-secondary/50 font-medium" : "text-muted-foreground"}`}
      >
        {section.label}
      </button>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center justify-between h-14">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span className="font-semibold text-foreground">TrueBalance Planner</span>
          <button
            onClick={() => setShowToc(!showToc)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle table of contents"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Contents</span>
          </button>
        </div>
      </nav>

      {/* Table of Contents Dropdown */}
      {showToc && (
        <div className="fixed top-14 right-0 z-40 w-80 max-h-[80vh] overflow-y-auto bg-card border border-border shadow-lg rounded-bl-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Table of Contents</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={expandAll}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-secondary/50 transition-colors"
                  title="Expand all"
                >
                  Expand
                </button>
                <span className="text-muted-foreground">/</span>
                <button
                  onClick={collapseAll}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-secondary/50 transition-colors"
                  title="Collapse all"
                >
                  Collapse
                </button>
              </div>
            </div>
            <nav className="space-y-0.5">
              {renderTocItems()}
            </nav>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
            {/* Title */}
            <header className="text-center mb-12 not-prose">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                TrueBalance Planner — User Guide
              </h1>
              <p className="text-muted-foreground">Version 1.0 • Updated 2025</p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={expandAll}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronsUpDown className="w-4 h-4" />
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronsUpDown className="w-4 h-4" />
                  Collapse All
                </button>
              </div>
            </header>

            {/* Overview */}
            <details
              ref={setDetailsRef("overview")}
              open={expandedSections.has("overview")}
              onToggle={(e) => {
                const target = e.target as HTMLDetailsElement;
                if (target.open) {
                  setExpandedSections(prev => new Set([...prev, "overview"]));
                } else {
                  setExpandedSections(prev => {
                    const next = new Set(prev);
                    next.delete("overview");
                    return next;
                  });
                }
              }}
              className="mb-6 group"
            >
              <summary id="overview" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("overview") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Overview
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  TrueBalance Planner is a private, offline-first financial planning tool designed to help you understand your debt, choose payoff strategies, and visualize progress over time.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The app does not connect to banks, does not move money, and does not require accounts or logins. All data remains on your device unless you export it.
                </p>
              </div>
            </details>

            {/* Understanding Strategy vs Order */}
            <details
              ref={setDetailsRef("strategy-vs-order")}
              open={expandedSections.has("strategy-vs-order")}
              onToggle={(e) => {
                const target = e.target as HTMLDetailsElement;
                if (target.open) {
                  setExpandedSections(prev => new Set([...prev, "strategy-vs-order"]));
                } else {
                  setExpandedSections(prev => {
                    const next = new Set(prev);
                    next.delete("strategy-vs-order");
                    return next;
                  });
                }
              }}
              className="mb-6 group"
            >
              <summary id="strategy-vs-order" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("strategy-vs-order") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Understanding Strategy vs Order (Important)
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  TrueBalance Planner separates how payments are calculated from how debts are displayed and prioritized. This distinction gives you flexibility—but it's important to understand how they work together.
                </p>

                <h3 id="strategy-how-applied" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Strategy = How extra money is applied</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your Payoff Strategy determines which debt receives extra payment beyond minimums.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Available strategies include:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Snowball (Lowest Balance First)</strong> - Extra funds go to the smallest balance to build momentum.</li>
                  <li><strong>Avalanche (Highest APR First)</strong> - Extra funds go to the highest interest rate to reduce total interest paid.</li>
                  <li><strong>Order Entered</strong> - Debts are paid in the order you added them.</li>
                  <li><strong>No Snowball (Minimums Only)</strong> - Only minimum payments are applied. No extra payoff targeting.</li>
                  <li><strong>Custom Order (Highest Rank First / Lowest Rank First)</strong> - Extra funds follow your manually assigned ranks.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Strategy controls the math. It determines where extra payments go, not just the list order you see.
                </p>
              </div>
            </details>

            {/* Order Tab */}
            <details
              ref={setDetailsRef("order-tab")}
              open={expandedSections.has("order-tab")}
              onToggle={(e) => {
                const target = e.target as HTMLDetailsElement;
                if (target.open) {
                  setExpandedSections(prev => new Set([...prev, "order-tab"]));
                } else {
                  setExpandedSections(prev => {
                    const next = new Set(prev);
                    next.delete("order-tab");
                    return next;
                  });
                }
              }}
              className="mb-6 group"
            >
              <summary id="order-tab" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("order-tab") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Order Tab
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  How debts are sequenced and displayed
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The Order tab shows the actual payoff sequence based on your selected strategy and data.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">What you see here:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Which debt is the current target</li>
                  <li>The order debts will be paid off</li>
                  <li>Monthly interest impact per debt</li>
                  <li>Why that order was chosen (explanation panel)</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Order is the result, not the rule. It reflects the outcome of your strategy, balances, APRs, and ranks.
                </p>
              </div>
            </details>

            {/* Custom Rank Explained */}
            <details
              ref={setDetailsRef("custom-rank")}
              open={expandedSections.has("custom-rank")}
              onToggle={(e) => {
                const target = e.target as HTMLDetailsElement;
                if (target.open) {
                  setExpandedSections(prev => new Set([...prev, "custom-rank"]));
                } else {
                  setExpandedSections(prev => {
                    const next = new Set(prev);
                    next.delete("custom-rank");
                    return next;
                  });
                }
              }}
              className="mb-6 group"
            >
              <summary id="custom-rank" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("custom-rank") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Custom Rank Explained
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  Custom Rank is optional and only applies when using a Custom Order strategy.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">How Custom Rank works:</h4>
                <p className="text-muted-foreground leading-relaxed">
                  You assign a rank number to each debt (1, 2, 3…)
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Lower numbers = higher priority</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  The strategy determines whether:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Rank 1 is paid first, or</li>
                  <li>Highest rank is paid first</li>
                </ul>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">When Custom Rank is used:</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Custom Rank affects payoff order only if one of these strategies is selected:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Custom Order (Lowest Rank First)</li>
                  <li>Custom Order (Highest Rank First)</li>
                </ul>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">When Custom Rank is ignored:</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Custom Rank is not used when the strategy is:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Snowball</li>
                  <li>Avalanche</li>
                  <li>Order Entered</li>
                  <li>Minimums Only</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  If you enter ranks but choose Snowball or Avalanche, the ranks are saved—but not applied.
                </p>
              </div>
            </details>

            {/* Common Scenarios */}
            <details
              ref={setDetailsRef("common-scenarios")}
              open={expandedSections.has("common-scenarios")}
              onToggle={(e) => {
                const target = e.target as HTMLDetailsElement;
                if (target.open) {
                  setExpandedSections(prev => new Set([...prev, "common-scenarios"]));
                } else {
                  setExpandedSections(prev => {
                    const next = new Set(prev);
                    next.delete("common-scenarios");
                    return next;
                  });
                }
              }}
              className="mb-6 group"
            >
              <summary id="common-scenarios" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("common-scenarios") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Common Scenarios (Examples)
              </summary>
              <div className="pl-7">
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <p className="italic">"I ranked my debts, but Snowball changed the order."</p>
                    <p>✔ Expected behavior. Snowball ignores ranks and sorts by balance.</p>
                  </div>
                  <div>
                    <p className="italic">"I want to pay my car loan first no matter what."</p>
                    <p>✔ Use Custom Order and assign it Rank 1.</p>
                  </div>
                  <div>
                    <p className="italic">"Why does the Order tab look different after I change Strategy?"</p>
                    <p>✔ The Order tab updates instantly to reflect the new payoff logic.</p>
                  </div>
                </div>

                <h3 id="key-takeaways" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Key Takeaways</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Strategy = logic</li>
                  <li>Order = outcome</li>
                  <li>Custom Rank = optional override</li>
                  <li>Changing Strategy updates Order instantly</li>
                  <li>Nothing is locked—you can switch anytime</li>
                </ul>
              </div>
            </details>

            {/* Strategy Tab */}
            <details
              ref={setDetailsRef("strategy-tab")}
              open={expandedSections.has("strategy-tab")}
              onToggle={(e) => {
                const target = e.target as HTMLDetailsElement;
                if (target.open) {
                  setExpandedSections(prev => new Set([...prev, "strategy-tab"]));
                } else {
                  setExpandedSections(prev => {
                    const next = new Set(prev);
                    next.delete("strategy-tab");
                    return next;
                  });
                }
              }}
              className="mb-6 group"
            >
              <summary id="strategy-tab" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("strategy-tab") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Strategy Tab
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  The Strategy tab is where your payoff plan begins.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Monthly Budget:</h4>
                <p className="text-muted-foreground leading-relaxed">
                  This is the total amount you can consistently apply toward debt each month. When the budget is sufficient, the app confirms that all minimum payments are covered and shows how much extra is available to accelerate payoff.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If your budget is insufficient, the app will indicate that minimum payments cannot be met.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Payoff Strategies:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Snowball (Lowest Balance First):</strong> Pays off smallest balances first to build motivation through quick wins.</li>
                  <li><strong>Avalanche (Highest APR First):</strong> Targets highest interest debts first to minimize total interest paid.</li>
                  <li><strong>Order Entered:</strong> Pays debts in the order you added them.</li>
                  <li><strong>No Snowball (Minimums Only):</strong> Pays only minimum payments with no extra redistribution.</li>
                  <li><strong>Custom Order (Rank-Based):</strong> Lets you manually rank debts to control payoff priority.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Changing strategies instantly updates payoff order, schedule, and charts.
                </p>
              </div>
            </details>

            {/* Debts Tab */}
            <details
              ref={setDetailsRef("debts-tab")}
              open={expandedSections.has("debts-tab")}
              onToggle={(e) => {
                const target = e.target as HTMLDetailsElement;
                if (target.open) {
                  setExpandedSections(prev => new Set([...prev, "debts-tab"]));
                } else {
                  setExpandedSections(prev => {
                    const next = new Set(prev);
                    next.delete("debts-tab");
                    return next;
                  });
                }
              }}
              className="mb-6 group"
            >
              <summary id="debts-tab" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("debts-tab") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Debts Tab
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  Add and manage all debts in one place.
                </p>

                <p className="text-muted-foreground leading-relaxed mt-4">For each debt you enter:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Balance</li>
                  <li>APR</li>
                  <li>Minimum payment</li>
                  <li>Optional credit limit or notes</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Debts are used by the strategy engine to calculate payoff order, timelines, and interest.
                </p>

                <h3 id="debts-walkthrough" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Debts Tab – Detailed Walkthrough</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Debts tab provides a complete overview of everything you owe and is the foundation for all payoff calculations across the app.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Debt Overview Panel:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Total Balance:</strong> Combined remaining balance across all debts.</li>
                  <li><strong>Minimum Payments:</strong> Total required monthly payments.</li>
                  <li><strong>Active Debts:</strong> Number of debts included.</li>
                </ul>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Add Debt Button:</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Use this to enter a new debt into your plan.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Debt Cards:</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Each card shows balance, APR, minimum payment, monthly interest, and utilization (if applicable).
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Edit & Delete:</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Edit with the pencil icon or remove a debt with the trash icon.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Utilization Bar:</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Shown for credit cards when a credit limit is entered.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Monthly Interest:</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Estimated monthly interest cost for the debt.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Add New Debt Form:</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Required: Name, Balance, APR, Minimum Payment.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Optional: Custom Rank, Debt Type, Credit Limit, Fees.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Important Notes:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>All data is stored locally.</li>
                  <li>Changes update all views instantly.</li>
                  <li>Fees are informational only.</li>
                </ul>
              </div>
            </details>

            {/* Schedule Tab */}
            <details
              ref={setDetailsRef("schedule-tab")}
              open={expandedSections.has("schedule-tab")}
              onToggle={(e) => {
                const target = e.target as HTMLDetailsElement;
                if (target.open) {
                  setExpandedSections(prev => new Set([...prev, "schedule-tab"]));
                } else {
                  setExpandedSections(prev => {
                    const next = new Set(prev);
                    next.delete("schedule-tab");
                    return next;
                  });
                }
              }}
              className="mb-6 group"
            >
              <summary id="schedule-tab" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("schedule-tab") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Schedule Tab
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  The Schedule tab provides a month-by-month payoff timeline.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">Each row represents a payment period showing:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Payment amount</li>
                  <li>Allocation by debt</li>
                  <li>Remaining balances</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  This view helps you understand how long payoff will take and when debts will be eliminated.
                </p>
              </div>
            </details>

            {/* Charts Tab */}
            <details
              ref={setDetailsRef("charts-tab")}
              open={expandedSections.has("charts-tab")}
              onToggle={(e) => {
                const target = e.target as HTMLDetailsElement;
                if (target.open) {
                  setExpandedSections(prev => new Set([...prev, "charts-tab"]));
                } else {
                  setExpandedSections(prev => {
                    const next = new Set(prev);
                    next.delete("charts-tab");
                    return next;
                  });
                }
              }}
              className="mb-6 group"
            >
              <summary id="charts-tab" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("charts-tab") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Charts Tab — Visual Progress Tracking
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  The Charts tab provides three complementary visual views of your payoff journey.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">1. Total Balance View</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Shows your total remaining debt balance over time.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This view helps you see overall progress and understand how quickly your total debt is shrinking.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  A steeper downward slope indicates faster payoff progress.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">2. By Debt View</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Displays individual balance curves for each debt.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This view shows which debts are being paid off first and how strategies affect sequencing.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You can visually confirm snowball or avalanche behavior by observing which lines reach zero first.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">3. Interest Paid View</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Shows cumulative interest paid over time.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This view helps you understand the true cost of debt and compare strategies.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Avalanche strategies typically produce a lower final interest curve than Snowball.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Together, these charts provide clarity, motivation, and insight into tradeoffs between speed and interest savings.
                </p>
              </div>
            </details>

            {/* Budget Tab */}
            <details
              ref={setDetailsRef("cashflow-tab")}
              open={expandedSections.has("cashflow-tab")}
              onToggle={(e) => {
                const target = e.target as HTMLDetailsElement;
                if (target.open) {
                  setExpandedSections(prev => new Set([...prev, "cashflow-tab"]));
                } else {
                  setExpandedSections(prev => {
                    const next = new Set(prev);
                    next.delete("cashflow-tab");
                    return next;
                  });
                }
              }}
              className="mb-6 group"
            >
              <summary id="cashflow-tab" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("cashflow-tab") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Budget Tab
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  The Budget tab helps you track cashflow alongside debt payoff.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You can add accounts and recurring bills to see how debt payments affect available funds.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This ensures your payoff plan remains realistic and sustainable.
                </p>

                <h3 id="budget-walkthrough" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Budget Tab – Detailed Walkthrough</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Budget tab helps you track cash flow by connecting accounts, bills, and debt payments into a single monthly view. It shows where your money is, what's scheduled to leave, and what remains available after obligations.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This tab directly supports payoff planning by ensuring debts and bills are funded realistically.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Budget Overview Panel</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Located at the top of the tab, this panel summarizes your financial position for the selected period.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Total Balance:</strong> The combined balance of all active accounts.</li>
                  <li><strong>Upcoming:</strong> The total amount of planned bills and payments scheduled in the selected forecast period.</li>
                  <li><strong>Available:</strong> What remains after upcoming payments are deducted from total balances.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  <strong>Impact on App:</strong> These values help you quickly assess whether your current income can support both bills and debt payments without overdrawing accounts.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">View Toggle: List / Calendar</h4>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>List View:</strong> Shows accounts and bills in a structured list format for easy review and editing.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Calendar View:</strong> Displays bills visually by due date, helping you spot payment clustering and cash-flow pressure points.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Impact on App:</strong> Calendar view is especially useful for timing extra debt payments and avoiding shortfalls.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Forecast Period Selector</h4>
                <p className="text-muted-foreground leading-relaxed">Options include:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>This Month</li>
                  <li>Next 30 Days</li>
                  <li>Next Month</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">This filter updates:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Upcoming totals</li>
                  <li>Available balance</li>
                  <li>Bills shown in List and Calendar views</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Impact on App:</strong> Forecasting ahead helps prevent overcommitting funds to debt while upcoming bills are pending.
                </p>

                <h3 id="accounts-section" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Accounts Section</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Accounts represent where money comes from and where payments are made.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Account Cards</h4>
                <p className="text-muted-foreground leading-relaxed">Each account displays:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Account Name</li>
                  <li>Institution</li>
                  <li>Balance</li>
                  <li>Upcoming (total scheduled payments)</li>
                  <li>Available (balance minus upcoming payments)</li>
                  <li>Primary tag (optional)</li>
                </ul>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Edit / Delete Icons</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Allow updates or removal of accounts.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Add Account Modal</h4>
                <p className="text-muted-foreground leading-relaxed">Fields include:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Account Name (Required):</strong> Friendly name for the account.</li>
                  <li><strong>Institution (Optional):</strong> Bank or provider name.</li>
                  <li><strong>Current Balance (Required):</strong> Starting balance used for calculations.</li>
                  <li><strong>Primary Account (Optional):</strong> Marks the default account for bills and payments.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Impact on App:</strong> Account balances determine whether bills and debt payments are financially feasible.
                </p>

                <h3 id="bills-section" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Bills & Payments Section</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This section tracks all outgoing payments, including regular bills and debt minimums.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Bills List</h4>
                <p className="text-muted-foreground leading-relaxed">Each bill shows:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Status (Planned, Paid, Skipped)</li>
                  <li>Label</li>
                  <li>Category</li>
                  <li>Due Day</li>
                  <li>Amount</li>
                  <li>Auto / Linked indicators</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Linked:</strong> Indicates the bill is tied to a debt's minimum payment.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Auto:</strong> Indicates recurring or autopay-enabled bills.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Generate from Debt Minimums</h4>
                <p className="text-muted-foreground leading-relaxed">
                  This feature automatically creates bills based on debt minimum payments.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Pay From Account (Required):</strong> Selects the account used for payments.</li>
                  <li><strong>Select Debts:</strong> Choose which debt minimums to generate bills for.</li>
                  <li><strong>Generate Bills:</strong> Creates linked bills that stay synchronized with the Debts tab.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Impact on App:</strong> This prevents missed minimum payments and keeps budget and debt data aligned.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Add Bill / Payment Modal</h4>
                <p className="text-muted-foreground leading-relaxed">Fields include:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Pay From Account (Required):</strong> The account funding the payment.</li>
                  <li><strong>Link to Debt (Optional):</strong> Associates the bill with a debt minimum.</li>
                  <li><strong>Label (Required):</strong> Name of the bill (e.g., Rent, Electric, Netflix).</li>
                  <li><strong>Amount (Required):</strong> Payment amount.</li>
                  <li><strong>Status:</strong> Planned, Paid, or Skipped.</li>
                  <li><strong>Due Type:</strong> Monthly (Day of Month) or Exact Date.</li>
                  <li><strong>Due Day (1–31):</strong> Used for calendar placement.</li>
                  <li><strong>Frequency:</strong> Monthly or other recurrence patterns.</li>
                  <li><strong>Category:</strong> Used for grouping and reporting.</li>
                  <li><strong>Autopay Enabled:</strong> Flags payments that are automatic.</li>
                  <li><strong>Notes (Optional):</strong> Additional context for the payment.</li>
                </ul>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Calendar View Details</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Dots indicate scheduled payments.</li>
                  <li>Color coding aligns with accounts.</li>
                  <li>Selecting a date highlights bills due that day.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Impact on App:</strong> Helps users avoid overlapping bills that could reduce available funds for debt payoff.
                </p>

                <h3 id="budget-impact" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">How the Budget Tab Impacts the Overall App</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Controls cash-flow realism for debt payoff plans.</li>
                  <li>Ensures debt minimums are funded and visible.</li>
                  <li>Prevents over-allocation of money to extra payments.</li>
                  <li>Provides timing insight for payoff strategies.</li>
                  <li>Keeps debts, bills, and accounts synchronized.</li>
                </ul>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Key Notes for Users</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Budget data updates instantly across the app.</li>
                  <li>Linked debt bills stay in sync with debt changes.</li>
                  <li>Calendar view is ideal for spotting risk days.</li>
                  <li>All data is stored locally.</li>
                </ul>
              </div>
            </details>

            {/* Sync Tab */}
            <details
              ref={setDetailsRef("settings-tab")}
              open={expandedSections.has("settings-tab")}
              onToggle={(e) => {
                const target = e.target as HTMLDetailsElement;
                if (target.open) {
                  setExpandedSections(prev => new Set([...prev, "settings-tab"]));
                } else {
                  setExpandedSections(prev => {
                    const next = new Set(prev);
                    next.delete("settings-tab");
                    return next;
                  });
                }
              }}
              className="mb-6 group"
            >
              <summary id="settings-tab" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("settings-tab") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Sync Tab
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  TrueBalance Planner is privacy-first.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>No accounts or sign-ups required.</li>
                  <li>No tracking or analytics.</li>
                  <li>No cloud storage or background syncing.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Use Export to save backups or transfer plans between devices.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Clearing browser or app storage removes all local data.
                </p>

                <h3 id="sync-walkthrough" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Sync Tab – Export & Import (Manual Sync)</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Sync tab allows you to back up, transfer, and restore your financial data manually. TrueBalance Planner does not use accounts, logins, or cloud synchronization—your data always stays on your device unless you explicitly export it.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This tab gives you full control over when and how your data is shared.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Export & Import (Manual Sync) Overview Panel</h4>
                <p className="text-muted-foreground leading-relaxed">
                  This section summarizes the current plan and device state.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Plan ID:</strong> A unique identifier for your current plan instance.</li>
                  <li><strong>Version:</strong> The app version used to create the plan.</li>
                  <li><strong>Debts:</strong> Total number of debts included in the plan.</li>
                  <li><strong>Last Updated on This Device:</strong> Timestamp showing the most recent change saved locally.</li>
                </ul>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Export Plan</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Exports all app data into a single backup file, including:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Debts</li>
                  <li>Payoff order</li>
                  <li>Budget accounts</li>
                  <li>Bills and schedules</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">Use this to:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Create a full backup</li>
                  <li>Transfer data to another device</li>
                  <li>Preserve a snapshot before making major changes</li>
                </ul>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Import Plan</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Restores a previously exported plan file.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Important:</strong> Importing a plan replaces all existing data on the current device.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">Use this to:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Restore a backup</li>
                  <li>Continue a plan on a new device</li>
                  <li>Recover data after clearing sample data</li>
                </ul>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Privacy-First Notice</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Your data is stored locally on your device.
                </p>

                <h3 id="export-debt-data" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Export Debt Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Download debt-related data in common formats.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Export Debts (CSV):</strong> Exports all debts and key fields for spreadsheet editing or analysis.</li>
                  <li><strong>Export Schedule (CSV):</strong> Exports the payoff order and payment sequence.</li>
                  <li><strong>Export Summary (TXT):</strong> Exports a readable debt overview summary.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Impact on App:</strong> Exporting does not change your data—it creates copies only.
                </p>

                <h3 id="export-budget-data" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Export Budget Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Download budget-related information.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Export Budget Accounts (CSV):</strong> Exports all accounts and balances.</li>
                  <li><strong>Export Budget Bills (CSV):</strong> Exports all bills and payment details.</li>
                  <li><strong>Export Budget Summary (TXT):</strong> Provides a readable snapshot of budget totals.</li>
                </ul>

                <h3 id="import-debts" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Import Debts</h3>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Import from CSV:</strong> Uploads a debt file using the required format.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Importing debts replaces all existing debts.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Debts CSV Format</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-muted-foreground text-sm border border-border rounded-lg">
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-4 py-2 font-medium">name</td>
                        <td className="px-4 py-2">Debt name (text)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-2 font-medium">balance</td>
                        <td className="px-4 py-2">Current balance (number)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-2 font-medium">apr</td>
                        <td className="px-4 py-2">Annual rate (e.g., 19.5 or 0.195)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-2 font-medium">minPayment</td>
                        <td className="px-4 py-2">Minimum payment (number)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-2 font-medium">customRank</td>
                        <td className="px-4 py-2">Optional priority order</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">creditLimit</td>
                        <td className="px-4 py-2">Optional (used for utilization)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 id="import-accounts" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Import Accounts</h3>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Import Accounts from CSV:</strong> Uploads accounts using the defined template.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Importing accounts replaces all existing accounts.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Accounts CSV Format</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-muted-foreground text-sm border border-border rounded-lg">
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-4 py-2 font-medium">accountName</td>
                        <td className="px-4 py-2">Required</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-2 font-medium">institution</td>
                        <td className="px-4 py-2">Optional</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-2 font-medium">currentBalance</td>
                        <td className="px-4 py-2">Required (number)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="px-4 py-2 font-medium">notes</td>
                        <td className="px-4 py-2">Optional</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">isPrimary</td>
                        <td className="px-4 py-2">TRUE/FALSE (optional)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 id="import-bills" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Import Bills</h3>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Import Bills from CSV:</strong> Uploads all bills using the provided template.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Importing bills replaces all existing bills.
                </p>
              </div>
            </details>

            {/* Data Management */}
            <details
              ref={setDetailsRef("data-management")}
              open={expandedSections.has("data-management")}
              onToggle={(e) => {
                const target = e.target as HTMLDetailsElement;
                if (target.open) {
                  setExpandedSections(prev => new Set([...prev, "data-management"]));
                } else {
                  setExpandedSections(prev => {
                    const next = new Set(prev);
                    next.delete("data-management");
                    return next;
                  });
                }
              }}
              className="mb-6 group"
            >
              <summary id="data-management" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("data-management") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Data Management
              </summary>
              <div className="pl-7">
                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Sample Data Loaded</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Indicates the app is using example data.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Clear Sample Data</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Removes all sample content and resets the app for real use.
                </p>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Best Practice:</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Export your plan before clearing data if you want to keep it.
                </p>

                <h3 id="sync-impact" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">How the Sync Tab Impacts the Overall App</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Enables secure backups without accounts or cloud storage</li>
                  <li>Allows device-to-device transfers</li>
                  <li>Supports spreadsheet-based bulk edits</li>
                  <li>Provides disaster recovery options</li>
                  <li>Keeps users fully in control of their data</li>
                </ul>

                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Key Notes for Users</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Imports always replace existing data</li>
                  <li>Exports never modify app data</li>
                  <li>CSV templates must match required formats</li>
                  <li>All syncing is manual by design</li>
                </ul>
              </div>
            </details>

            {/* Disclaimer */}
            <details
              ref={setDetailsRef("disclaimer")}
              open={expandedSections.has("disclaimer")}
              onToggle={(e) => {
                const target = e.target as HTMLDetailsElement;
                if (target.open) {
                  setExpandedSections(prev => new Set([...prev, "disclaimer"]));
                } else {
                  setExpandedSections(prev => {
                    const next = new Set(prev);
                    next.delete("disclaimer");
                    return next;
                  });
                }
              }}
              className="mb-6 group"
            >
              <summary id="disclaimer" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("disclaimer") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Disclaimer
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  TrueBalance Planner is provided for educational and planning purposes only.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  It does not provide financial, legal, or tax advice.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Calculations are estimates and actual results may vary.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Always verify information with your financial institutions or a qualified professional.
                </p>
              </div>
            </details>
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 TrueBalance Planner. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserGuide;
