/**
 * Created by bmartin on 10/16/17.
 */

import {YearAbbrev} from './year-abbrev';

describe('test YearAbbrev pipe', () => {
  let pipe: YearAbbrev;

  beforeEach(() => {
    pipe = new YearAbbrev();
  });

  it('transforms "1981" to "1"', () => {
    let value: any = "1981";

    expect(pipe.transform(value, [])).toEqual('1')
  });

  it('transforms "1985" to "85"', () => {
    let value: any = "1985";

    expect(pipe.transform(value, [])).toEqual("'85")
  });

});
