export type CountryColorMap = Map<string,string>;  // country:color

export const COLOR_PALLETTE =
  ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#F0E20D', '#a65628', '#f781bf', '#999999'];

export let generateColorMap = function(countries: string[]): CountryColorMap {
  let sortedCountries = countries.slice(0);
  sortedCountries.sort();
  let map = new Map();
  let i = 0;
  for (let country of sortedCountries) {
    map.set(country, COLOR_PALLETTE[i++]);
  }
  return map;
};
