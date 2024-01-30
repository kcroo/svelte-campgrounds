create type organization_types as enum (
	'Commercial',
	'Federal Agency',
	'Federal Department',
	'State'
);

create type jurisdiction_types as enum (
	'Federal',
	'State'
);

create table organizations (
	--OrgID	OrgType	OrgName	OrgImageURL	OrgURLText	OrgURLAddress	OrgAbbrevName	OrgJurisdictionType	OrgParentID	LastUpdatedDate
	id serial primary key,
	type organization_types not null,
	name text not null,
	website text,
	abbreviation text,
	jurisdiction_type jurisdiction_types,
	updated date,
	parent_organization integer
);

update organizations set parent_organization = null where not exists (select id from organizations o where o.id = organizations.parent_organization);
alter table organizations add constraint organizations_parent_organization_fk foreign key (parent_organization) references organizations(id);


create table recreation_areas (
	-- id	organization_id	name	description	fee_description	RecAreaDirections	phone	email	reservation_url	map_url	long	lat	stay_limit	keywords	reservable	updated
	id serial primary key,
	organization_id integer references organizations(id),
	name text,
	description text,
	fee_description text,
	directions text,
	phone text,
	email text,
	reservation_url text,
	map_url text,
	long float,
	lat float,
	stay_limit text,
	keywords text,
	reservable boolean,
	updated date
);

create index recreation_areas_organization_id_idx on recreation_areas (organization_id);

alter table recreation_areas add column location geography(POINT,4326);

update recreation_areas set location = ST_SetSRID(ST_MakePoint(long, lat), 4326);

CREATE INDEX recreation_areas_location_idx
  ON recreation_areas
  USING GIST (location);
  
alter table recreation_areas drop column long;
alter table recreation_areas drop column lat;


-- facilities
create table facilities (
	id serial primary key,
	organization integer,
	recreation_area integer,
	name text,
	description text,
	type facility_types,
	fee_description text,
	directions text,
	phone text,
	email text,
	reservation_url text,
	map_url text,
	ada_access text,
	long float,
	lat float,
	keywords text,
	stay_limit text,
	reservable boolean,
	updated date
);

alter table facilities add column location geography(POINT,4326);

update facilities set location = ST_SetSRID(ST_MakePoint(long, lat), 4326);

CREATE INDEX facilities_location_idx
  ON facilities
  USING GIST (location);
  
alter table facilities drop column long;
alter table facilities drop column lat;
