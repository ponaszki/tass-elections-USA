-- proper query for candidate in given year
select sum(cc.transaction_amt), cc.zip_code, gz.geom
from candidates ca
	inner join committees co on ca.cand_id=co.cand_id
	inner join ind_contribs cc on co.cmte_id=cc.cmte_id
	inner join geo_zip_codes gz on cc.zip_code=gz.zip_code --left will show all
where ca.cand_id='P60003332' and ca.cand_office='P' --and ca.CAND_ELECTION_YR='1996'
group by cc.zip_code, gz.geom;

select * from committees ;

SELECT sum(cc.transaction_amt), sum(ic.transaction_amt), gz.zip_code, gz.geom
FROM candidates ca
	inner join committees co on ca.cand_id=co.cand_id
	left join comm_contribs cc on co.cmte_id=cc.cmte_id
	full outer join ind_contribs ic on co.cmte_id=ic.cmte_id
	inner join geo_zip_codes gz on 
	(cc.zip_code=gz.zip_code and ic.zip_code=gz.zip_code)
WHERE ca.cand_office='P' 
GROUP BY gz.zip_code, gz.geom;

select * from candidates where cand_id='P20003232';

SELECT sum(cc.transaction_amt) as ccsum, gz.zip_code as zip_code, gz.geom, ca.cand_id
	FROM candidates ca
		inner join committees co on ca.cand_id=co.cand_id
		inner join comm_contribs cc on co.cmte_id=cc.cmte_id
		inner join geo_zip_codes gz on cc.zip_code=gz.zip_code 
	WHERE ca.cand_office='P'
GROUP BY gz.zip_code, gz.geom, ca.cand_id;

select * from candidates where cand_id='P80000581';
--"GEPHARDT, RICHARD A"
select * from comm_contribs where cand_id='P80000581';
select * from geo_zip_codes where zip_code='20005';

select coalesce(sum(ccc.ccsum + icc.icsum), sum(ccc.ccsum), sum(icc.icsum)), 
	coalesce(ccc.zip_code, icc.zip_code), 
	coalesce(ccc.geom, icc.geom)
from
	(SELECT sum(cc.transaction_amt) as ccsum, gz.zip_code as zip_code, gz.geom
	FROM candidates ca
		inner join committees co on ca.cand_id=co.cand_id
		inner join comm_contribs cc on co.cmte_id=cc.cmte_id
		inner join geo_zip_codes gz on cc.zip_code=gz.zip_code 
	WHERE ca.cand_office='P' and ca.cand_id='P80000235' 
	GROUP BY gz.zip_code, gz.geom) as ccc
FULL OUTER JOIN
	(SELECT sum(cc.transaction_amt) as icsum, gz.zip_code as zip_code, gz.geom
	FROM candidates ca
		inner join committees co on ca.cand_id=co.cand_id
		inner join ind_contribs cc on co.cmte_id=cc.cmte_id
		inner join geo_zip_codes gz on cc.zip_code=gz.zip_code 
	WHERE ca.cand_office='P' and ca.cand_id='P40002214' 
	GROUP BY gz.zip_code, gz.geom) as icc
ON ccc.zip_code=icc.zip_code
GROUP BY coalesce(ccc.zip_code, icc.zip_code), coalesce(ccc.geom, icc.geom)
;


select ca.cand_id, ca.cand_name, sum(cc.transaction_amt)
from candidates ca
	inner join committees co on ca.cand_id=co.cand_id
	inner join ind_contribs cc on co.cmte_id=cc.cmte_id
where ca.cand_office='P' 
group by ca.cand_id, ca.cand_name
order by ca.cand_name;

select ca.cand_id, ca.cand_name, sum(cc.transaction_amt) suma
from candidates ca
	inner join committees co on ca.cand_id=co.cand_id
	inner join comm_contribs cc on co.cmte_id=cc.cmte_id
where ca.cand_office='P' 
group by ca.cand_id, ca.cand_name
order by suma desc;


select count(*) from candidates;
select count(*) from committees;
select count(*) from ind_contribs;
select count(*) from comm_contribs;