
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Report } from '@/types';
import { mockReports, reportCategories } from '@/lib/data';
import { ReportCard } from '@/components/ReportCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, LayoutDashboard, X } from 'lucide-react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

export default function LossInsightsHubPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [mounted, setMounted] = useState(false);
  
  // Correctly call useSidebar at the top level
  const sidebarContext = useSidebar();
  const isMobile = sidebarContext ? sidebarContext.isMobile : undefined; // Handle potential null if context not ready

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSummaryUpdate = (reportId: string, summary: string) => {
    setReports(prevReports => 
      prevReports.map(r => r.id === reportId ? { ...r, aiSummary: summary, description: summary } : r)
    );
  };

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.aiSummary || report.description).toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.tags && report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = selectedCategory ? report.category === selectedCategory : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, reports]);

  if (!mounted || isMobile === undefined) { // Also wait for isMobile to be defined
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-background">
        <LayoutDashboard className="h-16 w-16 text-primary mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold font-headline text-primary">Loading Loss Insights Hub...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="sticky top-0 z-40 bg-background border-b border-border flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             {isMobile && <SidebarTrigger className="text-foreground"/>}
            <h1 className="text-xl font-semibold text-foreground">Reports Dashboard</h1>
          </div>
          <div className="relative w-full sm:w-auto max-w-xs sm:max-w-sm md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-card text-foreground border-border focus:ring-accent"
              aria-label="Search reports"
            />
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <div className="mb-8 p-4 bg-card rounded-lg shadow">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center text-lg font-semibold text-card-foreground">
              <Filter className="h-5 w-5 mr-2 text-primary" />
              <span>Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
                className={`transition-all duration-200 ease-in-out transform hover:scale-105 ${selectedCategory === null ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'hover:bg-secondary'}`}
              >
                All Categories
              </Button>
              {reportCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className={`transition-all duration-200 ease-in-out transform hover:scale-105 ${selectedCategory === category ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'hover:bg-secondary'}`}
                >
                  {category}
                </Button>
              ))}
            </div>
             {selectedCategory && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>
        
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map(report => (
              <ReportCard key={report.id} report={report} onSummaryUpdate={handleSummaryUpdate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground font-semibold">No reports found.</p>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}
