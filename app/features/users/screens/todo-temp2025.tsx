import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/core/components/ui/card";
import { Badge } from "~/core/components/ui/badge";
import { CheckCircle, Circle, AlertCircle, ExternalLink, Download, Upload, Move, Users } from "lucide-react";

export default function TodoTemp2025() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🚧 개발 예정 기능들
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          예정하고 있었지만 아직 구현하지 못한 기능들입니다.
        </p>
      </div>

      <div className="space-y-6">
        {/* 기존 북마크 import 기능 */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Upload className="h-6 w-6 text-blue-500" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  기존 북마크 Import 기능
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    High Priority
                  </Badge>
                </CardTitle>
                <CardDescription>
                  다양한 소스에서 북마크를 가져와서 Linkverse에 통합
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium">CSV Import</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    CSV 파일에서 북마크 데이터를 가져와서 일괄 추가
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium">브라우저 HTML Export Import</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Chrome, Firefox, Safari 등에서 내보낸 HTML 파일에서 북마크 추출
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium">Browser Extension 연동</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Chrome Extension을 통한 원클릭 북마크 추가 및 동기화
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <br />
        {/* 카테고리 이동 (drag & drop) */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Move className="h-6 w-6 text-green-500" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  카테고리 Drag & Drop 이동
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Medium Priority
                  </Badge>
                </CardTitle>
                <CardDescription>
                  직관적인 드래그 앤 드롭으로 카테고리 구조 재구성
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium">카테고리 계층구조, 위치 변경</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    드래그 앤 드롭으로 카테고리 간의 위치나 계층구조 변경
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium">북마크 일괄 이동</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    카테고리 이동 시 해당 카테고리에 속한 모든 북마크도 함께 이동
                  </p>
                </div>
              </div>
              {/*
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium">시각적 피드백</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    드래그 중인 요소의 위치와 드롭 가능한 영역을 시각적으로 표시
                  </p>
                </div>
              </div>
              */}
            </div>
          </CardContent>
        </Card>
        <br />

        {/* 온보딩 플로우 */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-purple-500" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  온보딩 플로우
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    User Experience
                  </Badge>
                </CardTitle>
                <CardDescription>
                  신규 사용자를 위한 단계별 안내 및 초기 설정
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium">첫 로그인 사용자 안내</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    신규 가입자에게 Linkverse의 주요 기능들을 간단히 소개
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium">초기 설정 가이드</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    기본 카테고리 생성, 테마 설정, 언어 설정 등 초기 환경 구성
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium">기존 북마크 Import 유도</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    기존 브라우저 북마크를 가져오는 방법 안내 및 단계별 가이드
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium">온보딩 완료 체크</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    온보딩 미완료 사용자에게 계속 안내 표시 및 완료 상태 관리
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 추가 예정 기능들 */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-orange-500" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  기타 예정 기능들
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Future
                  </Badge>
                </CardTitle>
                <CardDescription>
                  추가로 고려 중인 기능들
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium">로딩중 화면</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    시간이 걸리는 작업이 있을때 로딩중 화면 고려
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium">퍼포먼스 개선</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    퍼포먼스 개선 및 최적화
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h4 className="font-medium">다국어 지원</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    다국어 지원 (한국어, 영어, 그외 언어)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <ExternalLink className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">개발 참고사항</h3>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          이 페이지는 개발 예정 기능들을 정리한 TODO 리스트입니다. 
          우선순위에 따라 단계적으로 구현될 예정입니다.
        </p>
      </div>
    </div>
  );
}
