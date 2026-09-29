do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'cms_content'
    ) then
    alter publication supabase_realtime add table public.cms_content;
  end if;
end
$$;
