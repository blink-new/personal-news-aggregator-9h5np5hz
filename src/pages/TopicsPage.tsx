import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Hash, 
  Trash2, 
  Edit3,
  MoreVertical,
  TrendingUp,
  Clock,
  Eye
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
import { AddTopicModal } from '@/components/modals/AddTopicModal'
import { blink } from '@/blink/client'

interface Topic {
  id: string
  name: string
  description?: string
  keywords: string[]
  priority: 'low' | 'medium' | 'high'
  category: string
  isActive: boolean
  articlesFound: number
  lastUpdated: string
  createdAt: string
  color: string
}

// Mock data for demonstration
const mockTopics: Topic[] = [
  {
    id: '1',
    name: 'Artificial Intelligence',
    description: 'Latest developments in AI, machine learning, and neural networks',
    keywords: ['AI', 'machine learning', 'neural networks', 'deep learning', 'GPT'],
    priority: 'high',
    category: 'Technology',
    isActive: true,
    articlesFound: 156,
    lastUpdated: '2024-01-15',
    createdAt: '2024-01-01',
    color: '#3B82F6'
  },
  {
    id: '2',
    name: 'Climate Change',
    description: 'Environmental news, climate policies, and sustainability efforts',
    keywords: ['climate change', 'global warming', 'sustainability', 'renewable energy'],
    priority: 'high',
    category: 'Environment',
    isActive: true,
    articlesFound: 89,
    lastUpdated: '2024-01-15',
    createdAt: '2024-01-02',
    color: '#10B981'
  },
  {
    id: '3',
    name: 'Cryptocurrency',
    description: 'Bitcoin, blockchain technology, and digital currency markets',
    keywords: ['bitcoin', 'cryptocurrency', 'blockchain', 'ethereum', 'crypto'],
    priority: 'medium',
    category: 'Finance',
    isActive: true,
    articlesFound: 234,
    lastUpdated: '2024-01-14',
    createdAt: '2024-01-03',
    color: '#F59E0B'
  },
  {
    id: '4',
    name: 'Space Exploration',
    description: 'NASA missions, SpaceX launches, and space technology',
    keywords: ['NASA', 'SpaceX', 'space exploration', 'Mars', 'rocket'],
    priority: 'medium',
    category: 'Science',
    isActive: true,
    articlesFound: 67,
    lastUpdated: '2024-01-13',
    createdAt: '2024-01-04',
    color: '#8B5CF6'
  },
  {
    id: '5',
    name: 'Quantum Computing',
    description: 'Quantum computers, quantum algorithms, and quantum supremacy',
    keywords: ['quantum computing', 'quantum computer', 'quantum supremacy', 'qubit'],
    priority: 'low',
    category: 'Technology',
    isActive: false,
    articlesFound: 23,
    lastUpdated: '2024-01-10',
    createdAt: '2024-01-05',
    color: '#EF4444'
  }
]

export function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    // Simulate loading topics
    setTimeout(() => {
      setTopics(mockTopics)
      setLoading(false)
    }, 1000)
  }, [])

  const categories = ['all', ...Array.from(new Set(topics.map(t => t.category)))]
  const priorities = ['all', 'high', 'medium', 'low']
  const statuses = ['all', 'active', 'inactive']

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory
    const matchesPriority = selectedPriority === 'all' || topic.priority === selectedPriority
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && topic.isActive) ||
                         (selectedStatus === 'inactive' && !topic.isActive)
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus
  })

  const handleDeleteTopic = (id: string) => {
    setTopics(topics.filter(t => t.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setTopics(topics.map(t => 
      t.id === id 
        ? { ...t, isActive: !t.isActive }
        : t
    ))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Topics & Subjects</h1>
          <p className="text-gray-600 mt-1">
            Manage your tracked topics and their monitoring keywords
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Topic
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Topics</p>
                <p className="text-2xl font-bold">{topics.length}</p>
              </div>
              <Hash className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Topics</p>
                <p className="text-2xl font-bold">
                  {topics.filter(t => t.isActive).length}
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
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">
                  {topics.filter(t => t.priority === 'high').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Articles Found</p>
                <p className="text-2xl font-bold">
                  {topics.reduce((sum, t) => sum + t.articlesFound, 0).toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
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
                  placeholder="Search topics, keywords..."
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
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map(topic => (
          <Card key={topic.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: topic.color }}
                    ></div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {topic.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      className={getPriorityColor(topic.priority)}
                    >
                      {topic.priority}
                    </Badge>
                    <Badge 
                      variant={topic.isActive ? 'default' : 'secondary'}
                      className={topic.isActive ? 'bg-green-100 text-green-800' : ''}
                    >
                      {topic.isActive ? 'active' : 'inactive'}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {topic.category}
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
                      Edit Topic
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(topic.id)}>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${
                          topic.isActive ? 'bg-red-500' : 'bg-green-500'
                        }`}></div>
                        {topic.isActive ? 'Deactivate' : 'Activate'}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteTopic(topic.id)}
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
                {topic.description}
              </p>
              
              {/* Keywords */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {topic.keywords.slice(0, 3).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {topic.keywords.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{topic.keywords.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Articles Found:</span>
                  <span className="font-medium">{topic.articlesFound}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {topic.lastUpdated}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium">{topic.createdAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Hash className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No topics found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Get started by adding your first topic to track.'
              }
            </p>
            {!searchQuery && selectedCategory === 'all' && selectedPriority === 'all' && selectedStatus === 'all' && (
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Topic
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Topic Modal */}
      <AddTopicModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onTopicAdded={(newTopic) => {
          setTopics([...topics, { 
            ...newTopic, 
            id: Date.now().toString(),
            articlesFound: 0,
            lastUpdated: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString().split('T')[0]
          }])
          setShowAddModal(false)
        }}
      />
    </div>
  )
}