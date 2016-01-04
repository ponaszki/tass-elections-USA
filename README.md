1. Setup DB

Install postgreSQL:
```
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

Create user and database:
```
sudo -i -u postgres
createuser --interactive // create "tass-user"
createdb tass
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

Convert ESRI gdb file to SHP:

http://gis.stackexchange.com/questions/108006/how-to-convert-data-from-a-gdb-into-a-shapefile-without-arcmap



