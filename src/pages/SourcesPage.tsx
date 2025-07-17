import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Star, 
  Globe, 
  Trash2, 
  Edit3,
  Filter,
  MoreVertical,
  ExternalLink
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AddSourceModal } from '@/components/modals/AddSourceModal'
import { blink } from '@/blink/client'

interface Source {
  id: string
  name: string
  url: string
  rating: number
  category: string
  description?: string
  lastUpdated: string
  status: 'active' | 'inactive'
  articlesCount: number
}

// Mock data for demonstration
const mockSources: Source[] = [
  {
    id: '1',
    name: 'TechCrunch',
    url: 'https://techcrunch.com',
    rating: 5,
    category: 'Technology',
    description: 'Leading technology news and startup coverage',
    lastUpdated: '2024-01-15',
    status: 'active',
    articlesCount: 1250
  },
  {
    id: '2',
    name: 'BBC News',
    url: 'https://bbc.com/news',
    rating: 5,
    category: 'General News',
    description: 'International news and current affairs',
    lastUpdated: '2024-01-15',
    status: 'active',
    articlesCount: 2100
  },
  {
    id: '3',
    name: 'The Verge',
    url: 'https://theverge.com',
    rating: 4,
    category: 'Technology',
    description: 'Technology, science, art, and culture',
    lastUpdated: '2024-01-14',
    status: 'active',
    articlesCount: 890
  },
  {
    id: '4',
    name: 'Reuters',
    url: 'https://reuters.com',
    rating: 5,
    category: 'Business',
    description: 'Global business and financial news',
    lastUpdated: '2024-01-15',
    status: 'active',
    articlesCount: 1560
  },
  {
    id: '5',
    name: 'Hacker News',
    url: 'https://news.ycombinator.com',
    rating: 4,
    category: 'Technology',
    description: 'Social news website focusing on computer science',
    lastUpdated: '2024-01-13',
    status: 'inactive',
    articlesCount: 450
  }
]

export function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    // Simulate loading sources
    setTimeout(() => {
      setSources(mockSources)
      setLoading(false)
    }, 1000)
  }, [])

  const categories = ['all', ...Array.from(new Set(sources.map(s => s.category)))]
  const ratings = ['all', '5', '4', '3', '2', '1']

  const filteredSources = sources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         source.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || source.category === selectedCategory
    const matchesRating = selectedRating === 'all' || source.rating.toString() === selectedRating
    
    return matchesSearch && matchesCategory && matchesRating
  })

  const handleDeleteSource = (id: string) => {
    setSources(sources.filter(s => s.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setSources(sources.map(s => 
      s.id === id 
        ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
        : s
    ))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Sources</h1>
          <p className="text-gray-600 mt-1">
            Manage your trusted news sources and their ratings
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Source
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sources</p>
                <p className="text-2xl font-bold">{sources.length}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sources</p>
                <p className="text-2xl font-bold">
                  {sources.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {(sources.reduce((sum, s) => sum + s.rating, 0) / sources.length).toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500 fill-current" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold">
                  {sources.reduce((sum, s) => sum + s.articlesCount, 0).toLocaleString()}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">A</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                {ratings.map(rating => (
                  <SelectItem key={rating} value={rating}>
                    {rating === 'all' ? 'All Ratings' : `${rating} Stars`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSources.map(source => (
          <Card key={source.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                    {source.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {renderStars(source.rating)}
                    </div>
                    <Badge 
                      variant={source.status === 'active' ? 'default' : 'secondary'}
                      className={source.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {source.status}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {source.category}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Source
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(source.id)}>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${
                          source.status === 'active' ? 'bg-red-500' : 'bg-green-500'
                        }`}></div>
                        {source.status === 'active' ? 'Deactivate' : 'Activate'}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteSource(source.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {source.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Articles:</span>
                  <span className="font-medium">{source.articlesCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="font-medium">{source.lastUpdated}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    Visit Source
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSources.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sources found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedCategory !== 'all' || selectedRating !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Get started by adding your first news source.'
              }
            </p>
            {!searchQuery && selectedCategory === 'all' && selectedRating === 'all' && (
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Source
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Source Modal */}
      <AddSourceModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onSourceAdded={(newSource) => {
          setSources([...sources, { ...newSource, id: Date.now().toString() }])
          setShowAddModal(false)
        }}
      />
    </div>
  )
}