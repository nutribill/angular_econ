export class DatasetInfo {
  dataset: string;
  datasetLabel: string;
  dataMinYear: number;
  dataMaxYear: number;
}

//  All the data for one country from one dataset.
export class CountryData {
  country: string;
  colorCode: string;
  yearsValues: number[];
  startYear: number;
}

export type CountryDataMap = Map<string,CountryData>;  // CountryData is null if no data is available

export class Dataset {
  dataset: string;
  countryDataMap: CountryDataMap;
}

export type CountryColorMap = Map<string,string>;  // country:color
