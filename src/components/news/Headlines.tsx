import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SearchResult, searchService } from '@/services/searchService'
import { 
  Newspaper, 
  RefreshCw, 
  ExternalLink, 
  Calendar,
  TrendingUp,
  Globe
} from 'lucide-react'

export function Headlines() {
  const [headlines, setHeadlines] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [country, setCountry] = useState('us')
  const [category, setCategory] = useState('')

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'business', label: 'Business' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'general', label: 'General' },
    { value: 'health', label: 'Health' },
    { value: 'science', label: 'Science' },
    { value: 'sports', label: 'Sports' },
    { value: 'technology', label: 'Technology' }
  ]

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'gb', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'in', label: 'India' }
  ]

  const fetchHeadlines = useCallback(async () => {
    setLoading(true)
    try {
      const results = await searchService.getTopHeadlines({
        country: country || undefined,
        category: category || undefined,
        limit: 20
      })
      setHeadlines(results)
    } catch (error) {
      console.error('Failed to fetch headlines:', error)
    } finally {
      setLoading(false)
    }
  }, [country, category])

  useEffect(() => {
    fetchHeadlines()
  }, [fetchHeadlines])

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Top Headlines</h2>
            <p className="text-sm text-gray-500">Latest breaking news from around the world</p>
          </div>
        </div>
        
        <Button
          onClick={fetchHeadlines}
          disabled={loading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-gray-500" />
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-gray-500" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Headlines Grid */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="flex gap-2">
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : headlines.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {headlines.length} top headlines
          </p>
          
          <div className="grid gap-4">
            {headlines.map((headline, index) => (
              <Card key={headline.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {headline.imageUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={headline.imageUrl}
                          alt={headline.title}
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
                          {headline.title}
                        </h3>
                        {index < 3 && (
                          <Badge className="flex-shrink-0 bg-red-100 text-red-800">
                            #{index + 1}
                          </Badge>
                        )}
                      </div>
                      
                      {headline.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {headline.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{headline.source}</span>
                          {headline.author && (
                            <span>by {headline.author}</span>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(headline.publishedAt)}</span>
                          </div>
                        </div>
                        
                        {headline.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-auto p-1 text-blue-600 hover:text-blue-800"
                          >
                            <a
                              href={headline.url}
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
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Newspaper className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No headlines available</p>
            <p className="text-sm text-gray-400">Try refreshing or changing your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}