// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
class Shipment {
    service_code = "ups_ground"
    ship_to
    ship_from
    packages = []
    constructor() {
        this.ship_to = new Address();
        this.ship_from = new Address();
    }
    addPackage(weight, dimensions) {
        this.packages.push(new Package(weight, dimensions))
    }
}
// Unparsed address.
class Address {
    name
    AddressLine1
    city_locality
    state_province
    postal_code
    address_residential_indicator
    //used in ship from
    country_code
    company_name
    phone
}

class Package {
    dimensions
    weight

    constructor(weight, dimensions) {
        this.dimensions = dimensions
        this.weight = weight
    }
}

class Weight {
    unit
    value
}

class Dimensions {
    height
    width
    length
    unit
}

class ShipReqRoot {
    shipment = new Shipment()
}






module.exports = ShipReqRoot; 
module.exports = Shipment
module.exports = Weight
module.exports = Dimensions
module.exports = Address
module.exports = Package
