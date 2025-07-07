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
