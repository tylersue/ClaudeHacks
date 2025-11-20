"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AgentModeProps {
  onPapersFound: (papers: any[]) => void
}

export default function AgentMode({ onPapersFound }: AgentModeProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchStage, setSearchStage] = useState<"idle" | "searching" | "downloading" | "analyzing">("idle")

  const stages = [
    { id: "searching", label: "Searching PubMed", icon: "🔍" },
    { id: "downloading", label: "Downloading PDFs", icon: "⬇️" },
    { id: "analyzing", label: "Analyzing Papers", icon: "🧬" },
  ]

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)

    // Simulate search process
    for (const stage of stages) {
      setSearchStage(stage.id as any)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    // Mock data
    const mockPapers = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      title: `Research Paper on ${query} - Study ${i + 1}`,
      authors: "Smith, J., et al.",
      year: 2024 - Math.floor(Math.random() * 5),
      citations: Math.floor(Math.random() * 500),
      relevance: 0.8 + Math.random() * 0.2,
    }))

    onPapersFound(mockPapers)
    setIsSearching(false)
    setSearchStage("idle")
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">AI-Powered Research Discovery</h2>
        <p className="text-muted-foreground">
          Enter a research topic and our agent will find, download, and analyze papers from PubMed
        </p>
      </div>

      {/* Search Input */}
      <Card className="mb-8 overflow-hidden border-2 border-accent/30">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Input
              placeholder="e.g., BRCA1 and cancer treatment, CRISPR gene therapy..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              disabled={isSearching}
              className="text-base py-6 px-4"
            />
            <Button
              onClick={handleSearch}
              disabled={!query.trim() || isSearching}
              size="lg"
              className="px-8 bg-gradient-to-r from-accent to-primary hover:shadow-lg hover:shadow-accent/20"
            >
              {isSearching ? <span className="inline-block animate-spin">⏳</span> : "🚀 Launch Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Progress */}
      {isSearching && (
        <div className="space-y-6 mb-12 animate-fade-in">
          <h3 className="font-semibold text-lg">Searching for "{query}"...</h3>

          {stages.map((stage, idx) => {
            const isActive = searchStage === stage.id
            const isComplete =
              (searchStage === "downloading" && stage.id === "searching") ||
              (searchStage === "analyzing" && (stage.id === "searching" || stage.id === "downloading"))

            return (
              <div
                key={stage.id}
                className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  isActive
                    ? "border-accent/50 bg-accent/10 shadow-lg shadow-accent/20"
                    : isComplete
                      ? "border-primary/50 bg-primary/10"
                      : "border-border/30 bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`text-3xl ${isActive ? "animate-pulse" : ""}`}>{stage.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{stage.label}</h4>
                    <div className="mt-2 h-1 bg-border/30 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500 ${
                          isActive ? "w-2/3" : isComplete ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  </div>
                  {isComplete && <span className="text-primary text-2xl animate-fade-in">✓</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info Cards */}
      <div className="space-y-6">
        <h3 className="font-semibold text-lg">How Agent Mode Works</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="text-3xl mb-3">🔍</div>
              <h4 className="font-semibold mb-2">Smart Search</h4>
              <p className="text-sm text-muted-foreground">
                Our agent queries PubMed intelligently to find highly relevant papers
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-accent/50 transition-colors">
            <CardContent className="pt-6">
              <div className="text-3xl mb-3">⬇️</div>
              <h4 className="font-semibold mb-2">Auto Download</h4>
              <p className="text-sm text-muted-foreground">Automatically downloads PDFs from multiple sources</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="text-3xl mb-3">🧬</div>
              <h4 className="font-semibold mb-2">Batch Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Processes 20-50 papers simultaneously for comprehensive coverage
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-accent/50 transition-colors">
            <CardContent className="pt-6">
              <div className="text-3xl mb-3">🗺️</div>
              <h4 className="font-semibold mb-2">Landscape View</h4>
              <p className="text-sm text-muted-foreground">Understand the entire research landscape in your domain</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 p-6 rounded-lg bg-accent/5 border border-accent/20 animate-fade-in">
        <p className="text-sm">
          💡 <span className="font-semibold">Tip:</span> More specific queries yield better results. Try "BRCA1
          mutations in triple-negative breast cancer" instead of just "cancer"
        </p>
      </div>
    </div>
  )
}
