1. Setup DB

Install postgreSQL:
```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib postgis postgresql-9.4-postgis-2.1 postgresql-9.4-postgis-scripts postgresql-9.4-postgis-2.1-scripts
```

Create user and database:
```
sudo -i -u postgres
createuser --interactive // create "tass-user"
createdb tass
```

Setup postgis extension:
```
sudo -i -u postgres // login as superuser
psql -d tass
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```

Setup password for test user:
```
psql -d tass
ALTER user "tass-user" PASSWORD '1234';
```

Execute script on local database:
```
gradle cleanDb
```

To download data from FEC file execute gradle task 'getData':

```
gradle getData
```

Extract data from FEC files into postgreSQL database using python script:
```
sudo apt-get install python3-psycopg2
```
```
extract_data.py
```

2. Download geographic data from ESRI page:

http://www.arcgis.com/home/item.html?id=8d2012a2016e484dafaac0451f9aea24

Convert ESRI GDP file to SHP:

http://gis.stackexchange.com/questions/108006/how-to-convert-data-from-a-gdb-into-a-shapefile-without-arcmap

Extract SHP geographic data into postgreSQL DB:

http://suite.opengeo.org/opengeo-docs/dataadmin/pgGettingStarted/shp2pgsql.html
```
shp2pgsql -I -s 4326 esri-zip-codes.shp geo_zip_codes | psql -U tass-user -d tass
```

3. Setup geoserver:

http://docs.geoserver.org/stable/en/user/installation/linux.html

Start server:
```
cd /usr/share/geoserver/bin
./startup.sh
```

Publish geographic data from postGIS db to geoserver:
http://docs.geoserver.org/stable/en/user/gettingstarted/postgis-quickstart/index.html

Add layer based on SQL view with name "sum_96_param" and SQL statement:
```
SELECT sum(cc.transaction_amt), cc.zip_code, gz.geom
FROM candidates ca
	inner join committees co on ca.cand_id=co.cand_id
	inner join ind_contribs cc on co.cmte_id=cc.cmte_id
	inner join geo_zip_codes gz on cc.zip_code=gz.zip_code WHERE ca.cand_id='%cand_id%' and ca.cand_office='P' GROUP BY cc.zip_code, gz.geom
```
guess parameters from SQL and get attirubutes.
After defining layer go to edit and set 'Declated SRS' to 'EPSG:4326'. In bounding boxes click 'Compute from data' and 'Compute from native bounds'. After that go to 'Publishing' layer and set default style to 'Polygon'.

npm install openlayers
