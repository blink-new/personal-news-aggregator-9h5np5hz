import { blink } from '@/blink/client'

export interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface PerplexityResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    finish_reason: string
    message: {
      role: string
      content: string
    }
    delta?: {
      role?: string
      content?: string
    }
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface PerplexitySearchParams {
  query: string
  model?: 'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online' | 'llama-3.1-sonar-huge-128k-online'
  max_tokens?: number
  temperature?: number
  top_p?: number
  search_domain_filter?: string[]
  return_citations?: boolean
  search_recency_filter?: 'month' | 'week' | 'day' | 'hour'
  top_k?: number
  stream?: boolean
  presence_penalty?: number
  frequency_penalty?: number
}

export class PerplexityApiService {
  private baseUrl = 'https://api.perplexity.ai'

  async search(params: PerplexitySearchParams): Promise<PerplexityResponse> {
    const {
      query,
      model = 'llama-3.1-sonar-small-128k-online',
      max_tokens = 1000,
      temperature = 0.2,
      top_p = 0.9,
      search_domain_filter,
      return_citations = true,
      search_recency_filter,
      top_k = 0,
      stream = false,
      presence_penalty = 0,
      frequency_penalty = 1
    } = params

    const messages: PerplexityMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant that searches for and summarizes current information from the web. Provide accurate, up-to-date information with proper citations.'
      },
      {
        role: 'user',
        content: query
      }
    ]

    const requestBody: any = {
      model,
      messages,
      max_tokens,
      temperature,
      top_p,
      top_k,
      stream,
      presence_penalty,
      frequency_penalty,
      return_citations
    }

    if (search_domain_filter && search_domain_filter.length > 0) {
      requestBody.search_domain_filter = search_domain_filter
    }

    if (search_recency_filter) {
      requestBody.search_recency_filter = search_recency_filter
    }

    try {
      const response = await blink.data.fetch({
        url: `${this.baseUrl}/chat/completions`,
        method: 'POST',
        headers: {
          'Authorization': 'Bearer {{PERPLEXITY_API_KEY}}',
          'Content-Type': 'application/json'
        },
        body: requestBody
      })

      if (response.status !== 200) {
        throw new Error(`Perplexity API error: ${response.status}`)
      }

      return response.body as PerplexityResponse
    } catch (error) {
      console.error('Perplexity API search error:', error)
      throw error
    }
  }

  async searchNews(query: string, options?: {
    recency?: 'day' | 'week' | 'month'
    domains?: string[]
    maxTokens?: number
  }): Promise<PerplexityResponse> {
    const newsQuery = `Find the latest news about: ${query}. Please provide recent news articles with sources and publication dates.`
    
    return this.search({
      query: newsQuery,
      model: 'llama-3.1-sonar-small-128k-online',
      max_tokens: options?.maxTokens || 1000,
      search_recency_filter: options?.recency || 'week',
      search_domain_filter: options?.domains,
      return_citations: true,
      temperature: 0.1
    })
  }

  async searchBlogs(query: string, options?: {
    recency?: 'day' | 'week' | 'month'
    domains?: string[]
    maxTokens?: number
  }): Promise<PerplexityResponse> {
    const blogQuery = `Find recent blog posts and articles about: ${query}. Focus on in-depth analysis, opinions, and detailed coverage from blogs and online publications.`
    
    return this.search({
      query: blogQuery,
      model: 'llama-3.1-sonar-small-128k-online',
      max_tokens: options?.maxTokens || 1200,
      search_recency_filter: options?.recency || 'week',
      search_domain_filter: options?.domains,
      return_citations: true,
      temperature: 0.2
    })
  }

  async searchGeneral(query: string, options?: {
    recency?: 'day' | 'week' | 'month'
    domains?: string[]
    maxTokens?: number
  }): Promise<PerplexityResponse> {
    const generalQuery = `Search for comprehensive information about: ${query}. Include various types of content like articles, discussions, reports, and other relevant online content.`
    
    return this.search({
      query: generalQuery,
      model: 'llama-3.1-sonar-large-128k-online',
      max_tokens: options?.maxTokens || 1500,
      search_recency_filter: options?.recency || 'month',
      search_domain_filter: options?.domains,
      return_citations: true,
      temperature: 0.3
    })
  }
}

export const perplexityApiService = new PerplexityApiService()