/*Nie sadzilem ze zrobie kiedys takie query*/
alter table "Discovered_by" rename to Discovered_by;
alter table "Discoveries" rename to Discoveries;
alter table "Field_of_sciences" rename to Field_of_sciences;
alter table "Scientists" rename to Scientists;
alter table "Cities" rename to Cities;
alter table "Continents" rename to continents;
alter table "Countries" rename to countries;

--1
explain analyze select * from scientists
inner join discovered_by on scientists.id = discovered_by.scientist_id
inner join discoveries on discovered_by.discovery_id = discoveries.id
inner join field_of_sciences on discoveries.field_of_science_id = field_of_sciences.id
where place_of_birth_id in 
(select id from cities where country_id in
(select id from countries where name like '%a'))
and field_of_sciences.name like 'Physics';

--2
select discoveries.name, discoveries.year_of_discovery
from scientists
inner join discovered_by on scientists.id = discovered_by.scientist_id
inner join discoveries on discovered_by.discovery_id = discoveries.id
inner join field_of_sciences on discoveries.field_of_science_id = field_of_sciences.id
inner join cities on scientists.place_of_birth_id = cities.id
inner join countries on cities.country_id = countries.id
where lower(countries.name) = 'united states of america'
  and lower(field_of_sciences.name) = 'biology'
  and discoveries.year_of_discovery = (
    select min(discoveries.year_of_discovery)
    from scientists
    inner join discovered_by on scientists.id = discovered_by.scientist_id
    inner join discoveries on discovered_by.discovery_id = discoveries.id
    inner join field_of_sciences on discoveries.field_of_science_id = field_of_sciences.id
    inner join cities on scientists.place_of_birth_id = cities.id
    inner join countries on cities.country_id = countries.id
    where lower(countries.name) = 'united states of america'
      and lower(field_of_sciences.name) = 'biology'
  )
union all
select discoveries.name, discoveries.year_of_discovery
from scientists
inner join discovered_by on scientists.id = discovered_by.scientist_id
inner join discoveries on discovered_by.discovery_id = discoveries.id
inner join field_of_sciences on discoveries.field_of_science_id = field_of_sciences.id
inner join cities on scientists.place_of_birth_id = cities.id
inner join countries on cities.country_id = countries.id
where lower(countries.name) = 'united states of america'
  and lower(field_of_sciences.name) = 'biology'
  and discoveries.year_of_discovery = (
    select max(discoveries.year_of_discovery)
    from scientists
    inner join discovered_by on scientists.id = discovered_by.scientist_id
    inner join discoveries on discovered_by.discovery_id = discoveries.id
    inner join field_of_sciences on discoveries.field_of_science_id = field_of_sciences.id
    inner join cities on scientists.place_of_birth_id = cities.id
    inner join countries on cities.country_id = countries.id
    where lower(countries.name) = 'united states of america'
      and lower(field_of_sciences.name) = 'biology'
  );
--3

select * from scientists
inner join discovered_by on scientists.id = discovered_by.scientist_id
inner join discoveries on discovered_by.discovery_id = discoveries.id
inner join field_of_sciences on discoveries.field_of_science_id = field_of_sciences.id
where place_of_birth_id in 
(select id from cities where country_id in
(select id from countries))
and field_of_sciences.name like 'Biology'
and year_of_discovery > 1960;

--4 
select
  continents.name as continent,
  avg(country_discoveries.discovery_count) as average_discoveries_per_country
from
  (
    select
      countries.id as country_id,
      count(*) as discovery_count
    from
      scientists
      join countries on scientists.place_of_birth_id = countries.id
      join discovered_by on scientists.id = discovered_by.scientist_id
    group by
      countries.id
  ) as country_discoveries
  join countries on country_discoveries.country_id = countries.id
  join continents on countries.continent_id = continents.id
group by
  continents.name;

--5
with country_discoveries as (
  select
    lower(countries.name) as country,
    lower(field_of_sciences.name) as field,
    count(distinct discoveries.id) as discovery_count
  from scientists
  inner join cities on scientists.place_of_birth_id = cities.id
  inner join countries on cities.country_id = countries.id
  inner join discovered_by on scientists.id = discovered_by.scientist_id
  inner join discoveries on discovered_by.discovery_id = discoveries.id
  inner join field_of_sciences on discoveries.field_of_science_id = field_of_sciences.id
  where countries.continent_id = 1
  group by countries.name, field_of_sciences.name
), max_discoveries as (
  select
    country,
    max(discovery_count) as max_count
  from country_discoveries
  group by country
)
select
  cd.country,
  cd.field,
  cd.discovery_count
from country_discoveries cd
inner join max_discoveries md
  on cd.country = md.country and cd.discovery_count = md.max_count
order by cd.country, cd.field;

--6
select
  lower(continents.name) as continent,
  round(
    count(distinct discovered_by.discovery_id)::numeric
    / count(distinct scientists.id), 6
  ) as average_discoveries_per_scientist
from scientists
inner join cities on scientists.place_of_birth_id = cities.id
inner join countries on cities.country_id = countries.id
inner join continents on countries.continent_id = continents.id
inner join discovered_by on scientists.id = discovered_by.scientist_id
group by continents.name
order by continent asc;

--7
select
  lower(c.name) as country,
  round(cd.discovery_count::numeric / c."data.size", 6) as discoveries_per_km2
from
  countries c
  join (
    select
      co.id as country_id,
      count(distinct db.discovery_id) as discovery_count
    from
      scientists s
      join cities ci on s.place_of_birth_id = ci.id
      join countries co on ci.country_id = co.id
      join discovered_by db on s.id = db.scientist_id
    group by
      co.id
  ) cd on c.id = cd.country_id
where
  c."data.size" is not null and c."data.size" > 0
order by
  discoveries_per_km2 desc
limit 1;


--8
select
  lower(cities.name) as city,
  count(distinct scientists.id) as physicist_count
from scientists
inner join cities on scientists.place_of_birth_id = cities.id
inner join discovered_by on scientists.id = discovered_by.scientist_id
inner join discoveries on discovered_by.discovery_id = discoveries.id
inner join field_of_sciences on discoveries.field_of_science_id = field_of_sciences.id
where lower(field_of_sciences.name) = 'physics'
group by cities.name
order by physicist_count desc
limit 1;
