import {DataParams} from './data-params';
import {DatasetInfo} from './datatypes';


describe('Test DataParams areComplete()', () => {
  let dp: DataParams;

  beforeEach(() => {
    dp = new DataParams();
    dp.dataset = 'test_ds';
    dp.startYear = 1980;
    dp.endYear = 1985;
    dp.countries = ['Canada', 'United States'];
  });

  it('Default values are complete', () => {
    let ac = dp.areComplete();
    expect(dp.areComplete()).toBeTruthy();
  });

  it('Has no countries => incomplete', () => {
    dp.countries = [];
    expect(dp.areComplete()).toBeFalsy();
  });

  it('Missing start year => incomplete', () => {
    dp.startYear = null;
    expect(dp.areComplete()).toBeFalsy();
  });

  it('Missing dataset => incomplete', () => {
    dp.dataset = null;
    expect(dp.areComplete()).toBeFalsy();
  });

});

describe('Test DataParams areValid()', () => {
  let dp: DataParams;
  let datasets:Map<string,DatasetInfo>;
  let validCountries:Set<string>;

  beforeEach(() => {
    dp = new DataParams();
    dp.dataset = 'test_ds';
    dp.startYear = 1980;
    dp.endYear = 1985;
    dp.countries = ['Canada', 'United States'];
    datasets = new Map();
    datasets.set('test_ds',
      {dataset: 'test_ds', datasetLabel: 'Test Dataset',
       dataMinYear: 1975, dataMaxYear: 1990
      });
    validCountries = new Set();
  });

  it('Default values are valid', () => {
    datasets.set('test_ds',
      {dataset: 'test_ds', datasetLabel: 'Test Dataset',
        dataMinYear: 1975, dataMaxYear: 1990
      });
    validCountries.add('Canada');
    validCountries.add('Mexico');
    validCountries.add('United States');

    expect(dp.areValid(datasets, validCountries)).toBeTruthy();
  });

  it('Empty values are valid', () => {
    dp.countries = [];
    dp.dataset = null;
    expect(dp.areValid(datasets, validCountries)).toBeTruthy();
  });

  it('Invalid country', () => {
    validCountries.add('Kenya');
    validCountries.add('Japan');
    expect(dp.areValid(datasets, validCountries)).toBeFalsy();
  });

  it('Invalid dataset', () => {
    datasets.set('xx_ds',
      {dataset: 'xx_ds', datasetLabel: 'Test Dataset',
        dataMinYear: 1975, dataMaxYear: 1990
      });
    expect(dp.areValid(datasets, validCountries)).toBeFalsy();
  });

  it('Missing dataset => incomplete', () => {
    dp.dataset = null;
    expect(dp.areValid(datasets, validCountries)).toBeFalsy();
  });

});


describe("Test DataParams from url", () => {
  let url = 'test?dataset=test_ts&countries=Canada,Mexico&startYear=1980&endYear=1985';
  it('', () => {
    let dp = DataParams.fromUrl(url);
    expect(dp.dataset).toEqual('test_ts');
    expect(dp.countries).toEqual(['Canada', 'Mexico']);
    expect(dp.startYear).toEqual(1980);
    expect(dp.endYear).toEqual(1985);
  })

});
