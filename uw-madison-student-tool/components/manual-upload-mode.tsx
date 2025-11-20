"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ManualUploadModeProps {
  onPapersAnalyzed: (papers: any[]) => void
}

export default function ManualUploadMode({ onPapersAnalyzed }: ManualUploadModeProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type === "application/pdf")
    setFiles((prev) => [...prev, ...droppedFiles])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      const mockPapers = files.map((file, idx) => ({
        id: idx,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }))
      onPapersAnalyzed(mockPapers)
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Upload Your Research Papers</h2>
        <p className="text-muted-foreground">
          Add 1-5 PDFs to analyze. We'll extract entities and build a knowledge graph.
        </p>
      </div>

      {/* Upload Zone */}
      <Card
        className="border-2 border-dashed transition-all duration-300"
        style={{
          borderColor: dragActive ? "oklch(0.205 0 0)" : undefined,
          backgroundColor: dragActive ? "rgba(32, 81, 209, 0.05)" : undefined,
        }}
      >
        <CardContent className="p-12">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <span className="text-3xl">📄</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2">Drag & drop your PDFs here</h3>
            <p className="text-muted-foreground mb-6">or click to browse your computer</p>

            <Input
              type="file"
              multiple
              accept="application/pdf"
              onChange={handleInputChange}
              className="hidden"
              id="file-input"
            />
            <Button asChild variant="outline" className="hover:bg-primary/10 transition-colors bg-transparent">
              <label htmlFor="file-input" className="cursor-pointer">
                Browse Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      {files.length > 0 && (
        <div className="mt-8 space-y-3 animate-fade-in">
          <h3 className="font-semibold text-foreground">Uploaded Files ({files.length})</h3>
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📕</span>
                <div>
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(idx)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <Button
          onClick={handleAnalyze}
          disabled={files.length === 0 || isAnalyzing}
          className="flex-1 py-6 text-lg font-semibold hover:shadow-lg hover:shadow-primary/20"
        >
          {isAnalyzing ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              Analyzing Papers...
            </>
          ) : (
            "🔍 Analyze Papers"
          )}
        </Button>
      </div>

      {/* Info Cards */}
      <div className="mt-12 grid md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">🧬</div>
            <h4 className="font-semibold mb-1">Entity Extraction</h4>
            <p className="text-sm text-muted-foreground">Identifies genes, diseases, drugs, and proteins</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">🔗</div>
            <h4 className="font-semibold mb-1">Knowledge Graph</h4>
            <p className="text-sm text-muted-foreground">Visualizes relationships between concepts</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">💬</div>
            <h4 className="font-semibold mb-1">Chat Interface</h4>
            <p className="text-sm text-muted-foreground">Ask questions about your papers</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
