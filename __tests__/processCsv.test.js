import processCsv from '../processCsv';
import toJson from '../src/toJson';
import clients from './fixture/clients';
import jsonArray from './fixture/jsonArray';
import years from './fixture/years';

jest.mock('../src/toJson');

// csv.mockResolvedValue(jsonArray);
toJson.mockImplementation(() => Promise.resolve(jsonArray));

describe('processCsv', () => {
  let dataByYear;

  beforeEach(async () => {
    const response = await processCsv();

    dataByYear = response.dataByYear || null;
  });

  it('should return dataByYear', () => {
    expect(dataByYear).not.toBeNull();
  });

  it('dataByYear should the correct years', () => {
    years.forEach(year => {
      expect(dataByYear[year]).not.toBeNull;
    });
  });

  it('should have the correct clients for each year', () => {
    years.forEach(year => {
      clients.forEach(client => {
        expect(dataByYear[year][client]).not.toBeNull;
      });
    });
  });

  it('should have a month obj with correct number of keys', () => {
    years.forEach(year => {
      expect(Object.keys(dataByYear[year].months).length).toBe(12);
    });
  });

  it('should get the correct Arcadis totals', () => {
    expect(
      +dataByYear['2017']['Arcadis US, Inc.'].totalRevenue.toFixed(2),
    ).toBe(695081.75);
    expect(
      +dataByYear['2018']['Arcadis US, Inc.'].totalRevenue.toFixed(2),
    ).toBe(257451.75);
    expect(
      +dataByYear['2019']['Arcadis US, Inc.'].totalRevenue.toFixed(2),
    ).toBe(5514618.14);
  });

  it('should get the correct Arcadis month totals', () => {
    const expected2017Totals = [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      145064.75,
      550017.0,
    ];
    const expected2018Totals = [
      27187.25,
      2620.75,
      3305.5,
      1811.5,
      null,
      null,
      null,
      50439.5,
      149009.5,
      9972.5,
      4754.75,
      8350.5,
    ];
    const expected2019Totals = [
      164898.01,
      946010.79,
      920839.67,
      1130229.12,
      1250099.68,
      1086217.46,
      164288.91,
      42339.25,
      7521.25,
      2174.0,
      -200000.0,
      null,
    ];

    Object.keys(dataByYear['2017'].months).forEach(month => {
      if (dataByYear['2017'].months[month]['Arcadis US, Inc.']) {
        expect(
          +dataByYear['2017'].months[month][
            'Arcadis US, Inc.'
          ].totalRevenue.toFixed(2),
        ).toBe(expected2017Totals[month]);
      }
    });

    Object.keys(dataByYear['2018'].months).forEach(month => {
      if (dataByYear['2018'].months[month]['Arcadis US, Inc.']) {
        expect(
          +dataByYear['2018'].months[month][
            'Arcadis US, Inc.'
          ].totalRevenue.toFixed(2),
        ).toBe(expected2018Totals[month]);
      }
    });
    Object.keys(dataByYear['2019'].months).forEach(month => {
      if (dataByYear['2019'].months[month]['Arcadis US, Inc.']) {
        expect(
          +dataByYear['2019'].months[month][
            'Arcadis US, Inc.'
          ].totalRevenue.toFixed(2),
        ).toBe(expected2019Totals[month]);
      }
    });
  });

  it('should get the correct PG&E totals', () => {
    expect(
      +dataByYear['2017']['PG&E-San Francisco'].totalRevenue.toFixed(2),
    ).toBe(1657530.83);
  });
});
