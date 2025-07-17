import { newsApiService, NewsApiArticle } from './newsApi'
import { perplexityApiService, PerplexityResponse } from './perplexityApi'

export interface SearchResult {
  id: string
  title: string
  description: string
  url: string
  imageUrl?: string
  publishedAt: string
  source: string
  type: 'news' | 'blog' | 'general'
  content?: string
  author?: string
}

export interface SearchOptions {
  type?: 'news' | 'blogs' | 'general' | 'all'
  recency?: 'hour' | 'day' | 'week' | 'month'
  sources?: string[]
  domains?: string[]
  language?: string
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt'
  limit?: number
}

export class SearchService {
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const {
      type = 'all',
      recency = 'week',
      sources,
      domains,
      language = 'en',
      sortBy = 'publishedAt',
      limit = 20
    } = options

    const results: SearchResult[] = []

    try {
      // Search with NewsAPI for news content
      if (type === 'news' || type === 'all') {
        const newsResults = await this.searchNews(query, {
          recency,
          sources,
          domains,
          language,
          sortBy,
          limit: Math.ceil(limit / (type === 'all' ? 3 : 1))
        })
        results.push(...newsResults)
      }

      // Search with Perplexity for blogs and general content
      if (type === 'blogs' || type === 'general' || type === 'all') {
        const perplexityResults = await this.searchWithPerplexity(query, {
          type: type === 'all' ? 'general' : type,
          recency,
          domains,
          limit: Math.ceil(limit / (type === 'all' ? 3 : 1))
        })
        results.push(...perplexityResults)
      }

      // Sort and limit results
      const sortedResults = this.sortResults(results, sortBy)
      return sortedResults.slice(0, limit)

    } catch (error) {
      console.error('Search service error:', error)
      throw error
    }
  }

  private async searchNews(
    query: string,
    options: {
      recency?: string
      sources?: string[]
      domains?: string[]
      language?: string
      sortBy?: string
      limit?: number
    }
  ): Promise<SearchResult[]> {
    try {
      const fromDate = this.getDateFromRecency(options.recency || 'week')
      
      const response = await newsApiService.searchEverything({
        q: query,
        sources: options.sources?.join(','),
        domains: options.domains?.join(','),
        language: options.language,
        sortBy: options.sortBy as any,
        from: fromDate,
        pageSize: Math.min(options.limit || 20, 100)
      })

      return response.articles.map((article: NewsApiArticle) => ({
        id: `news-${Date.now()}-${Math.random()}`,
        title: article.title,
        description: article.description || '',
        url: article.url,
        imageUrl: article.urlToImage || undefined,
        publishedAt: article.publishedAt,
        source: article.source.name,
        type: 'news' as const,
        content: article.content || undefined,
        author: article.author || undefined
      }))
    } catch (error) {
      console.error('News search error:', error)
      return []
    }
  }

  private async searchWithPerplexity(
    query: string,
    options: {
      type: 'blogs' | 'general'
      recency?: string
      domains?: string[]
      limit?: number
    }
  ): Promise<SearchResult[]> {
    try {
      let response: PerplexityResponse

      if (options.type === 'blogs') {
        response = await perplexityApiService.searchBlogs(query, {
          recency: options.recency as any,
          domains: options.domains,
          maxTokens: 1200
        })
      } else {
        response = await perplexityApiService.searchGeneral(query, {
          recency: options.recency as any,
          domains: options.domains,
          maxTokens: 1500
        })
      }

      // Parse Perplexity response to extract structured results
      const content = response.choices[0]?.message?.content || ''
      return this.parsePerplexityContent(content, options.type, query)

    } catch (error) {
      console.error('Perplexity search error:', error)
      return []
    }
  }

  private parsePerplexityContent(content: string, type: 'blogs' | 'general', query: string): SearchResult[] {
    const results: SearchResult[] = []
    
    // Extract citations and create structured results
    const lines = content.split('\n')
    let currentResult: Partial<SearchResult> | null = null
    
    for (const line of lines) {
      // Look for URLs in citations format [1], [2], etc.
      const citationMatch = line.match(/\[(\d+)\]/)
      const urlMatch = line.match(/https?:\/\/[^\s)]+/)
      
      if (urlMatch) {
        if (currentResult) {
          results.push({
            id: `${type}-${Date.now()}-${Math.random()}`,
            title: currentResult.title || `${type} result for "${query}"`,
            description: currentResult.description || '',
            url: currentResult.url || urlMatch[0],
            publishedAt: new Date().toISOString(),
            source: this.extractDomain(currentResult.url || urlMatch[0]),
            type: type,
            content: currentResult.content
          })
        }
        
        currentResult = {
          url: urlMatch[0],
          content: line.trim()
        }
      } else if (currentResult && line.trim()) {
        // Add content to current result
        if (!currentResult.title && line.length > 10 && line.length < 200) {
          currentResult.title = line.trim()
        } else if (!currentResult.description && line.length > 20) {
          currentResult.description = line.trim()
        }
      }
    }
    
    // Add the last result if exists
    if (currentResult) {
      results.push({
        id: `${type}-${Date.now()}-${Math.random()}`,
        title: currentResult.title || `${type} result for "${query}"`,
        description: currentResult.description || '',
        url: currentResult.url || '',
        publishedAt: new Date().toISOString(),
        source: this.extractDomain(currentResult.url || ''),
        type: type,
        content: currentResult.content
      })
    }

    // If no structured results found, create a single result with the full content
    if (results.length === 0 && content.trim()) {
      results.push({
        id: `${type}-${Date.now()}-${Math.random()}`,
        title: `${type} search results for "${query}"`,
        description: content.substring(0, 200) + '...',
        url: '',
        publishedAt: new Date().toISOString(),
        source: 'Perplexity AI',
        type: type,
        content: content
      })
    }
    
    return results
  }

  private extractDomain(url: string): string {
    try {
      const domain = new URL(url).hostname
      return domain.replace('www.', '')
    } catch {
      return 'Unknown'
    }
  }

  private getDateFromRecency(recency: string): string {
    const now = new Date()
    const date = new Date(now)
    
    switch (recency) {
      case 'hour':
        date.setHours(date.getHours() - 1)
        break
      case 'day':
        date.setDate(date.getDate() - 1)
        break
      case 'week':
        date.setDate(date.getDate() - 7)
        break
      case 'month':
        date.setMonth(date.getMonth() - 1)
        break
      default:
        date.setDate(date.getDate() - 7)
    }
    
    return date.toISOString().split('T')[0]
  }

  private sortResults(results: SearchResult[], sortBy: string): SearchResult[] {
    switch (sortBy) {
      case 'publishedAt':
        return results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      case 'relevancy':
        // For now, maintain original order as relevancy
        return results
      case 'popularity':
        // Could implement popularity scoring later
        return results
      default:
        return results
    }
  }

  async getTopHeadlines(options: {
    country?: string
    category?: string
    sources?: string[]
    limit?: number
  } = {}): Promise<SearchResult[]> {
    try {
      const response = await newsApiService.getTopHeadlines({
        country: options.country,
        category: options.category,
        sources: options.sources?.join(','),
        pageSize: Math.min(options.limit || 20, 100)
      })

      return response.articles.map((article: NewsApiArticle) => ({
        id: `headline-${Date.now()}-${Math.random()}`,
        title: article.title,
        description: article.description || '',
        url: article.url,
        imageUrl: article.urlToImage || undefined,
        publishedAt: article.publishedAt,
        source: article.source.name,
        type: 'news' as const,
        content: article.content || undefined,
        author: article.author || undefined
      }))
    } catch (error) {
      console.error('Headlines error:', error)
      return []
    }
  }
}

export const searchService = new SearchService()