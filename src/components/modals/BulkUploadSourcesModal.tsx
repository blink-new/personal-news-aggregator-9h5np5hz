import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, FileText, AlertCircle, CheckCircle2, Star } from 'lucide-react'

interface Source {
  name: string
  url: string
  rating: number
  category: string
}

interface BulkUploadSourcesModalProps {
  isOpen: boolean
  onClose: () => void
  onBulkAdd: (sources: Source[]) => void
}

export function BulkUploadSourcesModal({ isOpen, onClose, onBulkAdd }: BulkUploadSourcesModalProps) {
  const [inputText, setInputText] = useState('')
  const [parsedSources, setParsedSources] = useState<Source[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const exampleFormat = `BBC News, https://bbc.com/news, 5, general
TechCrunch, https://techcrunch.com, 4, technology
Reuters, https://reuters.com, 5, general
The Verge, https://theverge.com, 4, technology
CNN, https://cnn.com, 3, general`

  const parseSourcesText = () => {
    const lines = inputText.trim().split('\n').filter(line => line.trim())
    const sources: Source[] = []
    const parseErrors: string[] = []

    lines.forEach((line, index) => {
      const parts = line.split(',').map(part => part.trim())
      
      if (parts.length < 2) {
        parseErrors.push(`Line ${index + 1}: Missing required fields (name, url)`)
        return
      }

      const [name, url, ratingStr = '3', category = 'general'] = parts
      
      if (!name) {
        parseErrors.push(`Line ${index + 1}: Source name is required`)
        return
      }
      
      if (!url || !url.startsWith('http')) {
        parseErrors.push(`Line ${index + 1}: Valid URL is required`)
        return
      }

      const rating = parseInt(ratingStr)
      if (isNaN(rating) || rating < 1 || rating > 5) {
        parseErrors.push(`Line ${index + 1}: Rating must be between 1-5`)
        return
      }

      sources.push({
        name,
        url,
        rating,
        category: category.toLowerCase()
      })
    })

    setErrors(parseErrors)
    setParsedSources(sources)
    setShowPreview(true)
  }

  const handleSubmit = () => {
    if (parsedSources.length > 0) {
      onBulkAdd(parsedSources)
      handleClose()
    }
  }

  const handleClose = () => {
    setInputText('')
    setParsedSources([])
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
            <span>Bulk Upload Sources</span>
          </DialogTitle>
        </DialogHeader>
        
        {!showPreview ? (
          <div className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Format:</strong> Each line should contain: Name, URL, Rating (1-5), Category
                <br />
                <strong>Example:</strong>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                  {exampleFormat}
                </pre>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="sources-text">Paste your sources (one per line)</Label>
              <Textarea
                id="sources-text"
                placeholder={`Paste your sources here...\n\n${exampleFormat}`}
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
                onClick={parseSourcesText}
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
                  {parsedSources.length} sources parsed successfully
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
            {parsedSources.length > 0 && (
              <div className="space-y-2">
                <Label>Preview ({parsedSources.length} sources)</Label>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {parsedSources.map((source, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-sm truncate">{source.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {source.category}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="flex items-center space-x-1">
                                {renderStars(source.rating)}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {source.rating}/5
                              </span>
                            </div>
                            <p className="text-xs text-primary truncate">{source.url}</p>
                          </div>
                        </div>
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
                disabled={parsedSources.length === 0}
              >
                Add {parsedSources.length} Sources
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}