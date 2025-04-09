
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ThreeBackground from "@/components/ThreeBackground";
import { useEffect, useState } from "react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <>
      <ThreeBackground variant="landing" />
      
      <div className="content-container">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col items-center text-center">
              <h1 
                className={`text-4xl md:text-6xl font-bold leading-tight mb-6 text-transition ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: '100ms' }}
              >
                Unlock Deep Insights with{" "}
                <span className="text-primary">Multi-Agent AI</span>
              </h1>
              <p 
                className={`text-xl text-muted-foreground max-w-2xl mb-10 text-transition ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: '300ms' }}
              >
                Our proprietary multi-agent system analyzes your data with human-like intelligence, 
                delivering powerful insights while keeping your sensitive information secure.
              </p>
              <div 
                className={`flex flex-col sm:flex-row gap-4 text-transition ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: '500ms' }}
              >
                <Button asChild size="lg" className="btn-transition hover-lift">
                  <Link to="/demo">Try Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-secondary/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 animate-fade-in">How AgentInsight Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  step: 1,
                  title: "Upload Your Dataset",
                  description: "Securely upload your CSV, TSV, or other structured dataset files through our encrypted platform."
                },
                {
                  step: 2,
                  title: "Multi-Agent Analysis",
                  description: "Our AI agents work together to write custom code tailored specifically to your dataset, simulating human-like reasoning."
                },
                {
                  step: 3,
                  title: "Actionable Insights",
                  description: "Review comprehensive analysis reports with visualizations and recommendations you can actually use for decision making."
                }
              ].map((item, index) => (
                <div 
                  key={item.step}
                  className="neo-card p-6 hover-lift"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 btn-transition">
                    <span className="text-xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-transition">{item.title}</h3>
                  <p className="text-muted-foreground text-transition">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 animate-fade-in">Why Choose AgentInsight</h2>
            <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto mb-16 animate-fade-in">
              Our technology stands apart with advanced capabilities that deliver superior results.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                {
                  title: "Proprietary RAG Processing",
                  description: "Our stagewise data processing simulates human analytical thinking to extract deeper insights than traditional AI approaches."
                },
                {
                  title: "Enhanced Data Security",
                  description: "Your sensitive data never leaves your secure environment and isn't exposed to external AI models."
                },
                {
                  title: "Custom Code Generation",
                  description: "AI agents write and execute dataset-specific code, enabling deeper analysis than one-size-fits-all approaches."
                },
                {
                  title: "Resource Efficiency",
                  description: "Our optimized processing delivers powerful insights without the computational overhead of other AI analysis platforms."
                }
              ].map((item, index) => (
                <div 
                  key={item.title} 
                  className="flex gap-4 hover-lift"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center btn-transition">
                    <span className="text-primary font-semibold">✓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-transition">{item.title}</h3>
                    <p className="text-muted-foreground text-transition">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">Ready to Transform Your Data?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in">
              Experience the power of multi-agent AI analysis with our interactive demo.
            </p>
            <Button asChild size="lg" className="btn-transition hover-lift animate-fade-in">
              <Link to="/demo">Try the Demo</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
