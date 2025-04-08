import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ThreeBackground from "@/components/ThreeBackground";

const Index = () => {
  return (
    <>
      <ThreeBackground variant="landing" />
      
      <div className="content-container">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in text-white">
                Unlock Deep Insights with{" "}
                <span className="text-primary">Multi-Agent AI</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mb-10 animate-fade-in">
                Our proprietary multi-agent system analyzes your data with human-like intelligence, 
                delivering powerful insights while keeping your sensitive information secure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
                <Button asChild size="lg">
                  <Link to="/demo">Try Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-secondary/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How AgentInsight Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload Your Dataset</h3>
                <p className="text-muted-foreground">
                  Securely upload your CSV, TSV, or other structured dataset files through our 
                  encrypted platform.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Multi-Agent Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI agents work together to write custom code tailored specifically to your 
                  dataset, simulating human-like reasoning.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Actionable Insights</h3>
                <p className="text-muted-foreground">
                  Review comprehensive analysis reports with visualizations and recommendations 
                  you can actually use for decision making.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Why Choose AgentInsight</h2>
            <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto mb-16">
              Our technology stands apart with advanced capabilities that deliver superior results.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Proprietary RAG Processing</h3>
                  <p className="text-muted-foreground">
                    Our stagewise data processing simulates human analytical thinking to extract 
                    deeper insights than traditional AI approaches.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Enhanced Data Security</h3>
                  <p className="text-muted-foreground">
                    Your sensitive data never leaves your secure environment and isn't exposed 
                    to external AI models.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Custom Code Generation</h3>
                  <p className="text-muted-foreground">
                    AI agents write and execute dataset-specific code, enabling deeper analysis 
                    than one-size-fits-all approaches.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Resource Efficiency</h3>
                  <p className="text-muted-foreground">
                    Our optimized processing delivers powerful insights without the 
                    computational overhead of other AI analysis platforms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Data?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Experience the power of multi-agent AI analysis with our interactive demo.
            </p>
            <Button asChild size="lg">
              <Link to="/demo">Try the Demo</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
