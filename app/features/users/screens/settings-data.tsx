import type { Route } from "./+types/account";

import makeServerClient from "~/core/lib/supa-client.server";
import { useState, useRef } from "react";
import { Button } from "~/core/components/ui/button";
import { Input } from "~/core/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/core/components/ui/card";
import { toast } from "sonner";
import { addCategory, bulkAddBookmark, prepareBookmarksFromCSV } from "../lib/actions";

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

  const handleRegisterCSV = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const parsedData = parseCSV(text);
      
      // 2행부터 카테고리 추출 (인덱스 1부터)
      const categories = parsedData.slice(1).map(row => row[1]).filter(category => category && category.trim() !== '');
      
      // 중복 제거 및 카테고리 정리
      const uniqueCategories = [...new Set(categories)];
      
      // 카테고리 계층 구조 분석 및 시뮬레이션
      const categoryMap: Record<string, { id: number, level: number, parent_id: number | null }> = {};
      
      // 카테고리 레벨 등록 함수
      const registerCategoryLevel = async (
        level: number,
        categories: string[],
        categoryMap: Record<string, { id: number, level: number, parent_id: number | null }>,
        getParentInfo: (parts: string[]) => { parentId: number | null, categoryName: string, parentPath: string }
      ) => {
        console.log(`\n=== ${level}단계: 레벨 ${level} 카테고리 등록 ===`);
        const levelCategories = new Set<string>();
        //let currentParentId = 0;
        
        for (const category of categories) {
          const parts = category.split('>').map(part => part.trim());
          if (parts.length >= level) {
            const { parentId, categoryName, parentPath } = getParentInfo(parts);
            const fullPath = parentPath ? `${parentPath} > ${categoryName}` : categoryName;
            
            if (!levelCategories.has(fullPath)) {
              levelCategories.add(fullPath);
              
              if (parentId) {
                
                const newCategory = await addCategory({
                  name: categoryName,
                  parent_id: parentId,
                  level: level,
                });

                categoryMap[fullPath] = {
                  id: newCategory.category_id,
                  level: level,
                  parent_id: parentId
                };
                
                const parentDisplay = parentPath ? `${parentPath.split(' > ').pop()}` : 'null';
                console.log(`등록: ${categoryName} (ID: ${newCategory.category_id}, 레벨: ${level}, 부모: ${parentDisplay} (ID: ${parentId}))`);
                //tempCategoryId++;
              }
            }
          }
        }
      };
      
      // 1단계: 최상위 카테고리 등록 (레벨 1)
      const rootCategories = [...new Set(uniqueCategories.map(cat => cat.split('>')[0].trim()))];
      console.log('=== 1단계: 최상위 카테고리 등록 ===');
      //let tempCategoryId = 1;
      for (const rootCat of rootCategories) {
        const newCategory = await addCategory({
          name: rootCat,
          parent_id: 0, 
          level: 1,
        });
        categoryMap[rootCat] = {
          id: newCategory.category_id,
          level: 1,
          parent_id: null
        };
        console.log(`등록: ${rootCat} (ID: ${newCategory.category_id}, 레벨: 1, 부모: null)`);
        //tempCategoryId++;
      }
      
      // 2단계: 레벨 2 카테고리 등록
      await registerCategoryLevel(2, uniqueCategories, categoryMap, (parts) => ({
        parentId: categoryMap[parts[0]]?.id || null,
        categoryName: parts[1],
        parentPath: parts[0]
      }));
      
      // 3단계: 레벨 3 카테고리 등록
      await registerCategoryLevel(3, uniqueCategories, categoryMap, (parts) => ({
        parentId: categoryMap[`${parts[0]} > ${parts[1]}`]?.id || null,
        categoryName: parts[2],
        parentPath: `${parts[0]} > ${parts[1]}`
      }));
      
      console.log('\n=== 최종 카테고리 맵 ===');
      console.log(categoryMap);
      
      toast.success(`카테고리 등록 완료: ${Object.keys(categoryMap).length}개 카테고리 등록됨`);

      console.log('=== 북마크 등록 시작 ===');

      // actions.ts의 함수로 북마크 준비
      const bookmarks = prepareBookmarksFromCSV(parsedData, categoryMap);
      console.log(`\n=== 북마크 준비 완료 ===`);
      console.log(`총 ${bookmarks.length}개의 북마크가 준비되었습니다.`);
      // 북마크 데이터 샘플 출력 (처음 5개)
      /*
      console.log('\n=== 북마크 데이터 샘플 (처음 5개) ===');
      bookmarks.slice(0, 5).forEach((bookmark, index) => {
        console.log(`${index + 1}. ID: ${bookmark.bookmark_id}`);
        console.log(`   제목: ${bookmark.title}`);
        console.log(`   URL: ${bookmark.url}`);
        console.log(`   카테고리 ID: ${bookmark.category_id}`);
        console.log(`   설명: ${bookmark.description}`);
        console.log(`   태그: ${bookmark.tags}`);
        console.log(`   메모: ${bookmark.memo}`);
        console.log('---');
      });
      if (bookmarks.length > 5) {
        console.log(`... 및 ${bookmarks.length - 5}개 더`);
      }
      */

      // 북마크 리스트를 한 번에 처리
      console.log('\n=== 북마크 일괄 등록 시작 ===');
      try {
        // actions.ts의 bulkAddBookmark 함수 사용
        const result = await bulkAddBookmark(
          bookmarks.map(bookmark => ({
            title: bookmark.title,
            url: bookmark.url,
            categoryId: bookmark.category_id,
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
    <div className="flex w-full flex-col items-center gap-10 pt-0 pb-8">
      <h1>임시 비공개 셋팅 페이지(Temporary Private Settings)</h1>
      
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>CSV 데이터 등록</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">파일 선택</label>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                선택된 파일: {file.name}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleViewCSV}
              disabled={!file || isProcessing}
              className="flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? "처리 중..." : "CSV 미리보기"}
            </Button>
            {file && (
              <Button
                variant="outline"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setFile(null);
                  setCsvData([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                disabled={isProcessing}
              >
                초기화
              </Button>
            )}
            <Button
              //disabled={true}
              variant="destructive"
              onClick={handleRegisterCSV}
              disabled={!file || isProcessing}
              className="flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? "처리 중..." : "CSV 데이터등록"}
            </Button>
          </div>

          {csvData.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">CSV 데이터 미리보기</h3>
              <div className="max-h-60 overflow-auto border rounded-md p-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {csvData[0]?.map((header, index) => (
                        <th key={index} className="text-left p-2 font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(1, 6).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvData.length > 6 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    ... 및 {csvData.length - 6}개 행 더
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                총 {csvData.length}행, {csvData[0]?.length || 0}열
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
