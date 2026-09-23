-- Remove prompt metadata that is no longer shown or edited in the site.
-- Other prompt parameters and all product content remain unchanged.
update public.cms_content
set data = jsonb_set(
  data,
  '{parameters}',
  (data->'parameters') - 'engine' - 'aspectRatio',
  false
)
where collection = 'aiPrompts'
  and jsonb_typeof(data->'parameters') = 'object'
  and (data->'parameters' ? 'engine' or data->'parameters' ? 'aspectRatio');
