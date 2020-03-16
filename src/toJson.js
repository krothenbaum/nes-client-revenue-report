import csv from 'csvtojson';

const processName = item => {
  return item.split(':')[0];
};

const processDate = item => {
  const [month, day, year] = item.split('/');

  const intYear = parseInt(year, 10);
  const intMonth = parseInt(month, 10) - 1;
  const intDay = parseInt(day, 10);

  return new Date(intYear, intMonth, intDay);
};

const processAmount = item => {
  if (item.includes('(')) {
    return -Math.abs(parseFloat(item.replace(/[^\d.]/g, '')));
  }
  return parseFloat(item.replace(/[^\d.]/g, ''));
};

const toJson = async csvFile => {
  return await csv({
    ignoreEmpty: true,
    colParser: {
      name: item => processName(item),
      date: item => processDate(item),
      amount: item => processAmount(item),
    },
  })
    .fromString(csvFile)
    .preFileLine((rawData, index) => {
      if (index === 0) {
        return rawData.toLowerCase();
      }

      if (!rawData.includes('� A/R')) {
        return rawData;
      }

      const countOfCommas = (rawData.match(/,/g) || []).length;

      return new Array(countOfCommas + 1).join(',');
    });
};

export default toJson;
