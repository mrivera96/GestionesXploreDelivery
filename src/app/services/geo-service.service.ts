import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeoServiceService {

  constructor() { }
  findCountryCodeByTwoLetterAbbreviation(tl) {

    const countries =
      [
        {'name': 'Australia', 'twoLetterCode': 'AU', 'threeLetterCode': 'AUS', 'countryCode': '61'},
        {'name': 'Austria', 'twoLetterCode': 'AT', 'threeLetterCode': 'AUT', 'countryCode': '43'},
        {'name': 'Brazil', 'twoLetterCode': 'BR', 'threeLetterCode': 'BRA', 'countryCode': '55'},
        {'name': 'Chile', 'twoLetterCode': 'CL', 'threeLetterCode': 'CHL', 'countryCode': '56'},
        {'name': 'China', 'twoLetterCode': 'CN', 'threeLetterCode': 'CHN', 'countryCode': '86'},
        {'name': 'Colombia', 'twoLetterCode': 'CO', 'threeLetterCode': 'COL', 'countryCode': '57'},
        {'name': 'Comoros', 'twoLetterCode': 'KM', 'threeLetterCode': 'COM', 'countryCode': '269'},
        {'name': 'Croatia', 'twoLetterCode': 'HR', 'threeLetterCode': 'HRV', 'countryCode': '385'},
        {'name': 'Cuba', 'twoLetterCode': 'CU', 'threeLetterCode': 'CUB', 'countryCode': '53'},
        {'name': 'Curacao', 'twoLetterCode': 'CW', 'threeLetterCode': 'CUW', 'countryCode': '599'},
        {'name': 'Dominican Republic', 'twoLetterCode': 'DO', 'threeLetterCode': 'DOM', 'countryCode': '1-809, 1-829, 1-849'},
        {'name': 'France', 'twoLetterCode': 'FR', 'threeLetterCode': 'FRA', 'countryCode': '33'},
        {'name': 'Guatemala', 'twoLetterCode': 'GT', 'threeLetterCode': 'GTM', 'countryCode': '502'},
        {'name': 'Honduras', 'twoLetterCode': 'HN', 'threeLetterCode': 'HND', 'countryCode': '504'},
        {'name': 'Hong Kong', 'twoLetterCode': 'HK', 'threeLetterCode': 'HKG', 'countryCode': '852'},
        {'name': 'Israel', 'twoLetterCode': 'IL', 'threeLetterCode': 'ISR', 'countryCode': '972'},
        {'name': 'Italy', 'twoLetterCode': 'IT', 'threeLetterCode': 'ITA', 'countryCode': '39'},
        {'name': 'Japan', 'twoLetterCode': 'JP', 'threeLetterCode': 'JPN', 'countryCode': '81'},
        {'name': 'Mexico', 'twoLetterCode': 'MX', 'threeLetterCode': 'MEX', 'countryCode': '52'},
        {'name': 'Panama', 'twoLetterCode': 'PA', 'threeLetterCode': 'PAN', 'countryCode': '507'},
        {'name': 'Paraguay', 'twoLetterCode': 'PY', 'threeLetterCode': 'PRY', 'countryCode': '595'},
        {'name': 'Peru', 'twoLetterCode': 'PE', 'threeLetterCode': 'PER', 'countryCode': '51'},
        {'name': 'Puerto Rico', 'twoLetterCode': 'PR', 'threeLetterCode': 'PRI', 'countryCode': '1-787, 1-939'},
        {'name': 'Taiwan', 'twoLetterCode': 'TW', 'threeLetterCode': 'TWN', 'countryCode': '886'},
        {'name': 'United States', 'twoLetterCode': 'US', 'threeLetterCode': 'USA', 'countryCode': '1'},
        {'name': 'Uruguay', 'twoLetterCode': 'UY', 'threeLetterCode': 'URY', 'countryCode': '598'},
        {'name': 'Canada', 'twoLetterCode': 'CA', 'threeLetterCode': 'CAN', 'countryCode': '1'},
        {'name': 'Spain', 'twoLetterCode': 'ES', 'threeLetterCode': 'ESP', 'countryCode': '34'},
        {'name': 'Costa Rica', 'twoLetterCode': 'CR', 'threeLetterCode': 'CRI', 'countryCode': '506'},
        {"name":"El Salvador","twoLetterCode":"SV","threeLetterCode":"SLV","countryCode":"503"},
      ];

    return countries.find(x => x.twoLetterCode == tl.toUpperCase()).countryCode;
  }
}
