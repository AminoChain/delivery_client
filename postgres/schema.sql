CREATE TABLE contracts (
    contract_address TEXT,
    name TEXT,
    abi json
);

CREATE TABLE tokens (
	contract_address  Text,
    tokennumber bigint,
    deliverystatus TEXT,
    tracking_num TEXT,
	shp_vendor TEXT,
    PRIMARY KEY (contract_address,tokennumber );
	
);


create index on "contracts" ("contract_address");

create index on "tokens" ("contract_address"); 
create index on "tokens" ("tokennumber");

Alter TABLE "tokens" ADD FOREIGN KEY ("contract_address") REFERENCES "contracts" ("contract_address");