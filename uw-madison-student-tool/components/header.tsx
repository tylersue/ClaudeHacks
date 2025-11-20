"use client"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onReset: () => void
}

export default function Header({ onReset }: HeaderProps) {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">📚</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">ResearchNet</h1>
            <p className="text-sm text-muted-foreground">Intelligent Paper Analysis & Discovery</p>
          </div>
        </div>

        <Button onClick={onReset} variant="outline" className="hover:bg-accent/10 transition-colors bg-transparent">
          Start Over
        </Button>
      </div>
    </header>
  )
}
