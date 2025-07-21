-- 주어진 tag_id에 대해 taggable 테이블에서 사용된 횟수를 집계하여 tag 테이블의 usage_count를 갱신하는 함수
create or replace function sync_tag_usage_with_content(p_tag_id int)
returns void as $$
declare
  v_usage_count int;
begin
  select count(*) into v_usage_count from taggable where tag_id = p_tag_id;

  update tag
  set usage_count = v_usage_count
  where tag_id = p_tag_id;
end;
$$ language plpgsql;
