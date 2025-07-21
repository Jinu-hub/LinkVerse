-- 주어진 user_id와 parent_id(부모 카테고리) 기준으로 
-- 해당 사용자의 카테고리 중 최대 sort_order 값을 반환하는 함수
create or replace function get_max_category_sort_order(user_id uuid, parent_id int)
returns int as $$
select coalesce(max(sort_order), 0)
from category
where user_id = get_max_category_sort_order.user_id
  and (
    parent_category_id = get_max_category_sort_order.parent_id
    or (
      parent_category_id is null
      and get_max_category_sort_order.parent_id is null
    )
  );
$$ language sql stable;
