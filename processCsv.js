import toJson from './src/toJson';

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
const randomId = () =>
  '_' +
  Math.random()
    .toString(36)
    .substr(2, 9);

const processCsv = async csvFile => {
  const jsonArray = await toJson(csvFile);

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
