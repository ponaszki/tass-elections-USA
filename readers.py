
def __read_obj(year, file_type, file_name, positions):
    year_substr = year[-2:] # e.g. get '10' from '2010'
    file_path = 'data/unzipped/' + file_type + year_substr + '/' + file_name + '.txt'

    objs = []
    with open(file_path, "r") as f:
        filtered = (row.replace('\n', '') for row in f)
        for row in filtered:
            fields = row.split('|')

            params = []
            for i in positions:
                val = fields[i]
                if val.strip() == '':
                    params.insert(len(params), None)  # null value
                else:
                    params.insert(len(params), val)

            obj = (tuple(params))
            objs.insert(0, obj)

    f.close()

    return tuple(objs)

def read_candidates(year):
    return __read_obj(str(year), 'cn', 'cn', [0, 1, 3, 12, 13, 14, 4, 5, 6, 2])

def read_committees(year):
    return __read_obj(str(year), 'cm', 'cm', [0, 1, 5, 6, 7, 14, 9, 10])

def read_comm_contribs(year):
    return __read_obj(str(year), 'pas2', 'itpas2', [21, 0, 6, 7, 8, 9, 10, 16, 14, 13])

def read_ind_contribs(year):
    return __read_obj(str(year), 'indiv', 'itcont', [20, 0, 6, 7, 8, 9, 10, 14, 13])
