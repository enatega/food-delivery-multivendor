export const createTaxation = `mutation CreateTaxation($taxationInput:TaxationInput!){
createTaxation(taxationInput:$taxationInput){
      _id
    taxationCharges
    enabled
    }
  }`;
export const editTaxation = `mutation editTaxation($taxationInput:TaxationInput!){
    editTaxation(taxationInput:$taxationInput){
            _id
            taxationCharges
            enabled
              }
            }`;
