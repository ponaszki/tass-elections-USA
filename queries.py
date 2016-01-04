
def insert_candidate():
    return "INSERT INTO CANDIDATES (" \
                    "CAND_ID, " \
                    "CAND_NAME, " \
                    "CAND_ELECTION_YR, " \
                    "CAND_CITY, " \
                    "CAND_ST, " \
                    "CAND_ZIP, " \
                    "CAND_OFFICE_ST, " \
                    "CAND_OFFICE, " \
                    "CAND_OFFICE_DISTRICT, " \
                    "CAND_PTY_AFFILIATION" \
                    ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

def insert_committee():
    return "INSERT INTO COMMITTEES (" \
                    "CMTE_ID, " \
                    "CMTE_NM, " \
                    "CMTE_CITY, " \
                    "CMTE_ST, " \
                    "CMTE_ZIP, " \
                    "CAND_ID, " \
                    "CMTE_TP, " \
                    "CMTE_PTY_AFFILIATION" \
                    ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"

def insert_comm_contrib():
    return "INSERT INTO COMM_CONTRIBS (" \
                    "SUB_ID, " \
                    "CMTE_ID, " \
                    "ENTITY_TP, " \
                    "NAME, " \
                    "CITY, " \
                    "STATE, " \
                    "ZIP_CODE, " \
                    "CAND_ID, " \
                    "TRANSACTION_AMT, " \
                    "TRANSACTION_DT" \
                    ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, to_date(%s, 'DDMMYYYY'))"

def insert_ind_contrib():
    return "INSERT INTO IND_CONTRIBS (" \
                    "SUB_ID, " \
                    "CMTE_ID, " \
                    "ENTITY_TP, " \
                    "NAME, " \
                    "CITY, " \
                    "STATE, " \
                    "ZIP_CODE, " \
                    "TRANSACTION_AMT, " \
                    "TRANSACTION_DT" \
                    ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, to_date(%s, 'DDMMYYYY'))"
