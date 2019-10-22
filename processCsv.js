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

const findId = (name, obj) =>
  obj[Object.keys(obj).find(key => key === name)].id || randomId;

const randomId = () =>
  '_' +
  Math.random()
    .toString(36)
    .substr(2, 9);

const processCsv = async csvFile => {
  const jsonArray = await csv({
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

  const dataByClient = jsonArray.reduce((acc, curr) => {
    const { date, name, amount } = curr;

    if (!date || !name || !amount) return acc;

    const year = date.getFullYear();

    const id = randomId();

    if (!acc[name]) {
      acc[name] = {
        id,
        name,
        [year]: { amounts: [amount], totalRevenue: amount },
      };
      return acc;
    }

    if (!acc[name][year]) {
      acc[name][year] = { amounts: [amount], totalRevenue: amount };
      return acc;
    }

    acc[name][year].totalRevenue = acc[name][year].totalRevenue + amount;
    acc[name][year].amounts.push(amount);

    return acc;
  });

  const dataByYear = jsonArray.reduce((acc, curr) => {
    const { date, name, amount } = curr;

    if (!date || !name || !amount) return acc;

    const year = date.getFullYear();
    const id = findId(name, dataByClient);

    if (!acc[year]) {
      acc[year] = {
        [name]: {
          id,
          totalRevenue: amount,
          amounts: [amount],
          name,
        },
      };
      return acc;
    }

    if (!acc[year][name]) {
      acc[year][name] = {
        id,
        totalRevenue: amount,
        amounts: [amount],
        name,
      };
      return acc;
    }

    acc[year][name].totalRevenue = acc[year][name].totalRevenue + amount;
    acc[year][name].amounts.push(amount);
    return acc;
  }, {});

  return {
    dataByClient,
    dataByYear,
  };
};

export default processCsv;
