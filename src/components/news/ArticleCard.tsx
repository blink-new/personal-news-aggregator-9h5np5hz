import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bookmark, ExternalLink, Clock, Star } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Article {
  id: string
  title: string
  url: string
  sourceName: string
  sourceRating: number
  summary: string
  publishedAt: string
  subject: string
  isBookmarked: boolean
  isRead: boolean
}

interface ArticleCardProps {
  article: Article
  onBookmark: (id: string) => void
  onMarkRead: (id: string) => void
  onOpenArticle: (url: string) => void
}

export function ArticleCard({ article, onBookmark, onMarkRead, onOpenArticle }: ArticleCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${article.isRead ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 
              className={`text-lg font-semibold leading-tight mb-2 cursor-pointer hover:text-primary transition-colors ${
                article.isRead ? 'text-muted-foreground' : 'text-foreground'
              }`}
              onClick={() => onOpenArticle(article.url)}
            >
              {article.title}
            </h3>
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <span>{article.sourceName}</span>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < article.sourceRating
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark(article.id)}
            className={article.isBookmarked ? 'text-accent' : 'text-muted-foreground'}
          >
            <Bookmark className={`h-4 w-4 ${article.isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <Badge variant="secondary" className="text-xs">
            {article.subject}
          </Badge>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {article.summary}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenArticle(article.url)}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Read Full Article</span>
            </Button>
            
            {!article.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkRead(article.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                Mark as Read
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}