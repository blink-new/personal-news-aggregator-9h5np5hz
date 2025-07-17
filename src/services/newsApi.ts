import { blink } from '@/blink/client'

export interface NewsApiArticle {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: NewsApiArticle[]
}

export interface NewsSearchParams {
  q?: string
  sources?: string
  domains?: string
  excludeDomains?: string
  from?: string
  to?: string
  language?: string
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt'
  pageSize?: number
  page?: number
}

export class NewsApiService {
  private baseUrl = 'https://newsapi.org/v2'

  async searchEverything(params: NewsSearchParams): Promise<NewsApiResponse> {
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })

    try {
      const response = await blink.data.fetch({
        url: `${this.baseUrl}/everything?${queryParams.toString()}`,
        method: 'GET',
        headers: {
          'X-API-Key': '{{NEWSAPI_API_KEY}}'
        }
      })

      if (response.status !== 200) {
        throw new Error(`NewsAPI error: ${response.status}`)
      }

      return response.body as NewsApiResponse
    } catch (error) {
      console.error('NewsAPI search error:', error)
      throw error
    }
  }

  async getTopHeadlines(params: {
    country?: string
    category?: string
    sources?: string
    q?: string
    pageSize?: number
    page?: number
  }): Promise<NewsApiResponse> {
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })

    try {
      const response = await blink.data.fetch({
        url: `${this.baseUrl}/top-headlines?${queryParams.toString()}`,
        method: 'GET',
        headers: {
          'X-API-Key': '{{NEWSAPI_API_KEY}}'
        }
      })

      if (response.status !== 200) {
        throw new Error(`NewsAPI error: ${response.status}`)
      }

      return response.body as NewsApiResponse
    } catch (error) {
      console.error('NewsAPI headlines error:', error)
      throw error
    }
  }

  async getSources(params?: {
    category?: string
    language?: string
    country?: string
  }): Promise<{
    status: string
    sources: Array<{
      id: string
      name: string
      description: string
      url: string
      category: string
      language: string
      country: string
    }>
  }> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
    }

    try {
      const response = await blink.data.fetch({
        url: `${this.baseUrl}/sources?${queryParams.toString()}`,
        method: 'GET',
        headers: {
          'X-API-Key': '{{NEWSAPI_API_KEY}}'
        }
      })

      if (response.status !== 200) {
        throw new Error(`NewsAPI error: ${response.status}`)
      }

      return response.body
    } catch (error) {
      console.error('NewsAPI sources error:', error)
      throw error
    }
  }
}

export const newsApiService = new NewsApiService()