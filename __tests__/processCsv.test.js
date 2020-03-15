import processCsv, { toJson } from '../processCsv';
// import * as csvtojson from 'csvtojson';
import jsonArray from './fixture/jsonArray';

jest.mock('../processCsv', () => {
  const ogModule = jest.requireActual('../processCsv');

  return {
    __esModule: true,
    ...ogModule,
    toJson: jest.fn(),
  };
});

toJson.mockResolvedValue(jsonArray);

test('should return dataByYear', async () => {
  const respone = await processCsv('file');
  console.log('respone', respone);
  expect(await processCsv('file')).not.toBeNull();
});
