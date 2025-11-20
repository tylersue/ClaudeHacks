"use client"

import { useState } from "react"
import Header from "@/components/header"
import ModeSelector from "@/components/mode-selector"
import ManualUploadMode from "@/components/manual-upload-mode"
import AgentMode from "@/components/agent-mode"
import KnowledgeGraphPreview from "@/components/knowledge-graph-preview"

export default function Page() {
  const [selectedMode, setSelectedMode] = useState<"manual" | "agent" | null>(null)
  const [papers, setPapers] = useState<any[]>([])
  const [graphReady, setGraphReady] = useState(false)

  const handleReset = () => {
    setSelectedMode(null)
    setPapers([])
    setGraphReady(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header onReset={handleReset} />

      <div className="container mx-auto px-4 py-12">
        {!selectedMode ? (
          <ModeSelector onSelectMode={setSelectedMode} />
        ) : selectedMode === "manual" ? (
          <ManualUploadMode
            onPapersAnalyzed={(papers) => {
              setPapers(papers)
              setGraphReady(true)
            }}
          />
        ) : (
          <AgentMode
            onPapersFound={(papers) => {
              setPapers(papers)
              setGraphReady(true)
            }}
          />
        )}

        {graphReady && papers.length > 0 && <KnowledgeGraphPreview papers={papers} />}
      </div>
    </main>
  )
}
