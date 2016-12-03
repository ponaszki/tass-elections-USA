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
            try:
                print(objects[1000 * s:1000 * (s + 1)])
                con.cursor().executemany(insert_fun(), objects[1000 * s:1000 * (s + 1)])
                con.commit()
            except psycopg2.DatabaseError as e:

                if con:
                    con.rollback()

                print('Error %s' % e)
                continue


def read_in_chunks(file_object, chunk_size=1024):
    """Lazy function (generator) to read a file piece by piece.
    Default chunk size: 1k."""
    while True:
        data = file_object.readlines(chunk_size)
        if not data:
            break
        yield data


def insert2(first_interval_year, sec_interval_year, con, read_fun, insert_fun, file_type, file_name, positions):
    print(read_fun)
    for year in range(first_interval_year, sec_interval_year + 1, 2):
        # objects = read_fun(year)
        year_substr = str(year)[-2:] # e.g. get '10' from '2010'
        file_path = '../data/unzipped/' + file_type + year_substr + '/' + file_name + '.txt'

        f = open(file_path, "r", encoding="utf8")
        for piece in read_in_chunks(f):
            print(piece)
            filtered = (row.replace('\n', '') for row in piece)
            objs = []
            for row in filtered:
                fields = row.split('|')

                params = []
                print(positions)
                print(row)
                for i in positions:
                    val = fields[i]
                    if val.strip() == '':
                        params.insert(len(params), None)  # null value
                    else:
                        params.insert(len(params), val)

                obj = (tuple(params))
                objs.insert(0, obj)

            objects = tuple(objs)
            for s in range(round((len(objects) / 1000 + 1))):
                try:
                    print(objects[1000 * s:1000 * (s + 1)])
                    con.cursor().executemany(insert_fun(), objects[1000 * s:1000 * (s + 1)])
                    con.commit()
                except psycopg2.DatabaseError as e:

                    if con:
                        con.rollback()

                    print('Error %s' % e)
                    continue

        f.close()


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
    insert2(first_interval,
           sec_interval,
           con,
           readers.read_ind_contribs,
           queries.insert_ind_contrib,
           'indiv', 'itcont', [20, 0, 6, 7, 8, 9, 10, 14, 13])


def extract_data():
    props = cp.RawConfigParser()
    props.read('../config/app_config.properties')

    con = None

    try:
        con = psycopg2.connect(
            database=props.get('db', 'db_name'),
            user=props.get('db', 'jdbc.username'),
            password=props.get('db', 'jdbc.password'),
            host=props.get('db', 'db_host'),
            port=props.get('db', 'db_port'))

        insert_all(2002, 2004, con)
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
