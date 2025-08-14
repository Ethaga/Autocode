import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SupportedLanguage, CodeAnalysis } from "@shared/schema";
import { Loader2, Play } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  language: SupportedLanguage;
  filename: string;
  onFilenameChange: (filename: string) => void;
  onAnalysisComplete: (analysis: CodeAnalysis) => void;
}

const getPlaceholderCode = (language: SupportedLanguage): string => {
  switch (language) {
    case "javascript":
      return `// Paste kode JavaScript Anda di sini untuk analisis
// Contoh untuk Somnia Network integration:

function transferTokens(to, amount) {
  if (balance[msg.sender] >= amount) {
    balance[msg.sender] -= amount;
    balance[to] += amount;
    return true;
  }
  return false;
}`;

    case "python":
      return `# Paste kode Python Anda di sini untuk analisis
# Contoh untuk data processing:

def process_blockchain_data(data):
    try:
        result = eval(data)  # Potential security issue
        return result
    except:
        return None`;

    case "solidity":
      return `// Paste kode Solidity Anda di sini untuk analisis
// Contoh untuk Somnia Network smart contract:

pragma solidity ^0.8.0;

contract SomniaExample {
    mapping(address => uint256) public balances;
    
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}`;

    default:
      return "// Paste your code here for analysis";
  }
};

export default function CodeEditor({
  code,
  onCodeChange,
  language,
  filename,
  onFilenameChange,
  onAnalysisComplete,
}: CodeEditorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const analyzeMutation = useMutation({
    mutationFn: async (analysisData: { code: string; language: SupportedLanguage; filename: string }) => {
      const response = await apiRequest("POST", "/api/analyze", analysisData);
      return response.json();
    },
    onSuccess: (analysis: CodeAnalysis) => {
      // Poll for completion
      pollForCompletion(analysis.id);
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to start analysis",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    },
  });

  const pollForCompletion = async (analysisId: string) => {
    const checkStatus = async (): Promise<void> => {
      try {
        const response = await apiRequest("GET", `/api/analyses/${analysisId}`);
        const analysis: CodeAnalysis = await response.json();

        if (analysis.status === "completed") {
          setIsAnalyzing(false);
          onAnalysisComplete(analysis);
          queryClient.invalidateQueries({ queryKey: ['/api/analyses/recent'] });
          queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
          toast({
            title: "Analysis Complete",
            description: `Found ${analysis.results?.summary.total || 0} issues`,
          });
        } else if (analysis.status === "failed") {
          setIsAnalyzing(false);
          toast({
            title: "Analysis Failed",
            description: "Code analysis encountered an error",
            variant: "destructive",
          });
        } else {
          // Still pending, check again in 1 second
          setTimeout(checkStatus, 1000);
        }
      } catch (error) {
        setIsAnalyzing(false);
        toast({
          title: "Analysis Error",
          description: "Failed to check analysis status",
          variant: "destructive",
        });
      }
    };

    await checkStatus();
  };

  const handleStartAnalysis = () => {
    if (!code.trim()) {
      toast({
        title: "No Code Provided",
        description: "Please enter some code to analyze",
        variant: "destructive",
      });
      return;
    }

    const analysisFilename = filename || `untitled.${language === "javascript" ? "js" : language === "python" ? "py" : "sol"}`;
    
    setIsAnalyzing(true);
    analyzeMutation.mutate({
      code,
      language,
      filename: analysisFilename,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="filename" className="text-sm font-medium text-foreground mb-2 block">
          Nama File (opsional)
        </Label>
        <Input
          id="filename"
          value={filename}
          onChange={(e) => onFilenameChange(e.target.value)}
          placeholder={`untitled.${language === "javascript" ? "js" : language === "python" ? "py" : "sol"}`}
          className="w-full"
          data-testid="input-filename"
        />
      </div>

      <div>
        <Label htmlFor="code-input" className="text-sm font-medium text-foreground mb-2 block">
          Kode
        </Label>
        <Textarea
          id="code-input"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder={getPlaceholderCode(language)}
          className="w-full h-64 font-mono text-sm resize-none"
          data-testid="textarea-code-input"
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleStartAnalysis}
          disabled={!code.trim() || isAnalyzing}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          data-testid="button-analyze-code"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menganalisis...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Mulai Analisis
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
