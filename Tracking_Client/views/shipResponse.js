// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
class ShipmentResponse {
    label_id 
    status
    shipment_id
    ship_date
    created_at
    shipmet_cost = new Shipmet_Cost();
    insurance_cost = new Insurance_Cost()
    charge_event
    tracking_number
    is_return_label
    rma_number
    is_international
    batch_id
    carrier_id
    service_code
    package_code
    voided
    voided_at
    label_format
    label_layout
    trackable
    label_image_id
    carrier_code
    tracking_status
    label_download = new Label_Download();
    form_download
    insurance_claim
    packages = []

    
}
// Unparsed address.
class Shipmet_Cost {
    currency
    amount
}
class Insurance_Cost {
    currency
    amount
}

class Label_Download {
    pdf
    png
    zpl
    href
}

class Package {
    dimensions = new Dimensions()
    weight = new Weight()
    insured_value = new Insured_Value()
    tracking_number
    label_messages = new Label_Messages()
    external_package_id
}

class Label_Messages {
    reference1
    reference2
    reference3
}
class Insured_Value {
    currenct
    amount
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









module.exports = ShipmentResponse
