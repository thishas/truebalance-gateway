import { ArrowLeft, ArrowUp, List, ChevronDown, ChevronRight, ChevronsUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

interface TocItem {
  id: string;
  label: string;
  level: number;
}

// Nested TOC structure matching the document exactly
const tocSections: TocItem[] = [
  { id: "overview", label: "Overview", level: 2 },
  { id: "strategy-vs-order", label: "Understanding Strategy vs Order (Important)", level: 2 },
  { id: "strategy-how-applied", label: "Strategy = How extra money is applied", level: 3 },
  { id: "order-how-displayed", label: "Order Tab = How debts are sequenced and displayed", level: 3 },
  { id: "custom-rank", label: "Custom Rank Explained", level: 2 },
  { id: "common-scenarios", label: "Common Scenarios (Examples)", level: 2 },
  { id: "key-takeaways", label: "Key Takeaways", level: 3 },
  { id: "strategy-tab", label: "Strategy Tab", level: 2 },
  { id: "monthly-budget", label: "Monthly Budget:", level: 3 },
  { id: "payoff-strategies", label: "Payoff Strategies:", level: 3 },
  { id: "debts-tab", label: "Debts Tab", level: 2 },
  { id: "debts-walkthrough", label: "Debts Tab – Detailed Walkthrough", level: 2 },
  { id: "debt-overview-panel", label: "Debt Overview Panel:", level: 3 },
  { id: "add-debt-button", label: "Add Debt Button:", level: 3 },
  { id: "debt-cards", label: "Debt Cards:", level: 3 },
  { id: "edit-delete", label: "Edit & Delete:", level: 3 },
  { id: "utilization-bar", label: "Utilization Bar:", level: 3 },
  { id: "monthly-interest", label: "Monthly Interest:", level: 3 },
  { id: "add-new-debt-form", label: "Add New Debt Form:", level: 3 },
  { id: "important-notes-debts", label: "Important Notes:", level: 3 },
  { id: "order-tab", label: "Order Tab", level: 2 },
  { id: "schedule-tab", label: "Schedule Tab", level: 2 },
  { id: "charts-tab", label: "Charts Tab — Visual Progress Tracking", level: 2 },
  { id: "total-balance-view", label: "1. Total Balance View", level: 3 },
  { id: "by-debt-view", label: "2. By Debt View", level: 3 },
  { id: "interest-paid-view", label: "3. Interest Paid View", level: 3 },
  { id: "budget-tab", label: "Budget Tab", level: 2 },
  { id: "budget-walkthrough", label: "Budget Tab – Detailed Walkthrough", level: 2 },
  { id: "budget-overview-panel", label: "Budget Overview Panel", level: 3 },
  { id: "view-toggle", label: "View Toggle: List / Calendar", level: 3 },
  { id: "forecast-period", label: "Forecast Period Selector", level: 3 },
  { id: "accounts-section", label: "Accounts Section", level: 3 },
  { id: "bills-section", label: "Bills & Payments Section", level: 3 },
  { id: "generate-from-minimums", label: "Generate from Debt Minimums", level: 3 },
  { id: "add-bill-modal", label: "Add Bill / Payment Modal", level: 3 },
  { id: "calendar-view-details", label: "Calendar View Details", level: 3 },
  { id: "budget-impact", label: "How the Budget Tab Impacts the Overall App", level: 3 },
  { id: "budget-key-notes", label: "Key Notes for Users", level: 3 },
  { id: "sync-tab", label: "Sync Tab", level: 2 },
  { id: "sync-walkthrough", label: "Sync Tab – Export & Import (Manual Sync)", level: 2 },
  { id: "sync-overview-panel", label: "Export & Import (Manual Sync) Overview Panel", level: 3 },
  { id: "export-plan", label: "Export Plan", level: 3 },
  { id: "import-plan", label: "Import Plan", level: 3 },
  { id: "privacy-first-notice", label: "Privacy-First Notice", level: 3 },
  { id: "export-debt-data", label: "Export Debt Data", level: 3 },
  { id: "export-budget-data", label: "Export Budget Data", level: 3 },
  { id: "import-debts", label: "Import Debts", level: 3 },
  { id: "import-accounts", label: "Import Accounts", level: 3 },
  { id: "import-bills", label: "Import Bills", level: 3 },
  { id: "data-management", label: "Data Management", level: 3 },
  { id: "sync-impact", label: "How the Sync Tab Impacts the Overall App", level: 3 },
  { id: "sync-key-notes", label: "Key Notes for Users", level: 3 },
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

  const findParentH2 = (id: string): string | null => {
    const idx = tocSections.findIndex(s => s.id === id);
    if (idx === -1) return null;
    for (let i = idx - 1; i >= 0; i--) {
      if (tocSections[i].level === 2) {
        return tocSections[i].id;
      }
    }
    return null;
  };

  const scrollToSection = useCallback((id: string) => {
    const tocItem = tocSections.find(s => s.id === id);
    
    // If this is an H3, find and expand its parent H2 first
    if (tocItem && tocItem.level === 3) {
      const parentId = findParentH2(id);
      if (parentId) {
        const parentDetailsEl = detailsRefs.current.get(parentId);
        if (parentDetailsEl && !parentDetailsEl.open) {
          parentDetailsEl.open = true;
          setExpandedSections(prev => new Set([...prev, parentId]));
        }
      }
    }

    // Expand the section if it's a collapsible H2
    const detailsEl = detailsRefs.current.get(id);
    if (detailsEl && !detailsEl.open) {
      detailsEl.open = true;
      setExpandedSections(prev => new Set([...prev, id]));
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

  const expandAll = () => {
    setExpandedSections(new Set(tocSections.filter(s => s.level === 2).map(s => s.id)));
    detailsRefs.current.forEach((el) => {
      el.open = true;
    });
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
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

  const createToggleHandler = (id: string) => (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const target = e.target as HTMLDetailsElement;
    if (target.open) {
      setExpandedSections(prev => new Set([...prev, id]));
    } else {
      setExpandedSections(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
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
              onToggle={createToggleHandler("overview")}
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
              onToggle={createToggleHandler("strategy-vs-order")}
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

                <h3 id="order-how-displayed" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Order Tab = How debts are sequenced and displayed</h3>
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
              onToggle={createToggleHandler("custom-rank")}
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
              onToggle={createToggleHandler("common-scenarios")}
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
              onToggle={createToggleHandler("strategy-tab")}
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

                <h3 id="monthly-budget" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Monthly Budget:</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This is the total amount you can consistently apply toward debt each month. When the budget is sufficient, the app confirms that all minimum payments are covered and shows how much extra is available to accelerate payoff.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If your budget is insufficient, the app will indicate that minimum payments cannot be met.
                </p>

                <h3 id="payoff-strategies" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Payoff Strategies:</h3>
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
              onToggle={createToggleHandler("debts-tab")}
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
              </div>
            </details>

            {/* Debts Tab – Detailed Walkthrough */}
            <details
              ref={setDetailsRef("debts-walkthrough")}
              open={expandedSections.has("debts-walkthrough")}
              onToggle={createToggleHandler("debts-walkthrough")}
              className="mb-6 group"
            >
              <summary id="debts-walkthrough" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("debts-walkthrough") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Debts Tab – Detailed Walkthrough
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  The Debts tab provides a complete overview of everything you owe and is the foundation for all payoff calculations across the app.
                </p>

                <h3 id="debt-overview-panel" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Debt Overview Panel:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Total Balance:</strong> Combined remaining balance across all debts.</li>
                  <li><strong>Minimum Payments:</strong> Total required monthly payments.</li>
                  <li><strong>Active Debts:</strong> Number of debts included.</li>
                </ul>

                <h3 id="add-debt-button" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Add Debt Button:</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use this to enter a new debt into your plan.
                </p>

                <h3 id="debt-cards" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Debt Cards:</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Each card shows balance, APR, minimum payment, monthly interest, and utilization (if applicable).
                </p>

                <h3 id="edit-delete" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Edit & Delete:</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Edit with the pencil icon or remove a debt with the trash icon.
                </p>

                <h3 id="utilization-bar" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Utilization Bar:</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Shown for credit cards when a credit limit is entered.
                </p>

                <h3 id="monthly-interest" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Monthly Interest:</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Estimated monthly interest cost for the debt.
                </p>

                <h3 id="add-new-debt-form" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Add New Debt Form:</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Required: Name, Balance, APR, Minimum Payment.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Optional: Custom Rank, Debt Type, Credit Limit, Fees.
                </p>

                <h3 id="important-notes-debts" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Important Notes:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>All data is stored locally.</li>
                  <li>Changes update all views instantly.</li>
                  <li>Fees are informational only.</li>
                </ul>
              </div>
            </details>

            {/* Order Tab */}
            <details
              ref={setDetailsRef("order-tab")}
              open={expandedSections.has("order-tab")}
              onToggle={createToggleHandler("order-tab")}
              className="mb-6 group"
            >
              <summary id="order-tab" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("order-tab") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Order Tab
              </summary>
              <div className="pl-7">
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

            {/* Schedule Tab */}
            <details
              ref={setDetailsRef("schedule-tab")}
              open={expandedSections.has("schedule-tab")}
              onToggle={createToggleHandler("schedule-tab")}
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
              onToggle={createToggleHandler("charts-tab")}
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

                <h3 id="total-balance-view" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">1. Total Balance View</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Shows your total remaining debt balance over time.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This view helps you see overall progress and understand how quickly your total debt is shrinking.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  A steeper downward slope indicates faster payoff progress.
                </p>

                <h3 id="by-debt-view" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">2. By Debt View</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Displays individual balance curves for each debt.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This view shows which debts are being paid off first and how strategies affect sequencing.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You can visually confirm snowball or avalanche behavior by observing which lines reach zero first.
                </p>

                <h3 id="interest-paid-view" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">3. Interest Paid View</h3>
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
              ref={setDetailsRef("budget-tab")}
              open={expandedSections.has("budget-tab")}
              onToggle={createToggleHandler("budget-tab")}
              className="mb-6 group"
            >
              <summary id="budget-tab" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("budget-tab") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Budget Tab
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  The Budget tab tracks income accounts, bills, and upcoming expenses to ensure your payoff plan is realistic.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">Components include:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Accounts:</strong> Represent where payments are made from (e.g., checking account).</li>
                  <li><strong>Bills:</strong> Monthly expenses and scheduled payments including debt minimums.</li>
                  <li><strong>View Toggle:</strong> Switch between List view and Calendar view.</li>
                  <li><strong>Forecast Period:</strong> View upcoming bills for this week, month, or next month.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  The Budget tab helps ensure you have cash flow visibility before committing funds to extra debt payments.
                </p>
              </div>
            </details>

            {/* Budget Tab – Detailed Walkthrough */}
            <details
              ref={setDetailsRef("budget-walkthrough")}
              open={expandedSections.has("budget-walkthrough")}
              onToggle={createToggleHandler("budget-walkthrough")}
              className="mb-6 group"
            >
              <summary id="budget-walkthrough" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("budget-walkthrough") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Budget Tab – Detailed Walkthrough
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  This section provides a detailed breakdown of every component in the Budget tab.
                </p>

                <h3 id="budget-overview-panel" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Budget Overview Panel</h3>
                <p className="text-muted-foreground leading-relaxed">
                  At the top of the tab, you see:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Total Balance:</strong> Combined balance of all accounts.</li>
                  <li><strong>Upcoming:</strong> Total amount due in the selected forecast period.</li>
                  <li><strong>Available:</strong> Balance minus upcoming payments.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Impact on App:</strong> This panel helps you see whether you can comfortably fund extra debt payments.
                </p>

                <h3 id="view-toggle" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">View Toggle: List / Calendar</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>List View:</strong> Shows bills grouped with details.</li>
                  <li><strong>Calendar View:</strong> Displays bills on a monthly calendar.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  <strong>Impact on App:</strong> Choose the view that helps you plan your monthly cash flow.
                </p>

                <h3 id="forecast-period" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Forecast Period Selector</h3>
                <p className="text-muted-foreground leading-relaxed">Options include:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>This Week</li>
                  <li>This Month</li>
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

                <h3 id="generate-from-minimums" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Generate from Debt Minimums</h3>
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

                <h3 id="add-bill-modal" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Add Bill / Payment Modal</h3>
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

                <h3 id="calendar-view-details" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Calendar View Details</h3>
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

                <h3 id="budget-key-notes" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Key Notes for Users</h3>
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
              ref={setDetailsRef("sync-tab")}
              open={expandedSections.has("sync-tab")}
              onToggle={createToggleHandler("sync-tab")}
              className="mb-6 group"
            >
              <summary id="sync-tab" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("sync-tab") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
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
              </div>
            </details>

            {/* Sync Tab – Export & Import (Manual Sync) */}
            <details
              ref={setDetailsRef("sync-walkthrough")}
              open={expandedSections.has("sync-walkthrough")}
              onToggle={createToggleHandler("sync-walkthrough")}
              className="mb-6 group"
            >
              <summary id="sync-walkthrough" className="scroll-mt-20 cursor-pointer list-none flex items-center gap-2 text-2xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                {expandedSections.has("sync-walkthrough") ? <ChevronDown className="w-5 h-5 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 flex-shrink-0" />}
                Sync Tab – Export & Import (Manual Sync)
              </summary>
              <div className="pl-7">
                <p className="text-muted-foreground leading-relaxed">
                  The Sync tab allows you to back up, transfer, and restore your financial data manually. TrueBalance Planner does not use accounts, logins, or cloud synchronization—your data always stays on your device unless you explicitly export it.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This tab gives you full control over when and how your data is shared.
                </p>

                <h3 id="sync-overview-panel" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Export & Import (Manual Sync) Overview Panel</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This section summarizes the current plan and device state.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Plan ID:</strong> A unique identifier for your current plan instance.</li>
                  <li><strong>Version:</strong> The app version used to create the plan.</li>
                  <li><strong>Debts:</strong> Total number of debts included in the plan.</li>
                  <li><strong>Last Updated on This Device:</strong> Timestamp showing the most recent change saved locally.</li>
                </ul>

                <h3 id="export-plan" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Export Plan</h3>
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

                <h3 id="import-plan" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Import Plan</h3>
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

                <h3 id="privacy-first-notice" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Privacy-First Notice</h3>
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

                <h3 id="data-management" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Data Management</h3>
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

                <h3 id="sync-key-notes" className="scroll-mt-20 text-xl font-semibold text-foreground mt-6 mb-3">Key Notes for Users</h3>
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
              onToggle={createToggleHandler("disclaimer")}
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
