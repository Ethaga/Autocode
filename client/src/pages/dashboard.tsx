import { useState } from "react";
import { Shield, User, History, HelpCircle, Upload, Edit, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from "@/components/code-editor";
import AnalysisResults from "@/components/analysis-results";
import LanguageSelector from "@/components/language-selector";
import RecentAnalyses from "@/components/recent-analyses";
import StatsCards from "@/components/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { CodeAnalysis, SupportedLanguage } from "@shared/schema";
import { Network, ExternalLink, Code, Download, Book } from "lucide-react";

export default function Dashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("javascript");
  const [code, setCode] = useState("");
  const [filename, setFilename] = useState("");
  const [activeTab, setActiveTab] = useState("paste");
  const [currentAnalysis, setCurrentAnalysis] = useState<CodeAnalysis | null>(null);
  const [analysisOptions, setAnalysisOptions] = useState({
    syntaxCheck: true,
    securityAnalysis: true,
    patternMatching: true,
    performanceOptimization: false,
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  });

  const { data: recentAnalyses } = useQuery({
    queryKey: ['/api/analyses/recent'],
  });

  const handleStartAnalysis = () => {
    if (!code.trim()) {
      return;
    }

    const analysisFilename = filename || `untitled.${selectedLanguage === "javascript" ? "js" : selectedLanguage === "python" ? "py" : "sol"}`;
    setFilename(analysisFilename);
  };

  const handleClearInput = () => {
    setCode("");
    setFilename("");
    setCurrentAnalysis(null);
  };

  const handleAnalysisComplete = (analysis: CodeAnalysis) => {
    setCurrentAnalysis(analysis);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="text-primary text-2xl" />
                <span className="text-xl font-bold text-foreground">CodeGuard</span>
              </div>
              <span className="text-sm text-muted-foreground hidden sm:block">Analisis Kode Blockchain</span>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-foreground hover:text-primary font-medium" data-testid="nav-dashboard">Dashboard</a>
              <a href="#" className="text-foreground hover:text-primary font-medium" data-testid="nav-history">Riwayat</a>
              <a href="#" className="text-foreground hover:text-primary font-medium" data-testid="nav-help">Bantuan</a>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-account">
                <User className="mr-2 h-4 w-4" />Akun
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Selamat Datang di CodeGuard</h1>
          <p className="text-muted-foreground mb-6">
            Analisis kode blockchain Anda untuk mendeteksi bug, kerentanan, dan masalah potensial dengan dukungan khusus untuk Somnia Network.
          </p>
          
          <StatsCards stats={stats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Code Input Section */}
          <div className="lg:col-span-2">
            <Card className="surface">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="text-primary mr-2" />
                  Analisis Kode Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Language Selection */}
                <LanguageSelector 
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />

                {/* Input Methods */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="paste" data-testid="tab-paste-code">
                      <Edit className="mr-2 h-4 w-4" />
                      Paste Kode
                    </TabsTrigger>
                    <TabsTrigger value="upload" data-testid="tab-upload-file">
                      <FileUp className="mr-2 h-4 w-4" />
                      Upload File
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="paste" className="mt-6">
                    <CodeEditor
                      code={code}
                      onCodeChange={setCode}
                      language={selectedLanguage}
                      filename={filename}
                      onFilenameChange={setFilename}
                      onAnalysisComplete={handleAnalysisComplete}
                    />
                  </TabsContent>

                  <TabsContent value="upload" className="mt-6">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag & drop file kode Anda di sini, atau klik untuk memilih file
                      </p>
                      <Button variant="outline" data-testid="button-choose-file">
                        Pilih File
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Somnia Network Integration */}
                <div className="p-4 bg-info/10 rounded-lg border border-info/20">
                  <div className="flex items-start">
                    <div className="p-2 bg-info/20 rounded-lg mr-3">
                      <Network className="h-5 w-5 text-info" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Optimisasi Somnia Network</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        CodeGuard mendukung analisis khusus untuk smart contract Somnia Network dengan performa 1M+ TPS. 
                        Kami akan memeriksa kompatibilitas EVM dan optimisasi untuk consensus MultiStream.
                      </p>
                      <a 
                        href="https://docs.somnia.network/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-info hover:text-info/80 text-sm font-medium flex items-center"
                        data-testid="link-somnia-docs"
                      >
                        Pelajari lebih lanjut <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Analysis Options */}
                <div>
                  <h3 className="font-medium text-foreground mb-3">Opsi Analisis</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="syntax-check"
                        checked={analysisOptions.syntaxCheck}
                        onCheckedChange={(checked) => 
                          setAnalysisOptions(prev => ({ ...prev, syntaxCheck: !!checked }))
                        }
                        data-testid="checkbox-syntax-check"
                      />
                      <label htmlFor="syntax-check" className="text-sm text-foreground">
                        Deteksi Bug Sintaks
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="security-analysis"
                        checked={analysisOptions.securityAnalysis}
                        onCheckedChange={(checked) => 
                          setAnalysisOptions(prev => ({ ...prev, securityAnalysis: !!checked }))
                        }
                        data-testid="checkbox-security-analysis"
                      />
                      <label htmlFor="security-analysis" className="text-sm text-foreground">
                        Analisis Kerentanan Keamanan
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pattern-matching"
                        checked={analysisOptions.patternMatching}
                        onCheckedChange={(checked) => 
                          setAnalysisOptions(prev => ({ ...prev, patternMatching: !!checked }))
                        }
                        data-testid="checkbox-pattern-matching"
                      />
                      <label htmlFor="pattern-matching" className="text-sm text-foreground">
                        Pattern Matching Masalah Logic
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="performance-optimization"
                        checked={analysisOptions.performanceOptimization}
                        onCheckedChange={(checked) => 
                          setAnalysisOptions(prev => ({ ...prev, performanceOptimization: !!checked }))
                        }
                        data-testid="checkbox-performance-optimization"
                      />
                      <label htmlFor="performance-optimization" className="text-sm text-foreground">
                        Optimisasi Performa Blockchain
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" 
                    onClick={handleStartAnalysis}
                    disabled={!code.trim()}
                    data-testid="button-start-analysis"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Mulai Analisis
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={handleClearInput}
                    data-testid="button-clear-input"
                  >
                    <span className="mr-2">🗑️</span>
                    Bersihkan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentAnalyses analyses={recentAnalyses} />

            {/* Quick Actions */}
            <Card className="surface">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">⚡</span>
                  Aksi Cepat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  data-testid="button-template-solidity"
                >
                  <Code className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Template Solidity</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  data-testid="button-export-report"
                >
                  <Download className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Export Laporan</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  data-testid="button-documentation"
                >
                  <Book className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Dokumentasi</span>
                </Button>
              </CardContent>
            </Card>

            {/* Somnia Network Info */}
            <div className="bg-gradient-to-br from-info/10 to-primary/10 rounded-lg p-6 border border-info/20">
              <div className="flex items-start">
                <Network className="text-primary text-2xl mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Somnia Network</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Blockchain Layer 1 ultra-high performance dengan 1M+ TPS, sub-second finality, dan biaya sub-cent.
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1 mb-3">
                    <div>• EVM Compatible</div>
                    <div>• MultiStream Consensus</div>
                    <div>• Gaming & DeFi Focus</div>
                  </div>
                  <a 
                    href="https://somnia.network/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
                    data-testid="link-somnia-website"
                  >
                    Kunjungi Somnia.network <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {currentAnalysis && <AnalysisResults analysis={currentAnalysis} />}
      </div>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="text-primary text-xl" />
                <span className="font-bold text-foreground">CodeGuard</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Platform analisis kode blockchain yang mendukung JavaScript, Python, dan Solidity dengan fokus khusus pada Somnia Network.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Produk</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary" data-testid="footer-static-analysis">Analisis Statis</a></li>
                <li><a href="#" className="hover:text-primary" data-testid="footer-vulnerability-detection">Deteksi Kerentanan</a></li>
                <li><a href="#" className="hover:text-primary" data-testid="footer-cicd-integration">Integrasi CI/CD</a></li>
                <li><a href="#" className="hover:text-primary" data-testid="footer-developer-api">API Developer</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Blockchain</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a 
                    href="https://somnia.network/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary" 
                    data-testid="footer-somnia-network"
                  >
                    Somnia Network
                  </a>
                </li>
                <li>
                  <a 
                    href="https://docs.somnia.network/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary" 
                    data-testid="footer-somnia-docs"
                  >
                    Dokumentasi Somnia
                  </a>
                </li>
                <li><a href="#" className="hover:text-primary" data-testid="footer-smart-contract-audit">Smart Contract Audit</a></li>
                <li><a href="#" className="hover:text-primary" data-testid="footer-defi-security">DeFi Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Dukungan</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary" data-testid="footer-documentation">Dokumentasi</a></li>
                <li><a href="#" className="hover:text-primary" data-testid="footer-tutorial">Tutorial</a></li>
                <li><a href="#" className="hover:text-primary" data-testid="footer-community">Community</a></li>
                <li><a href="#" className="hover:text-primary" data-testid="footer-contact">Kontak</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CodeGuard. Semua hak dilindungi. Mendukung ekosistem Somnia Network.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
