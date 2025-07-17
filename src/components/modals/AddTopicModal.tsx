import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Star, X } from 'lucide-react'

interface AddTopicModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (topic: {
    name: string
    description: string
    keywords: string[]
    importance: number
  }) => void
}

export function AddTopicModal({ isOpen, onClose, onAdd }: AddTopicModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    keywords: [] as string[],
    importance: 3
  })
  const [keywordInput, setKeywordInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name) {
      onAdd(formData)
      setFormData({ name: '', description: '', keywords: [], importance: 3 })
      setKeywordInput('')
      onClose()
    }
  }

  const handleImportanceClick = (rating: number) => {
    setFormData(prev => ({ ...prev, importance: rating }))
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }))
      setKeywordInput('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Topic for COSMOS</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Topic Name</Label>
            <Input
              id="name"
              placeholder="e.g., Artificial Intelligence, Climate Change"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what this topic covers..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Importance Rating</Label>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleImportanceClick(i + 1)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <Star
                    className={`h-5 w-5 ${
                      i < formData.importance
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {formData.importance}/5 importance
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Higher importance topics will be prioritized in search results
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (Optional)</Label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  id="keywords"
                  placeholder="Add keyword and press Enter"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={handleKeywordKeyPress}
                />
                <Button type="button" onClick={addKeyword} disabled={!keywordInput.trim()}>
                  Add
                </Button>
              </div>
              
              {formData.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="flex items-center space-x-1">
                      <span>{keyword}</span>
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Keywords help find more relevant articles for this topic
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Topic
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}