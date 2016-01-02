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
