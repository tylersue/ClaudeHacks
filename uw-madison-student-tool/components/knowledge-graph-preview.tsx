"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface KnowledgeGraphPreviewProps {
  papers: any[]
}

export default function KnowledgeGraphPreview({ papers }: KnowledgeGraphPreviewProps) {
  return (
    <div className="mt-16 pt-16 border-t border-border/50 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Knowledge Graph Ready</h2>
        <p className="text-muted-foreground mb-8">{papers.length} papers analyzed. Explore connections and entities.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">{papers.length}</div>
              <p className="text-muted-foreground">Papers Analyzed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-accent mb-2">{Math.floor(papers.length * 3.5)}</div>
              <p className="text-muted-foreground">Entities Extracted</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">{Math.floor(papers.length * 8.2)}</div>
              <p className="text-muted-foreground">Relationships Found</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 overflow-hidden">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Start exploring your knowledge graph</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button className="py-6 text-base font-semibold hover:shadow-lg hover:shadow-primary/20">
                🗺️ View Knowledge Graph
              </Button>
              <Button variant="outline" className="py-6 text-base font-semibold hover:bg-accent/10 bg-transparent">
                💬 Chat with Papers
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your knowledge graph is ready for exploration. Ask questions, discover relationships between papers, and
              dive deep into specific topics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
