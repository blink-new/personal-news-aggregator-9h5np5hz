import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Plus, 
  Star, 
  Globe, 
  Hash, 
  Edit2, 
  Trash2,
  ExternalLink,
  Upload
} from 'lucide-react'
import { AddSourceModal } from '@/components/modals/AddSourceModal'
import { AddTopicModal } from '@/components/modals/AddTopicModal'
import { BulkUploadSourcesModal } from '@/components/modals/BulkUploadSourcesModal'
import { BulkUploadTopicsModal } from '@/components/modals/BulkUploadTopicsModal'

interface Source {
  id: string
  name: string
  url: string
  rating: number
  category: string
}

interface Topic {
  id: string
  name: string
  description: string
  keywords: string[]
  importance: number
}

export function CosmosTools() {
  const [sources, setSources] = useState<Source[]>([
    {
      id: '1',
      name: 'BBC News',
      url: 'https://bbc.com/news',
      rating: 5,
      category: 'general'
    },
    {
      id: '2',
      name: 'TechCrunch',
      url: 'https://techcrunch.com',
      rating: 4,
      category: 'technology'
    }
  ])

  const [topics, setTopics] = useState<Topic[]>([
    {
      id: '1',
      name: 'Artificial Intelligence',
      description: 'AI developments, machine learning, and automation',
      keywords: ['AI', 'machine learning', 'automation', 'neural networks'],
      importance: 5
    },
    {
      id: '2',
      name: 'Climate Change',
      description: 'Environmental news and climate-related developments',
      keywords: ['climate', 'environment', 'sustainability', 'carbon'],
      importance: 4
    }
  ])

  const [showAddSource, setShowAddSource] = useState(false)
  const [showAddTopic, setShowAddTopic] = useState(false)
  const [showBulkUploadSources, setShowBulkUploadSources] = useState(false)
  const [showBulkUploadTopics, setShowBulkUploadTopics] = useState(false)

  const handleAddSource = (sourceData: Omit<Source, 'id'>) => {
    const newSource: Source = {
      ...sourceData,
      id: Date.now().toString()
    }
    setSources(prev => [...prev, newSource])
  }

  const handleAddTopic = (topicData: Omit<Topic, 'id'>) => {
    const newTopic: Topic = {
      ...topicData,
      id: Date.now().toString()
    }
    setTopics(prev => [...prev, newTopic])
  }

  const handleDeleteSource = (id: string) => {
    setSources(prev => prev.filter(source => source.id !== id))
  }

  const handleDeleteTopic = (id: string) => {
    setTopics(prev => prev.filter(topic => topic.id !== id))
  }

  const handleBulkAddSources = (sourcesData: Omit<Source, 'id'>[]) => {
    const newSources: Source[] = sourcesData.map(sourceData => ({
      ...sourceData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }))
    setSources(prev => [...prev, ...newSources])
  }

  const handleBulkAddTopics = (topicsData: Omit<Topic, 'id'>[]) => {
    const newTopics: Topic[] = topicsData.map(topicData => ({
      ...topicData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }))
    setTopics(prev => [...prev, ...newTopics])
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating
            ? 'fill-primary text-primary'
            : 'text-muted-foreground/30'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-6 p-4">
      {/* Sources Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Sources for COSMOS</CardTitle>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => setShowAddSource(true)}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Source
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowBulkUploadSources(true)}
                className="h-8"
              >
                <Upload className="h-4 w-4 mr-1" />
                Bulk Upload
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage news sources and media outlets with trustworthiness ratings
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-3">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{source.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {source.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(source.rating)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {source.rating}/5
                      </span>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center space-x-1"
                    >
                      <span className="truncate">{source.url}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteSource(source.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Separator />

      {/* Topics Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Hash className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Topics for COSMOS</CardTitle>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => setShowAddTopic(true)}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Topic
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowBulkUploadTopics(true)}
                className="h-8"
              >
                <Upload className="h-4 w-4 mr-1" />
                Bulk Upload
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Define important topics with importance ratings for search prioritization
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-3">
              {topics.map((topic) => (
                <div key={topic.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1">{topic.name}</h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(topic.importance)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {topic.importance}/5 importance
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTopic(topic.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {topic.description && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {topic.description}
                    </p>
                  )}
                  
                  {topic.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {topic.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="text-xs px-2 py-0">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddSourceModal
        isOpen={showAddSource}
        onClose={() => setShowAddSource(false)}
        onAdd={handleAddSource}
      />
      
      <AddTopicModal
        isOpen={showAddTopic}
        onClose={() => setShowAddTopic(false)}
        onAdd={handleAddTopic}
      />

      <BulkUploadSourcesModal
        isOpen={showBulkUploadSources}
        onClose={() => setShowBulkUploadSources(false)}
        onBulkAdd={handleBulkAddSources}
      />

      <BulkUploadTopicsModal
        isOpen={showBulkUploadTopics}
        onClose={() => setShowBulkUploadTopics(false)}
        onBulkAdd={handleBulkAddTopics}
      />
    </div>
  )
}