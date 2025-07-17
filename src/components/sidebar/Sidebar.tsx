import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  LayoutDashboard, 
  Database, 
  Search, 
  Settings, 
  RefreshCw,
  ChevronLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CosmosTools } from '@/components/cosmos/CosmosTools'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  activeItem?: string
  onActiveItemChange?: (item: string) => void
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    active: true
  },
  {
    icon: Database,
    label: 'Fuentes',
    active: false
  },
  {
    icon: Search,
    label: 'Búsqueda',
    active: false
  },
  {
    icon: Settings,
    label: 'Configuración',
    active: false
  }
]

export function Sidebar({ collapsed, onToggle, activeItem = 'Dashboard', onActiveItemChange }: SidebarProps) {
  const handleActiveItemChange = (item: string) => {
    if (onActiveItemChange) {
      onActiveItemChange(item)
    }
  }

  const renderContent = () => {
    if (collapsed) {
      return (
        <div className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.label
            
            return (
              <Button
                key={item.label}
                variant="ghost"
                onClick={() => handleActiveItemChange(item.label)}
                className={cn(
                  "w-full justify-center h-10 px-0",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
              </Button>
            )
          })}
          
          {/* Actualizar Contenido Button */}
          <div className="pt-2">
            <Button
              variant="ghost"
              className="w-full justify-center h-10 px-0 text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    }

    if (activeItem === 'Fuentes') {
      return <CosmosTools />
    }

    return (
      <div className="p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.label
          
          return (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => handleActiveItemChange(item.label)}
              className={cn(
                "w-full justify-start h-10 px-3",
                isActive && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
              )}
            >
              <Icon className="h-4 w-4 mr-3" />
              <span className="text-sm">{item.label}</span>
            </Button>
          )
        })}
        
        {/* Actualizar Contenido Button */}
        <div className="pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start h-10 px-3 text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className="h-4 w-4 mr-3" />
            <span className="text-sm">Actualizar Contenido</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r shadow-sm transition-all duration-300 z-40",
      collapsed ? "w-16" : (activeItem === 'Fuentes' ? "w-96" : "w-64")
    )}>
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        {!collapsed && (
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-sm font-medium text-gray-700">
              {activeItem === 'Fuentes' ? 'COSMOS Configuration' : 'Menu'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-1"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        <ScrollArea className="flex-1">
          {renderContent()}
        </ScrollArea>
      </div>
    </div>
  )
}