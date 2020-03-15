import csv from 'csvtojson';

class Client {
  constructor(id, name, amount) {
    this.id = id;
    this.amounts = [amount];
    this.totalRevenue = amount;
    this.name = name;
  }

  addAmount(amount) {
    this.amounts = [...this.amounts, amount];
    this.totalRevenue = this.totalRevenue + amount;
  }
}

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

const randomId = () =>
  '_' +
  Math.random()
    .toString(36)
    .substr(2, 9);

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

const processCsv = async csvFile => {
  const jsonArray = await toJson(csvFile);
  console.log('jsonArray', jsonArray);

  const dataByYear = jsonArray.reduce((acc, curr) => {
    const { date, name, amount } = curr;

    if (!date || !name || !amount) return acc;

    const year = date.getFullYear();
    const id = randomId();

    if (!acc[year]) {
      acc[year] = {
        [name]: new Client(id, name, amount),
      };

      return acc;
    }

    if (!acc[year][name]) {
      acc[year][name] = new Client(id, name, amount);

      return acc;
    }

    acc[year][name].addAmount(amount);

    return acc;
  }, {});

  jsonArray.reduce((acc, curr) => {
    const { date, name, amount } = curr;

    if (!date || !name || !amount) return acc;

    const year = date.getFullYear();
    const month = date.getMonth();
    const { id } = acc[year][name];

    if (!acc[year].months) {
      acc[year].months = {
        [month]: {
          [name]: new Client(id, name, amount),
        },
      };

      return acc;
    }

    if (!acc[year].months[month]) {
      acc[year].months[month] = {
        [name]: new Client(id, name, amount),
      };

      return acc;
    }

    if (!acc[year].months[month][name]) {
      acc[year].months[month][name] = new Client(id, name, amount);

      return acc;
    }

    acc[year].months[month][name].addAmount(amount);

    return acc;
  }, dataByYear);

  return {
    dataByYear,
  };
};

export default processCsv;
export { toJson };
