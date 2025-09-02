'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Calendar, Clock, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
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

interface SearchResultsProps {
  results: AnalysisResult[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedResults(newExpanded);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/analyses/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert('Analysis deleted successfully');
        window.location.reload();
      } else {
        alert('Failed to delete analysis');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete analysis');
    }
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Search Results
          </CardTitle>
          <CardDescription>
            No results found. Try adjusting your search criteria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No analyses match your search criteria</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Search Results
          </CardTitle>
          <CardDescription>
            Found {results.length} analysis{results.length !== 1 ? 'es' : ''} matching your criteria
          </CardDescription>
        </CardHeader>
      </Card>

      {results.map((result) => {
        const isExpanded = expandedResults.has(result.id);
        
        return (
          <Card key={result.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {result.title && (
                    <CardTitle className="text-lg mb-2">{result.title}</CardTitle>
                  )}
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(result.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(result.created_at).toLocaleTimeString()}
                    </div>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleExpanded(result.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(result.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Summary */}
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  {isExpanded ? result.summary : truncateText(result.summary, 150)}
                </p>
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Sentiment */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Sentiment:</span>
                  <Badge className={`${getSentimentColor(result.sentiment)} text-xs`}>
                    {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
                  </Badge>
                </div>

                {/* Topics */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Topics:</span>
                  <div className="flex gap-1">
                    {result.topics.slice(0, isExpanded ? 3 : 2).map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {topic}
                      </Badge>
                    ))}
                    {!isExpanded && result.topics.length > 2 && (
                      <span className="text-xs text-gray-500">+{result.topics.length - 2} more</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Keywords:</span>
                <div className="flex flex-wrap gap-1">
                  {result.keywords.slice(0, isExpanded ? 3 : 2).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {!isExpanded && result.keywords.length > 2 && (
                    <span className="text-xs text-gray-500">+{result.keywords.length - 2} more</span>
                  )}
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <MessageSquare className="h-3 w-3" />
                      Original Text
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg max-h-32 overflow-y-auto">
                      {result.original_text}
                    </p>
                  </div>
                  
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    ID: {result.id}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
