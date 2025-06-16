
"use client";

import type { Report, ReportPlatform } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Presentation, ExternalLink, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { summarizeReport } from '@/ai/flows/summarize-report';
import { useToast } from "@/hooks/use-toast";

interface ReportCardProps {
  report: Report;
  onSummaryUpdate: (reportId: string, summary: string) => void;
}

const PlatformIcon = ({ platform }: { platform: ReportPlatform }) => {
  if (platform === 'LookerStudio') {
    return <Presentation className="h-5 w-5 text-primary" aria-label="Looker Studio" />;
  }
  if (platform === 'Tableau') {
    return <BarChart3 className="h-5 w-5 text-primary" aria-label="Tableau" />;
  }
  return null;
};

export function ReportCard({ report, onSummaryUpdate }: ReportCardProps) {
  const [isSummaryLoading, startSummaryTransition] = useTransition();
  const [currentSummary, setCurrentSummary] = useState(report.aiSummary || report.description);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateSummary = () => {
    setSummaryError(null);
    startSummaryTransition(async () => {
      try {
        const result = await summarizeReport({ reportLink: report.url });
        if (result.summary) {
          setCurrentSummary(result.summary);
          onSummaryUpdate(report.id, result.summary);
        } else {
          setSummaryError("AI could not generate a summary for this report.");
          toast({
            title: "Summarization Error",
            description: "AI could not generate a summary for this report.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error generating summary:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        setSummaryError(`Failed to generate summary: ${errorMessage}`);
        toast({
          title: "Summarization Failed",
          description: `Could not generate summary: ${errorMessage}`,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="pb-2">
        <div className="relative w-full h-40 rounded-t-md overflow-hidden mb-2">
          <Image 
            src={report.imageUrl} 
            alt={`Placeholder for ${report.title}`} 
            layout="fill" 
            objectFit="cover" 
            data-ai-hint="data dashboard"
          />
        </div>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-headline">{report.title}</CardTitle>
          <PlatformIcon platform={report.platform} />
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground pt-1">
          <span>{report.platform === 'LookerStudio' ? 'Looker Studio' : 'Tableau'}</span>
          <Badge variant="secondary" className="capitalize">{report.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <CardDescription className="text-sm min-h-[40px]">
          {currentSummary}
        </CardDescription>
        {summaryError && (
          <p className="text-xs text-destructive mt-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" /> {summaryError}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2">
        <Button
          onClick={handleGenerateSummary}
          disabled={isSummaryLoading}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto transition-colors duration-300 group"
        >
          {isSummaryLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2 group-hover:text-accent transition-colors duration-300" />
              AI Summary
            </>
          )}
        </Button>
        <Button asChild size="sm" className="w-full sm:w-auto bg-primary hover:bg-primary/90 transition-colors duration-300 group">
          <Link href={report.url} target="_blank" rel="noopener noreferrer">
            Open Report
            <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
