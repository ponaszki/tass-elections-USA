-- proper query for candidate in given year
select sum(cc.transaction_amt), cc.zip_code, gz.geom
from candidates ca
	inner join committees co on ca.cand_id=co.cand_id
	inner join ind_contribs cc on co.cmte_id=cc.cmte_id
	inner join geo_zip_codes gz on cc.zip_code=gz.zip_code --left will show all
where ca.cand_id='P60003332' and ca.cand_office='P' --and ca.CAND_ELECTION_YR='1996'
group by cc.zip_code, gz.geom;

	
select ca.cand_id, ca.cand_name, sum(cc.transaction_amt)
from candidates ca
	inner join committees co on ca.cand_id=co.cand_id
	inner join ind_contribs cc on co.cmte_id=cc.cmte_id
where ca.cand_office='P' 
group by ca.cand_id, ca.cand_name
order by ca.cand_name;
