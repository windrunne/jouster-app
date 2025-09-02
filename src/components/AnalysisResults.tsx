'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, MessageSquare, Hash, TrendingUp, Calendar, Clock } from 'lucide-react';
import { getSentimentColor } from '@/lib/utils';

interface AnalysisResult {
  id: string;
  created_at: string;
  updated_at: string;
  original_text: string;
  title?: string;
  summary: string;
  topics: string[];
  sentiment: string;
  keywords: string[];
}

interface AnalysisResultsProps {
  result: AnalysisResult | null;
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  if (!result) {
    return (
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analysis Results
          </CardTitle>
          <CardDescription>
            Results will appear here after analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Enter some text and click "Analyze Text" to see results</p>
          </div>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Analysis Results
        </CardTitle>
        <CardDescription>
          AI-extracted insights and structured data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        {result.title && (
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Title
            </h3>
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              {result.title}
            </p>
          </div>
        )}

        {/* Summary */}
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Summary
          </h3>
          <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            {result.summary}
          </p>
        </div>

        {/* Sentiment */}
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Sentiment
          </h3>
          <Badge className={`${getSentimentColor(result.sentiment)} text-sm`}>
            {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
          </Badge>
        </div>

        {/* Topics */}
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Key Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.topics.map((topic, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(result.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(result.created_at).toLocaleTimeString()}
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            ID: {result.id}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
