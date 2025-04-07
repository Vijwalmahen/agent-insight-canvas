import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ThreeBackground from "@/components/ThreeBackground";

const Index = () => {
  return (
    <>
      <ThreeBackground variant="landing" />
      
      <div className="content-container">
        {/* Hero Section with enhanced styling */}
        <section className="py-20 md:py-32 px-4 relative overflow-hidden">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white">
                Unlock Deep Insights with{" "}
                <span className="relative inline-block">
                  Multi-Agent AI
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full"></span>
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 animate-fade-in">
                Our proprietary multi-agent system analyzes your data with human-like intelligence, 
                delivering powerful insights while keeping your sensitive information secure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
                <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                  <Link to="/demo">Try Demo</Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 gradient-border hover:bg-secondary/50 transition-all duration-300">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with glass cards */}
        <section className="py-20 px-4 bg-secondary/30 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-6">
              How AgentInsight Works
            </h2>
            <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto mb-16">
              Our advanced AI system works seamlessly to transform raw data into actionable insights
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="glass-card p-8 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 relative">
                <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Upload Your Dataset</h3>
                <p className="text-muted-foreground">
                  Securely upload your CSV, TSV, or other structured dataset files through our 
                  encrypted platform.
                </p>
              </div>
              
              <div className="glass-card p-8 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 relative">
                <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Multi-Agent Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI agents work together to write custom code tailored specifically to your 
                  dataset, simulating human-like reasoning.
                </p>
              </div>
              
              <div className="glass-card p-8 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 relative">
                <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Actionable Insights</h3>
                <p className="text-muted-foreground">
                  Review comprehensive analysis reports with visualizations and recommendations 
                  you can actually use for decision making.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Advantages Section with improved styling */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-6">Why Choose AgentInsight</h2>
            <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto mb-16">
              Our technology stands apart with advanced capabilities that deliver superior results
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex gap-6">
                <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Proprietary RAG Processing</h3>
                  <p className="text-muted-foreground text-lg">
                    Our stagewise data processing simulates human analytical thinking to extract 
                    deeper insights than traditional AI approaches.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Enhanced Data Security</h3>
                  <p className="text-muted-foreground text-lg">
                    Your sensitive data never leaves your secure environment and isn't exposed 
                    to external AI models.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Custom Code Generation</h3>
                  <p className="text-muted-foreground text-lg">
                    AI agents write and execute dataset-specific code, enabling deeper analysis 
                    than one-size-fits-all approaches.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Resource Efficiency</h3>
                  <p className="text-muted-foreground text-lg">
                    Our optimized processing delivers powerful insights without the 
                    computational overhead of other AI analysis platforms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section with enhanced styling */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 backdrop-blur-sm">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-glow">Ready to Transform Your Data?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Experience the power of multi-agent AI analysis with our interactive demo.
            </p>
            <Button asChild size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300">
              <Link to="/demo">Try the Demo</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
