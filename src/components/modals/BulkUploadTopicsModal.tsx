import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, FileText, AlertCircle, CheckCircle2, Star } from 'lucide-react'

interface Topic {
  name: string
  description: string
  keywords: string[]
  importance: number
}

interface BulkUploadTopicsModalProps {
  isOpen: boolean
  onClose: () => void
  onBulkAdd: (topics: Topic[]) => void
}

export function BulkUploadTopicsModal({ isOpen, onClose, onBulkAdd }: BulkUploadTopicsModalProps) {
  const [inputText, setInputText] = useState('')
  const [parsedTopics, setParsedTopics] = useState<Topic[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const exampleFormat = `Artificial Intelligence, AI developments and machine learning, 5, AI|machine learning|automation|neural networks
Climate Change, Environmental news and sustainability, 4, climate|environment|sustainability|carbon|renewable energy
Cryptocurrency, Digital currency and blockchain news, 3, crypto|bitcoin|blockchain|ethereum|defi
Space Technology, Space exploration and aerospace, 4, space|NASA|SpaceX|satellite|mars
Cybersecurity, Information security and data protection, 5, security|hacking|privacy|data breach|encryption`

  const parseTopicsText = () => {
    const lines = inputText.trim().split('\n').filter(line => line.trim())
    const topics: Topic[] = []
    const parseErrors: string[] = []

    lines.forEach((line, index) => {
      const parts = line.split(',').map(part => part.trim())
      
      if (parts.length < 1) {
        parseErrors.push(`Line ${index + 1}: Topic name is required`)
        return
      }

      const [name, description = '', importanceStr = '3', keywordsStr = ''] = parts
      
      if (!name) {
        parseErrors.push(`Line ${index + 1}: Topic name is required`)
        return
      }

      const importance = parseInt(importanceStr)
      if (isNaN(importance) || importance < 1 || importance > 5) {
        parseErrors.push(`Line ${index + 1}: Importance must be between 1-5`)
        return
      }

      const keywords = keywordsStr 
        ? keywordsStr.split('|').map(k => k.trim()).filter(k => k)
        : []

      topics.push({
        name,
        description,
        keywords,
        importance
      })
    })

    setErrors(parseErrors)
    setParsedTopics(topics)
    setShowPreview(true)
  }

  const handleSubmit = () => {
    if (parsedTopics.length > 0) {
      onBulkAdd(parsedTopics)
      handleClose()
    }
  }

  const handleClose = () => {
    setInputText('')
    setParsedTopics([])
    setErrors([])
    setShowPreview(false)
    onClose()
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Bulk Upload Topics</span>
          </DialogTitle>
        </DialogHeader>
        
        {!showPreview ? (
          <div className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Format:</strong> Each line should contain: Name, Description, Importance (1-5), Keywords (separated by |)
                <br />
                <strong>Note:</strong> Only Name is required. Other fields are optional.
                <br />
                <strong>Example:</strong>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                  {exampleFormat}
                </pre>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="topics-text">Paste your topics (one per line)</Label>
              <Textarea
                id="topics-text"
                placeholder={`Paste your topics here...\n\n${exampleFormat}`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={parseTopicsText}
                disabled={!inputText.trim()}
              >
                Parse & Preview
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Results Summary */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">
                  {parsedTopics.length} topics parsed successfully
                </span>
              </div>
              {errors.length > 0 && (
                <Badge variant="destructive">
                  {errors.length} errors
                </Badge>
              )}
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {errors.map((error, index) => (
                      <div key={index} className="text-sm">{error}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Preview */}
            {parsedTopics.length > 0 && (
              <div className="space-y-2">
                <Label>Preview ({parsedTopics.length} topics)</Label>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {parsedTopics.map((topic, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPreview(false)}
              >
                Back to Edit
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={parsedTopics.length === 0}
              >
                Add {parsedTopics.length} Topics
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}