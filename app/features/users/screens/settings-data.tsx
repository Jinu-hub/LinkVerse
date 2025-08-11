import type { Route } from "./+types/account";

import makeServerClient from "~/core/lib/supa-client.server";
import { useState, useRef } from "react";
import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/components/ui/card";
import { toast } from "sonner";
import { bulkAddBookmark, bulkAddCategory, buildCategoryMapFromBulkResults, downloadCSV, getBookmarkData, prepareBookmarksFromCSV, prepareCSVData, prepareCategoriesFromCSV, validateParsedCSV } from "../lib/actions";
import { 
  Download, 
  Upload, 
  FileText, 
  RefreshCw, 
  Database, 
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

export const meta: Route.MetaFunction = () => {
  return [{ title: `Settings | ${import.meta.env.VITE_APP_NAME}` }];
};

export async function loader({ request }: Route.LoaderArgs) {
  const [client] = makeServerClient(request);
  const {
    data: { user },
  } = await client.auth.getUser();
  return {
    user,
  };
}

export default function SettingsTemp2025() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const parseCSV = (text: string): string[][] => {
    const result: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        // 쉼표로 셀 구분
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\n' && !inQuotes) {
        // 따옴표 밖에서 줄바꿈이면 행 구분
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell.trim() !== '')) {
          result.push(currentRow.map(cell => cell.replace(/^"|"$/g, '')));
        }
        currentRow = [];
        currentCell = '';
      } else if (char === '\r' && nextChar === '\n') {
        // Windows 줄바꿈 처리
        if (!inQuotes) {
          currentRow.push(currentCell.trim());
          if (currentRow.some(cell => cell.trim() !== '')) {
            result.push(currentRow.map(cell => cell.replace(/^"|"$/g, '')));
          }
          currentRow = [];
          currentCell = '';
          i++; // \n 건너뛰기
        }
      } else if (char === '\r' || char === '\n') {
        // 단일 줄바꿈 문자 처리
        if (!inQuotes) {
          currentRow.push(currentCell.trim());
          if (currentRow.some(cell => cell.trim() !== '')) {
            result.push(currentRow.map(cell => cell.replace(/^"|"$/g, '')));
          }
          currentRow = [];
          currentCell = '';
        }
      } else {
        currentCell += char;
      }
    }
    
    // 마지막 행 처리
    if (currentCell.trim() !== '' || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell.trim() !== '')) {
        result.push(currentRow.map(cell => cell.replace(/^"|"$/g, '')));
      }
    }
    
    return result;
  };

  const handleViewCSV = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const parsedData = parseCSV(text);
      setCsvData(parsedData);
      toast.success(`CSV 파일을 성공적으로 읽었습니다. (${parsedData.length}행)`);
    } catch (error) {
      console.error('CSV 처리 오류:', error);
      toast.error('CSV 파일 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadCSV = async () => {
    setIsProcessing(true);
    try {
      const bookmarksWithTagsMemo = await getBookmarkData();
      const csvData = await prepareCSVData(bookmarksWithTagsMemo);
      downloadCSV(csvData);
      toast.success('CSV 파일이 성공적으로 다운로드되었습니다.');
    } catch (error) {
      console.error('CSV 다운로드 오류:', error);
      toast.error('CSV 파일 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegisterCSV = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const parsedData = parseCSV(text);

      // CSV Validate
      const { errors } = validateParsedCSV(parsedData);
      if (errors.length > 0) {
        const maxShow = 5;
        const shown = errors.slice(0, maxShow);
        const rest = errors.length - shown.length;
      
        toast.error(
          <div className="text-left whitespace-pre-wrap">
            {`CSV 오류 총 ${errors.length}건\n` +
              shown.map(e => `🚨 row ${e.row} [${e.field}] - ${e.message}`).join('\n') +
              (rest > 0 ? `\n그 외 ${rest}건의 에러가 확인되었습니다.` : '')
            }
          </div>
        );
        setIsProcessing(false);
        return;
      }
      console.log("=== CSV Validate 완료 ===");
      console.log("=== 카테고리 일괄 등록 시작 ===");
      
      // 1) 카테고리 경로 준비 (3번째 열 → index 2)
      const categoryPaths = prepareCategoriesFromCSV(parsedData);

      // 2) 카테고리 일괄 등록 (부모 자동解決)
      const categoryBulkResult = await bulkAddCategory(categoryPaths);

      // 3) 북마크 등록用 categoryMap 構築
      const categoryMap: Record<string, { id: number, level: number, parent_id: number | null }> = buildCategoryMapFromBulkResults(
        categoryBulkResult.results
      );

      console.log(`=== 카태고리 일괄 등록 완료 === ${Object.keys(categoryMap).length}개 카테고리 등록됨`);
      
      toast.success(`카테고리 준비 완료: ${Object.keys(categoryMap).length}개 경로 처리됨 (신규 ${categoryBulkResult.created} / 기존 ${categoryBulkResult.existed})`);
      console.log("categoryMap", categoryMap);
      console.log('=== 북마크 등록 시작 ===');

      // actions.ts의 함수로 북마크 준비
      const bookmarks = prepareBookmarksFromCSV(parsedData, categoryMap);
      console.log(`\n=== 북마크 준비 완료 ===`);
      console.log(`총 ${bookmarks.length}개의 북마크가 준비되었습니다.`);

      // 북마크 리스트를 한 번에 처리
      console.log('\n=== 북마크 일괄 등록 시작 ===');
      try {
        // actions.ts의 bulkAddBookmark 함수 사용
        const result = await bulkAddBookmark(
          bookmarks.map(bookmark => ({
            title: bookmark.title,
            url: bookmark.url,
            categoryId: bookmark.category_id || null,
            tags: bookmark.tags,
            memo: bookmark.memo,
            description: bookmark.description,
          }))
        );
        console.log('=== 북마크 일괄 등록 결과 ===');
        console.log(`총 ${result.total}개 중 ${result.successful}개 성공, ${result.failed}개 실패`);
        
        if (result.failed > 0) {
          console.log('실패한 북마크들:');
          result.results.filter((r: any) => !r.success).forEach((r: any) => {
            console.log(`- ${r.url}: ${r.error}`);
          });
        }

        toast.success(`북마크 일괄 등록 완료: ${result.successful}/${result.total}개 성공`);
      } catch (error) {
        console.error('북마크 일괄 등록 오류:', error);
        toast.error('북마크 일괄 등록 중 오류가 발생했습니다.');
      }
      
    } catch (error) {
      console.error('CSV 처리 오류:', error);
      toast.error('CSV 파일 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">데이터 관리</h1>
        <p className="text-muted-foreground">북마크 데이터를 CSV 파일로 내보내고 가져올 수 있습니다.</p>
      </div>
      
      <div className="grid gap-6 ">
        {/* CSV 데이터 다운로드 카드 */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">데이터 내보내기</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">북마크 데이터를 CSV 파일로 다운로드</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p>등록된 북마크 데이터를 CSV 파일로 다운로드합니다.</p>
                  <p className="mt-1">다운로드 받은 CSV 파일을 수정하여 북마크 데이터를 다시 등록할 수 있습니다.</p>
                </div>
              </div>
            </div>
            
            <Button
              disabled={isProcessing}
              variant="outline"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDownloadCSV}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  처리 중...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  CSV 데이터 다운로드
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* CSV 템플릿 생성 카드 */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <FileSpreadsheet className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-xl">CSV 템플릿 생성</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">구글 스프레드시트로 CSV 템플릿 생성</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p>구글 스프레드시트를 사용하여 CSV 템플릿을 쉽게 생성할 수 있습니다.</p>
                  <p className="mt-1">스프레드시트에서 데이터를 입력하고 CSV로 내보내기만 하면 됩니다.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium">사용 방법</span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded text-xs font-medium">1</span>
                  <span>아래 버튼을 클릭하여 CSV생성 스프레드시트를 복사합니다</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded text-xs font-medium">2</span>
                  <span>스프레드시트에 북마크 데이터를 입력합니다</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded text-xs font-medium">3</span>
                  <span>매크로 실행 → CSV다운로드를 클릭합니다</span>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-medium mb-1">⚠️ 인증 안내</p>
                  <div className="text-xs space-y-1">
                    <p>• 최초 실행시 구글 인증이 필요합니다 (10초 정도 소요)</p>
                    <p>• "확인되지 않은 앱" 경고시 → "고급" → "안전하지 않은 앱으로 이동" 클릭 (안전한 템플릿이므로 걱정하지 마세요)</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 hover:from-amber-600 hover:to-orange-600 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  // 구글 스프레드시트 템플릿 URL (실제 URL로 교체 필요)
                  const templateUrl = "https://drive.google.com/drive/u/0/folders/1NXrNh3bADCSi1NguYXAFwpkGNgeAOiy1";
                  window.open(templateUrl, '_blank');
                }}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                구글 스프레드시트 템플릿 열기
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                  onClick={() => {
                    // CSV 템플릿 다운로드 로직
                    const csvTemplate = `title,url,category,tags,memo
예시 북마크,https://example.com,개발,javascript,react,메모 예시
`;
                    const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', 'bookmarks_template.csv');
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  또는 CSV 템플릿 직접 다운로드
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSV 데이터 등록 카드 */}
        <Card className="relative overflow-hidden md:col-span-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-xl">데이터 가져오기</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">CSV 파일에서 북마크 데이터 등록</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  파일 선택
                </label>
                <div className="relative">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  {file && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{file.name}</span>
                      <span className="text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  CSV 형식 안내
                </label>
                <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground">
                  <div className="space-y-1">
                    <p><strong>필수 컬럼 : url - 북마크 URL</strong></p>
                    <p><strong>임의 컬럼</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>title - 북마크 제목 (미입력시 자동 추출)</li>
                      <li>category - 카테고리</li>
                      <li>tags - 태그 (쉼표로 구분)</li>
                      <li>memo - 메모</li>
                      <li>description - 설명 (미입력시 자동 추출)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {file && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setCsvData([]);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  disabled={isProcessing}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  초기화
                </Button>
              )}
              
              <Button
                disabled={isProcessing}
                variant="default"
                onClick={handleRegisterCSV}
                className="flex items-center w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    처리 중...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    CSV 데이터 등록
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CSV 데이터 미리보기 */}
      {csvData.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <FileSpreadsheet className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-xl">CSV 데이터 미리보기</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  총 {csvData.length}행, {csvData[0]?.length || 0}열
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-80 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      {csvData[0]?.map((header, index) => (
                        <th key={index} className="text-left p-3 font-medium text-foreground">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(1, 6).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t hover:bg-muted/30 transition-colors">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-3 text-muted-foreground">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {csvData.length > 6 && (
                <div className="p-3 bg-muted/30 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    ... 및 {csvData.length - 6}개 행 더
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
