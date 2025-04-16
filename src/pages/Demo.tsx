
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { uploadAndProcessFile, generatePDF } from "@/utils/fileProcessing";
import ThreeBackground from "@/components/ThreeBackground";
import { Loader2, Download } from "lucide-react";
import MarkdownViewer from "@/components/MarkdownViewer";
import ProcessingAnimation from "@/components/ProcessingAnimation";

const Demo = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileId(null);
      setAnalysisResult(null);
      
      toast({
        title: "File selected",
        description: `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`,
      });
    }
  };

  const handleProcess = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file first",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Use the new combined upload and process function
      const { fileId, markdown } = await uploadAndProcessFile(file);
      
      setFileId(fileId);
      setAnalysisResult(markdown);
      
      toast({
        title: "Analysis complete",
        description: "Your dataset has been successfully analyzed",
      });
      
      // Auto navigate to the result tab
      setActiveTab("result");
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: "There was an error analyzing your file",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!analysisResult) {
      toast({
        variant: "destructive",
        title: "No results to download",
        description: "Please analyze your data first",
      });
      return;
    }

    setIsPdfGenerating(true);
    try {
      await generatePDF(analysisResult, `${file?.name.split('.')[0] || 'analysis'}-report.pdf`);
      
      toast({
        title: "PDF generated",
        description: "Your report has been downloaded",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "PDF generation failed",
        description: "There was an error creating your PDF. Please try again.",
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const resetDemo = () => {
    setFile(null);
    setFileId(null);
    setAnalysisResult(null);
    setActiveTab("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <ThreeBackground variant="demo" />
      
      <div className="content-container">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Interactive Demo</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a dataset and see how our multi-agent AI system analyzes and extracts insights.
            </p>
          </div>

          <Card className="bg-card/80 backdrop-blur-md border border-border/50">
            <CardHeader>
              <CardTitle>Data Analysis Demo</CardTitle>
              <CardDescription>
                Upload a CSV, TSV, or any other structured dataset for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">1. Upload File</TabsTrigger>
                  <TabsTrigger value="result" disabled={!analysisResult}>2. View Results</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="py-4">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-all duration-300">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.tsv,.xlsx,.json"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-input"
                      />
                      <label
                        htmlFor="file-input"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-3 transition-transform duration-300 hover:scale-110">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <p className="text-lg font-medium mb-1 transition-all duration-300 hover:text-primary">
                          Drag and drop your file here, or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports CSV, TSV, XLSX, and JSON files (max 10MB)
                        </p>
                      </label>
                    </div>
                    
                    {file && (
                      <div className="flex flex-col sm:flex-row items-center justify-between bg-secondary/50 p-3 rounded-lg transition-all duration-300 animate-fade-in">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-primary"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="font-medium truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setFile(null)}
                            className="transition-all duration-300 hover:bg-destructive/10 hover:text-destructive"
                          >
                            Remove
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleProcess} 
                            disabled={isProcessing || !file}
                            className="transition-all duration-300"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              'Start Analysis'
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {isProcessing && (
                      <div className="bg-secondary/30 p-6 rounded-lg transition-all duration-300 animate-fade-in">
                        <ProcessingAnimation message="Analyzing your dataset..." />
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="result" className="py-4">
                  <div className="space-y-6">
                    <div className="bg-secondary/30 p-6 rounded-lg">
                      <h3 className="text-xl font-medium mb-4">Analysis Results</h3>
                      
                      {analysisResult ? (
                        <div className="prose prose-invert max-w-none animate-fade-in">
                          <MarkdownViewer content={analysisResult} />
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No results yet. Please complete the analysis first.
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={resetDemo}
                className="transition-all duration-300"
              >
                Reset Demo
              </Button>
              {analysisResult && (
                <Button
                  onClick={handleDownloadPdf}
                  disabled={isPdfGenerating}
                  className="transition-all duration-300"
                >
                  {isPdfGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to analyze your own data?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Contact us for a personalized demonstration with your actual datasets.
            </p>
            <Button asChild className="transition-all duration-300">
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Demo;
