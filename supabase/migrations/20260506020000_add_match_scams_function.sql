create or replace function public.match_scams(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 3
)
returns table (
  id uuid,
  title text,
  slug text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    scams.id,
    scams.title,
    scams.slug,
    1 - (scams.embedding <=> query_embedding) as similarity
  from public.scams
  where
    scams.status = 'approved'
    and scams.embedding is not null
    and 1 - (scams.embedding <=> query_embedding) > match_threshold
  order by scams.embedding <=> query_embedding
  limit match_count;
end;
$$;

create or replace function public.update_scam_embedding(
  p_scame_id uuid,
  p_embedding vector(1536)
)
returns void
language plpgsql
as $$
begin
  update public.scams
  set embedding = p_embedding
  where id = p_scame_id;
end;
$$;
