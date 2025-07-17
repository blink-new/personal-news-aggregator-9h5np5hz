import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { SearchInterface } from '@/components/search/SearchInterface'
import { Headlines } from '@/components/news/Headlines'
import { SourcesPage } from '@/pages/SourcesPage'
import { TopicsPage } from '@/pages/TopicsPage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Newspaper, 
  Rss, 
  MessageSquare, 
  Mail, 
  Video, 
  Headphones,
  Calendar,
  ChevronRight,
  Search,
  TrendingUp,
  BarChart3,
  Database,
  Hash
} from 'lucide-react'
import { blink } from '@/blink/client'

// Mock data for the dashboard
const mockStats = [
  {
    icon: Newspaper,
    label: 'Noticias',
    count: 25,
    lastDays: 15,
    lastCount: 0,
    color: 'text-red-500',
    bgColor: 'bg-red-50'
  },
  {
    icon: Rss,
    label: 'Blogs',
    count: 15,
    lastDays: 15,
    lastCount: 0,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50'
  },
  {
    icon: MessageSquare,
    label: 'Posts sociales',
    count: 20,
    lastDays: 15,
    lastCount: 0,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Mail,
    label: 'Newsletters',
    count: 10,
    lastDays: 15,
    lastCount: 0,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  {
    icon: Video,
    label: 'Videos',
    count: 15,
    lastDays: 15,
    lastCount: 0,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50'
  },
  {
    icon: Headphones,
    label: 'Podcasts',
    count: 10,
    lastDays: 15,
    lastCount: 0,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50'
  }
]

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('7 días')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeSidebarItem, setActiveSidebarItem] = useState('Dashboard')

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500 text-white mx-auto mb-4">
              <Newspaper className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">COSMOS</h1>
            <p className="text-muted-foreground mb-6">
              by Astro - Personal News Aggregator
            </p>
            <Button onClick={() => blink.auth.login()} className="w-full bg-red-500 hover:bg-red-600">
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalSources = mockStats.reduce((sum, stat) => sum + stat.count, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />
      
      <div className="flex">
        <Sidebar 
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeItem={activeSidebarItem}
          onActiveItemChange={setActiveSidebarItem}
        />
        
        <main className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed 
            ? 'ml-16' 
            : activeSidebarItem === 'Fuentes' 
              ? 'ml-96' 
              : 'ml-64'
        }`}>
          <div className="p-6">
            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-5 max-w-2xl">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="sources" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Sources
                </TabsTrigger>
                <TabsTrigger value="topics" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Topics
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </TabsTrigger>
                <TabsTrigger value="headlines" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Headlines
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-6">
                {/* Header with total sources */}
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                    Fuentes totales: {totalSources}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Últimos 15 días: 0
                  </p>
                </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              {mockStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="relative overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <div className="w-2 h-2 rounded-full bg-red-400 mr-1"></div>
                          <span>Últimos {stat.lastDays} días: {stat.lastCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Period Filter */}
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-sm font-medium text-gray-700">Período:</span>
              <div className="flex space-x-1">
                {['7 días', '15 días', 'Personalizado'].map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                    className={selectedPeriod === period ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    {period}
                  </Button>
                ))}
                {selectedPeriod === 'Personalizado' && (
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Relevant Topics Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Relevant Topics</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No topics available. Try refreshing content with the "Actualizar Contenido" button.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

                {/* Recent Content Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Contenido reciente</h2>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Ver todos
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No links found for the selected period.
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Try using the Search tab to find news and articles
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sources" className="mt-6">
                <SourcesPage />
              </TabsContent>

              <TabsContent value="topics" className="mt-6">
                <TopicsPage />
              </TabsContent>

              <TabsContent value="search" className="mt-6">
                <SearchInterface />
              </TabsContent>

              <TabsContent value="headlines" className="mt-6">
                <Headlines />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App