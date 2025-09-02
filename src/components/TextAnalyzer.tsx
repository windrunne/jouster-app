'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search, FileText, TrendingUp, MessageSquare } from 'lucide-react';
import AnalysisResults from './AnalysisResults';
import SearchResults from './SearchResults';
import TopicMultiSelect from './TopicMultiSelect';

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

export default function TextAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analyze' | 'search'>('analyze');
  
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchSentiment, setSearchSentiment] = useState('');
  const [searchTopics, setSearchTopics] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<AnalysisResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
      setInputText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze text');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchKeyword) params.append('keyword', searchKeyword);
      if (searchSentiment) params.append('sentiment', searchSentiment);
      
      if (searchTopics.length > 0) {
        params.append('topics', searchTopics.join(','));
      }

      const response = await fetch(`/api/analyses?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search analyses');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchKeyword('');
    setSearchSentiment('');
    setSearchTopics([]);
    setSearchResults([]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('analyze')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'analyze'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4" />
          Analyze Text
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'search'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Search className="h-4 w-4" />
          Search Results
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Analyze Tab */}
      {activeTab === 'analyze' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Text Input
              </CardTitle>
              <CardDescription>
                Paste your text here to extract insights and structured data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-input">Enter your text</Label>
                <Textarea
                  id="text-input"
                  placeholder="Paste your article, blog post, or any text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !inputText.trim()}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analyze Text
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <AnalysisResults result={analysisResult} />
        </div>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter
              </CardTitle>
              <CardDescription>
                Find previous analyses by keyword, sentiment, or topic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="search-keyword">Keyword</Label>
                  <Input
                    id="search-keyword"
                    placeholder="Search by keyword..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search-sentiment">Sentiment</Label>
                  <select
                    id="search-sentiment"
                    value={searchSentiment}
                    onChange={(e) => setSearchSentiment(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Any sentiment</option>
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <TopicMultiSelect
                    selectedTopics={searchTopics}
                    onTopicsChange={setSearchTopics}
                    placeholder="Search and select topics..."
                    label="Topics"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={clearSearch}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          <SearchResults results={searchResults} />
        </div>
      )}
    </div>
  );
}
