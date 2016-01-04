import sys
import psycopg2
import configparser as cp
import readers
import queries


def insert(first_interval_year, sec_interval_year, con, read_fun, insert_fun):
    print(read_fun)
    for year in range(first_interval_year, sec_interval_year + 1, 2):
        objects = read_fun(year)
        for s in range(round((len(objects) / 1000 + 1))):
            print(objects[1000 * s:1000 * (s + 1)])
            con.cursor().executemany(insert_fun(), objects[1000 * s:1000 * (s + 1)])
            con.commit()


def insert_all(first_interval, sec_interval, con):
    if first_interval % 2 != 0 \
            or sec_interval % 2 != 0 \
            or first_interval > sec_interval:
        print("Wrong interval boundaries!")
        return

    print("Inserting from years:", first_interval, ",", sec_interval)

    insert(first_interval,
           sec_interval,
           con,
           readers.read_candidates,
           queries.insert_candidate)
    insert(first_interval,
           sec_interval,
           con,
           readers.read_committees,
           queries.insert_committee)
    insert(first_interval,
           sec_interval,
           con,
           readers.read_comm_contribs,
           queries.insert_comm_contrib)
    insert(first_interval,
           sec_interval,
           con,
           readers.read_ind_contribs,
           queries.insert_ind_contrib)


def extract_data():
    props = cp.RawConfigParser()
    props.read('app_config.properties')

    con = None

    try:
        con = psycopg2.connect(
            database=props.get('db', 'db_name'),
            user=props.get('db', 'jdbc.username'),
            password=props.get('db', 'jdbc.password'),
            host=props.get('db', 'db_host'),
            port=props.get('db', 'db_port'))

        insert_all(1996, 1996, con)
        con.commit()

    except psycopg2.DatabaseError as e:

        if con:
            con.rollback()

        print('Error %s' % e)
        sys.exit(1)

    finally:
        if con:
            con.close()

if __name__ == "__main__":
    extract_data()
