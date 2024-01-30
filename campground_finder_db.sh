# first time only: create volume to persist storage
docker volume create pg-campgrounds 

# start docker container, accessible by localhost:5432, port 5432, using the above volume to persist data
docker run -d --rm -P -p 127.0.0.1:5432:5432 -e POSTGRES_PASSWORD="1234" --name pg -v pg-campgrounds:/var/lib/postgresql/data postgis/postgis

# connect
psql postgresql://postgres:1234@localhost:5432/postgres

# process the csv (delete or reorganize columns as needed)

# copy from a csv (after creating table)
    # organizations
    psql postgresql://postgres:1234@localhost:5432/postgres -c "\copy organizations (id, type, name, website, abbreviation, jurisdiction_type, updated, parent_organization) from '/home/kcroo/Downloads/RIDBFullExport_V1_CSV/organizations.csv' with (format csv, header)";

    # recreation_areas
    psql postgresql://postgres:1234@localhost:5432/postgres -c "\copy recreation_areas from '/home/kcroo/Downloads/RIDBFullExport_V1_CSV/recreation_areas.csv' with (format csv, header)";
    
    #facilitiespsql 
    psql postgresql://postgres:1234@localhost:5432/postgres -c "\copy facilities from '/home/kcroo/Downloads/RIDBFullExport_V1_CSV/facilities.csv' with (format csv, header)";

    
    
# data clean up
update recreation_areas set description = null where description = '<p></p>';


# download roads shapefile from census for a state (primary and secondary only--would have to go county-by-county in web interface to get all roads)
# could probably use TIGER API to get all roads more easily
# https://www.census.gov/cgi-bin/geo/shapefiles/index.php?year=2022&layergroup=Roads

# load shapefile of roads data (https://postgis.net/workshops/postgis-intro/loading_data.html)

# geocoder setup
# start terminal in docker
docker -it pg
apt-get update 
apt-get install vim

psql postgresql://postgres:1234@localhost:5432/postgres -c "SELECT loader_generate_nation_script('sh');" -o /gisdata/country.sh
# psql postgresql://postgres:1234@localhost:5432/postgres -a -t -o ./country.sql -c "SELECT loader_generate_nation_script('sh');"
#psql postgresql://postgres:1234@localhost:5432/postgres -c "\a \t SELECT loader_generate_nation_script('sh');" -o /gisdata/country.sh
psql postgresql://postgres:1234@localhost:5432/postgres -a -t -o ./oregon.sql -c "SELECT loader_generate_script(array['OR'], 'sh');"


# import shapefile in 4269

ogrinfo /home/kcroo/Downloads/tl_2022_41_prisecroads/tl_2022_41_prisecroads.shp

# import shapefile into table of same name as file, with SRID=4326
# TODO: remove overwrite option when done testing
ogr2ogr -f "PostgreSQL" PG:"host=localhost user=postgres dbname=postgres password=1234" -nlt MULTILINESTRING -t_srs EPSG:4326 -overwrite /home/kcroo/Downloads/tl_2022_41_prisecroads/tl_2022_41_prisecroads.shp

ogr2ogr \
  -nln roads_primary_secondary_or \
  -nlt PROMOTE_TO_MULTI \
  -lco GEOMETRY_NAME=geom \
  -lco FID=id \
  -lco PRECISION=NO \
  -f 'PostgreSQL' \
  PG: "dbname='postgres' host='localhost' port='5432' user='postgres' password='1234'" \
  /home/kcroo/Downloads/tl_2022_41_prisecroads/tl_2022_41_prisecroads.shp