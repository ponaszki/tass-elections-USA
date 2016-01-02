DROP TABLE IF EXISTS CANDIDATES;
DROP TABLE IF EXISTS COMMITTEES;
DROP TABLE IF EXISTS COMM_CAND_LINKAGES;
DROP TABLE IF EXISTS COMM_CONTRIBS;
DROP TABLE IF EXISTS IND_CONTRIBS;


CREATE TABLE CANDIDATES(
    CAND_ID integer primary key,
    CAND_NAME VARCHAR(200),
    CAND_ELECTION_YR NUMERIC(4),
    CAND_CITY VARCHAR(30),
    CAND_ST VARCHAR(2),
    CAND_ZIP VARCHAR(9),
    CAND_OFFICE_ST VARCHAR(2),
    CAND_OFFICE VARCHAR(1),
    CAND_OFFICE_DISTRICT VARCHAR(2),
    CAND_PTY_AFFILIATION VARCHAR(3)
);

CREATE TABLE COMMITTEES(
    CMTE_ID integer primary key,
    CMTE_NM VARCHAR(200),
    CMTE_CITY VARCHAR(30),
    CMTE_ST VARCHAR(2),
    CMTE_ZIP VARCHAR(9),
    CAND_ID integer REFERENCES CANDIDATES (CAND_ID),
    CMTE_TP VARCHAR(1),
    CMTE_PTY_AFFILIATION VARCHAR(3)
);

CREATE TABLE COMM_CAND_LINKAGES(
    LINKAGE_ID integer primary key,
    CAND_ID integer REFERENCES CANDIDATES (CAND_ID),
    CAND_ELECTION_YR NUMERIC(4),
    FEC_ELECTION_YR NUMERIC(4),
    CMTE_ID integer REFERENCES COMMITTEES (CMTE_ID),
    CMTE_TP VARCHAR(1),
    CMTE_DSGN VARCHAR(1)
);

CREATE TABLE COMM_CONTRIBS(
    SUB_ID integer primary key,
    CMTE_ID integer REFERENCES COMMITTEES (CMTE_ID),
    ENTITY_TP VARCHAR(3),
    NAME VARCHAR(200),
    CITY VARCHAR(30),
    STATE VARCHAR(2),
    ZIP_CODE VARCHAR(9),
    CAND_ID integer REFERENCES CANDIDATES (CAND_ID),
    TRANSACTION_AMT NUMERIC(14,2),
    TRANSACTION_DT DATE
);

CREATE TABLE IND_CONTRIBS(
    SUB_ID integer primary key,
    CMTE_ID integer REFERENCES COMMITTEES (CMTE_ID),
    ENTITY_TP VARCHAR(3),
    NAME VARCHAR(200),
    CITY VARCHAR(30),
    STATE VARCHAR(2),
    ZIP_CODE VARCHAR(9),
    CAND_ID integer REFERENCES CANDIDATES (CAND_ID),
    TRANSACTION_AMT NUMERIC(14,2),
    TRANSACTION_DT DATE
);

CREATE INDEX ON COMMITTEES (CMTE_ZIP);
CREATE INDEX ON COMMITTEES (CAND_ID);

CREATE INDEX ON CANDIDATES (CAND_ELECTION_YR);
CREATE INDEX ON CANDIDATES (CAND_ZIP);

CREATE INDEX ON COMM_CAND_LINKAGES (CAND_ELECTION_YR);
CREATE INDEX ON COMM_CAND_LINKAGES (CMTE_ID);

CREATE INDEX ON COMM_CONTRIBS (ZIP_CODE);
CREATE INDEX ON COMM_CONTRIBS (CAND_ID);
CREATE INDEX ON COMM_CONTRIBS (TRANSACTION_DT);
CREATE INDEX ON COMM_CONTRIBS (TRANSACTION_AMT);

CREATE INDEX ON IND_CONTRIBS (ZIP_CODE);
CREATE INDEX ON IND_CONTRIBS (CAND_ID);
CREATE INDEX ON IND_CONTRIBS (TRANSACTION_DT);
CREATE INDEX ON IND_CONTRIBS (TRANSACTION_AMT);