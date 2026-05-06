create or replace function public.update_report_status(
  p_id uuid,
  p_status text
)
returns json
language plpgsql
as $$
declare
  result_json json;
begin
  update public.reports
  set status = p_status,
      updated_at = now()
  where id = p_id
  returning to_json(reports.*) into result_json;

  return result_json;
end;
$$;

create or replace function public.update_scam(
  p_id uuid,
  p_updates json
)
returns json
language plpgsql
as $$
declare
  result_json json;
  v_title text;
  v_slug text;
  v_category_id uuid;
  v_description text;
  v_how_it_works text;
  v_warning_signs text[];
  v_example_messages text[];
  v_prevention_steps text[];
  v_recovery_steps text[];
  v_emotional_triggers text[];
  v_severity text;
  v_country text;
  v_platform text;
  v_status text;
begin
  -- Extract values from JSON
  v_title := p_updates->>'title';
  v_slug := p_updates->>'slug';
  v_category_id := (p_updates->>'category_id')::uuid;
  v_description := p_updates->>'description';
  v_how_it_works := p_updates->>'how_it_works';
  v_warning_signs := (p_updates->>'warning_signs')::text[];
  v_example_messages := (p_updates->>'example_messages')::text[];
  v_prevention_steps := (p_updates->>'prevention_steps')::text[];
  v_recovery_steps := (p_updates->>'recovery_steps')::text[];
  v_emotional_triggers := (p_updates->>'emotional_triggers')::text[];
  v_severity := p_updates->>'severity';
  v_country := p_updates->>'country';
  v_platform := p_updates->>'platform';
  v_status := p_updates->>'status';

  update public.scams
  set
    title = coalesce(v_title, title),
    slug = coalesce(v_slug, slug),
    category_id = coalesce(v_category_id, category_id),
    description = coalesce(v_description, description),
    how_it_works = coalesce(v_how_it_works, how_it_works),
    warning_signs = coalesce(v_warning_signs, warning_signs),
    example_messages = coalesce(v_example_messages, example_messages),
    prevention_steps = coalesce(v_prevention_steps, prevention_steps),
    recovery_steps = coalesce(v_recovery_steps, recovery_steps),
    emotional_triggers = coalesce(v_emotional_triggers, emotional_triggers),
    severity = coalesce(v_severity, severity)::public.risk_level,
    country = coalesce(v_country, country),
    platform = coalesce(v_platform, platform),
    status = coalesce(v_status, status)::public.scam_status,
    updated_at = now()
  where id = p_id
  returning to_json(scams.*) into result_json;

  return result_json;
end;
$$;
