-- ICTUE - Esquema Supabase
-- Reemplaza el backend Express: Auth via Supabase Auth, datos via Postgres + RLS

-- Perfiles de usuario (nombre, rol) enlazados a auth.users
create table if not exists public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol text not null default 'lider',
  created_at timestamptz default now()
);

create table if not exists public.reuniones_planeadas (
  id serial primary key,
  dia_semana text not null,
  hora text not null,
  tipo_reunion text not null,
  seccion integer default 1,
  descripcion text,
  created_at timestamptz default now()
);

create table if not exists public.asistencia (
  id serial primary key,
  reunion_id integer references public.reuniones_planeadas(id),
  fecha date not null,
  num_asistentes integer not null,
  expositor text,
  observaciones text,
  registrado_por uuid references auth.users(id),
  created_at timestamptz default now()
);

create index if not exists idx_asistencia_fecha on public.asistencia(fecha);
create index if not exists idx_asistencia_reunion on public.asistencia(reunion_id);

-- Seed de reuniones
insert into public.reuniones_planeadas (dia_semana, hora, tipo_reunion, descripcion)
select * from (values
  ('MAR', '19:30', 'Culto', 'Culto del Martes'),
  ('JUE', '19:30', 'Culto', 'Culto del Jueves'),
  ('DOM', '11:00', 'Culto', 'Culto Domingo Mañana'),
  ('DOM', '18:30', 'Culto', 'Culto Domingo Tarde'),
  ('DOM', '11:00', 'UNT Kids', 'UNT Kids Domingo Mañana'),
  ('DOM', '18:30', 'UNT Kids', 'UNT Kids Domingo Tarde'),
  ('DOM', '11:00', 'UNT Teens', 'UNT Teens Domingo Mañana'),
  ('DOM', '18:30', 'UNT Teens', 'UNT Teens Domingo Tarde')
) as v(dia_semana, hora, tipo_reunion, descripcion)
where not exists (select 1 from public.reuniones_planeadas);

-- Row Level Security: solo usuarios autenticados leen/escriben
alter table public.perfiles enable row level security;
alter table public.reuniones_planeadas enable row level security;
alter table public.asistencia enable row level security;

create policy "perfiles_select_own" on public.perfiles
  for select using (auth.uid() = id);

create policy "reuniones_select_auth" on public.reuniones_planeadas
  for select using (auth.role() = 'authenticated');

create policy "asistencia_select_auth" on public.asistencia
  for select using (auth.role() = 'authenticated');

create policy "asistencia_insert_auth" on public.asistencia
  for insert with check (auth.role() = 'authenticated');

-- Trigger: crear perfil automáticamente al registrar usuario en Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfiles (id, nombre, rol)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre', new.email), coalesce(new.raw_user_meta_data->>'rol', 'lider'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Funciones RPC para estadísticas (reemplazan estadisticas.ts)

create or replace function public.estadisticas_semanal(p_tipo text)
returns table(dia_semana text, hora text, cantidad_registros bigint, promedio numeric, maximo integer, minimo integer)
language sql security definer as $$
  select
    rp.dia_semana,
    rp.hora,
    count(*) as cantidad_registros,
    round(avg(a.num_asistentes)) as promedio,
    max(a.num_asistentes) as maximo,
    min(a.num_asistentes) as minimo
  from public.asistencia a
  join public.reuniones_planeadas rp on a.reunion_id = rp.id
  where rp.tipo_reunion = p_tipo
    and a.fecha >= current_date - interval '7 days'
  group by rp.dia_semana, rp.hora, rp.id
  order by rp.id;
$$;

create or replace function public.estadisticas_mensual(p_tipo text, p_month text)
returns table(fecha date, tipo_reunion text, promedio numeric, total bigint)
language sql security definer as $$
  select
    a.fecha,
    rp.tipo_reunion,
    round(avg(a.num_asistentes)) as promedio,
    sum(a.num_asistentes) as total
  from public.asistencia a
  join public.reuniones_planeadas rp on a.reunion_id = rp.id
  where rp.tipo_reunion = p_tipo
    and to_char(a.fecha, 'YYYY-MM') = p_month
  group by a.fecha, rp.tipo_reunion
  order by a.fecha;
$$;

create or replace function public.estadisticas_anual(p_tipo text)
returns table(anio text, mes text, promedio numeric, cantidad_registros bigint)
language sql security definer as $$
  select
    to_char(a.fecha, 'YYYY') as anio,
    to_char(a.fecha, 'MM') as mes,
    round(avg(a.num_asistentes)) as promedio,
    count(*) as cantidad_registros
  from public.asistencia a
  join public.reuniones_planeadas rp on a.reunion_id = rp.id
  where rp.tipo_reunion = p_tipo
  group by to_char(a.fecha, 'YYYY'), to_char(a.fecha, 'MM')
  order by anio, mes;
$$;
