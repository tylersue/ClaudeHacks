"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ModeSelectorProps {
  onSelectMode: (mode: "manual" | "agent") => void
}

export default function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          How do you want to explore research?
        </h2>
        <p className="text-lg text-muted-foreground">Choose your path: Manual precision or AI-powered discovery</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Manual Upload Mode */}
        <Card
          className="group cursor-pointer border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 overflow-hidden"
          onClick={() => onSelectMode("manual")}
        >
          <div className="h-1 bg-gradient-to-r from-primary to-accent group-hover:h-2 transition-all duration-300" />
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📤</span>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/20 text-primary">MANUAL</span>
            </div>
            <CardTitle className="text-2xl group-hover:text-primary transition-colors">Upload & Analyze</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base mb-6 text-foreground/80">
              You're in control. Upload your 3-5 key research papers and we'll build a knowledge graph from exactly what
              you provide.
            </CardDescription>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <span className="text-primary font-bold">✓</span>
                <span>Extract entities (genes, diseases, drugs)</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-primary font-bold">✓</span>
                <span>Build targeted knowledge graph</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-primary font-bold">✓</span>
                <span>Chat with your papers</span>
              </li>
            </ul>
            <Button className="w-full bg-primary hover:bg-primary/90 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
              Get Started with Uploads
            </Button>
          </CardContent>
        </Card>

        {/* Agent Mode */}
        <Card
          className="group cursor-pointer border-2 border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 overflow-hidden"
          onClick={() => onSelectMode("agent")}
        >
          <div className="h-1 bg-gradient-to-r from-accent to-primary group-hover:h-2 transition-all duration-300" />
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🤖</span>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent/20 text-accent">AUTONOMOUS</span>
            </div>
            <CardTitle className="text-2xl group-hover:text-accent transition-colors">AI Discovery</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base mb-6 text-foreground/80">
              Let our AI agent do the heavy lifting. Search PubMed, download papers, and build a comprehensive knowledge
              graph automatically.
            </CardDescription>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <span className="text-accent font-bold">⚡</span>
                <span>Autonomous PubMed search & download</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-accent font-bold">⚡</span>
                <span>Analyze 20-50 papers automatically</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-accent font-bold">⚡</span>
                <span>Explore entire research landscape</span>
              </li>
            </ul>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground group-hover:shadow-lg group-hover:shadow-accent/20 transition-all">
              Launch AI Discovery
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 p-6 rounded-lg bg-muted/50 border border-border/50 animate-fade-in animation-delay-300">
        <p className="text-center text-sm text-muted-foreground">
          💡 <span className="font-semibold text-foreground">Pro Tip:</span> Use Manual mode for deep dives into
          specific papers, and AI mode to explore an entire research domain quickly.
        </p>
      </div>
    </div>
  )
}
