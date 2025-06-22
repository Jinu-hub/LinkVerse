import { Input } from "~/core/components/ui/input";
import { Select, SelectContent, SelectItem
    , SelectTrigger, SelectValue } from "~/core/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "~/core/components/ui/tabs";
import { FiInbox } from "react-icons/fi";
import type { UI_View } from "../types/bookmark.types";

type Props = {
  tabs: UI_View[];
  selectedTabId: string;
  onTabChange: (tabId: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  rowsPerPage: number | 'all';
  onRowsPerPageChange: (value: string) => void;
};

export function BookmarkToolbar({
  tabs,
  selectedTabId,
  onTabChange,
  searchValue,
  onSearchChange,
  rowsPerPage,
  onRowsPerPageChange,
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <Tabs value={selectedTabId} className="w-full">
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.id === 'tab-all' && <FiInbox className="mr-2 h-4 w-4" />}
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex items-center justify-between">
        <div className="w-full max-w-sm">
          <Input
            placeholder="북마크 검색"
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">표시 개수:</span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={onRowsPerPageChange}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 