import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchResult, searchService, SearchOptions } from '@/services/searchService'
import { 
  Search, 
  Newspaper, 
  Rss, 
  Globe, 
  Calendar,
  ExternalLink,
  Loader2,
  Filter,
  Clock
} from 'lucide-react'

export function SearchInterface() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    type: 'all',
    recency: 'week',
    sortBy: 'publishedAt',
    limit: 20
  })

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const searchResults = await searchService.search(query, {
        ...searchOptions,
        type: activeTab as any
      })
      setResults(searchResults)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setSearchOptions(prev => ({ ...prev, type: value as any }))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news':
        return <Newspaper className="h-4 w-4" />
      case 'blog':
        return <Rss className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'news':
        return 'bg-red-100 text-red-800'
      case 'blog':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for news, blogs, and articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={loading || !query.trim()}
            className="bg-red-500 hover:bg-red-600"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search Options */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <Select
              value={searchOptions.recency}
              onValueChange={(value) => setSearchOptions(prev => ({ ...prev, recency: value as any }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Last hour</SelectItem>
                <SelectItem value="day">Last day</SelectItem>
                <SelectItem value="week">Last week</SelectItem>
                <SelectItem value="month">Last month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select
              value={searchOptions.sortBy}
              onValueChange={(value) => setSearchOptions(prev => ({ ...prev, sortBy: value as any }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="publishedAt">Latest</SelectItem>
                <SelectItem value="relevancy">Relevancy</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Search Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            News
          </TabsTrigger>
          <TabsTrigger value="blogs" className="flex items-center gap-2">
            <Rss className="h-4 w-4" />
            Blogs
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-red-500" />
                <p className="text-gray-500">Searching across multiple sources...</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Found {results.length} results for "{query}"
                </p>
              </div>
              
              <div className="grid gap-4">
                {results.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {result.imageUrl && (
                          <div className="flex-shrink-0">
                            <img
                              src={result.imageUrl}
                              alt={result.title}
                              className="w-24 h-24 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                              {result.title}
                            </h3>
                            <Badge className={`flex-shrink-0 ${getTypeColor(result.type)}`}>
                              {getTypeIcon(result.type)}
                              <span className="ml-1 capitalize">{result.type}</span>
                            </Badge>
                          </div>
                          
                          {result.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                              {result.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-4">
                              <span className="font-medium">{result.source}</span>
                              {result.author && (
                                <span>by {result.author}</span>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(result.publishedAt)}</span>
                              </div>
                            </div>
                            
                            {result.url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-auto p-1 text-blue-600 hover:text-blue-800"
                              >
                                <a
                                  href={result.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>Read more</span>
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : query && !loading ? (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No results found for "{query}"</p>
              <p className="text-sm text-gray-400">Try different keywords or adjust your search filters</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Search for news, blogs, and articles</p>
              <p className="text-sm text-gray-400">Enter keywords above to find relevant content from multiple sources</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}