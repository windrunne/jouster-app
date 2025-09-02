'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface TopicMultiSelectProps {
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
  placeholder?: string;
  label?: string;
}

export default function TopicMultiSelect({
  selectedTopics,
  onTopicsChange,
  placeholder = "Search topics...",
  label = "Topics"
}: TopicMultiSelectProps) {
  const [allTopics, setAllTopics] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState<string[]>([]);

  // Fetch all topics from API
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/topics');
        if (response.ok) {
          const data = await response.json();
          setAllTopics(data.topics || []);
        }
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      }
    };

    fetchTopics();
  }, []);

  // Filter topics based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTopics(allTopics.filter(topic => !selectedTopics.includes(topic)));
    } else {
      const filtered = allTopics.filter(topic => 
        topic.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedTopics.includes(topic)
      );
      setFilteredTopics(filtered);
    }
  }, [searchTerm, allTopics, selectedTopics]);

  const handleTopicSelect = (topic: string) => {
    if (!selectedTopics.includes(topic)) {
      onTopicsChange([...selectedTopics, topic]);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  const handleTopicRemove = (topicToRemove: string) => {
    onTopicsChange(selectedTopics.filter(topic => topic !== topicToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault();
      // If there's an exact match in filtered topics, select it
      const exactMatch = filteredTopics.find(topic => 
        topic.toLowerCase() === searchTerm.toLowerCase()
      );
      if (exactMatch) {
        handleTopicSelect(exactMatch);
      } else if (filteredTopics.length > 0) {
        // Select the first filtered topic
        handleTopicSelect(filteredTopics[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const clearAll = () => {
    onTopicsChange([]);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="relative">
        <Input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="pr-8"
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      
      {/* Dropdown List */}
      {isOpen && (
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredTopics.length > 0 ? (
              <div className="py-1">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicSelect(topic)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? `No topics found matching "${searchTerm}"` : 'No topics available'}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Selected Topics Display */}
      {selectedTopics.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
          {selectedTopics.map((topic) => (
            <Badge
              key={topic}
              variant="secondary"
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 pr-1"
            >
              {topic}
              <button
                onClick={() => handleTopicRemove(topic)}
                className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Search Input */}


      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
