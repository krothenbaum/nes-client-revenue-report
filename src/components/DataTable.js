import { Table, Tabs } from 'antd';
import { monthsArr } from '../constants';
import DownloadButton from './DownloadButton';

const { TabPane } = Tabs;

const DataTable = ({ reportData }) => {
  const { dataByYear } = reportData;

  const years = Object.keys(dataByYear).map(year => year);

  const yearsArr = Object.keys(dataByYear).map(year => {
    const { months } = dataByYear[year];

    return Object.keys(dataByYear[year])
      .map(name => {
        if (name !== 'months') {
          const client = {
            ...dataByYear[year][name],
            key: dataByYear[year][name].id,
            totalRevenueString: dataByYear[year][
              name
            ].totalRevenue.toLocaleString(undefined, {
              style: 'currency',
              currency: 'USD',
            }),
          };

          Object.keys(months).forEach(month => {
            if (months[month][name] && months[month][name].totalRevenue) {
              client[month] = months[month][name].totalRevenue.toLocaleString(
                undefined,
                {
                  style: 'currency',
                  currency: 'USD',
                },
              );
            } else {
              client[month] = null;
            }
          });

          return client;
        }
      })
      .filter(item => item);
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Client',
      dataIndex: 'name',
      key: 'client',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    ...monthsArr.map((month, index) => {
      return {
        title: month,
        dataIndex: index,
        key: month,
      };
    }),
    {
      title: 'Revenue',
      dataIndex: 'totalRevenueString',
      key: 'totalRevenue',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
      align: 'right',
    },
  ];

  return (
    <Tabs
      tabBarExtraContent={<DownloadButton data={yearsArr} years={years} />}
      style={{
        background: 'white',
        padding: '8px 32px',
        margin: '32px 0',
        borderRadius: '8px',
        maxWidth: '100vw',
      }}
    >
      {years.map((year, index) => {
        return (
          <TabPane tab={year} key={index} styled={{ backgroundColor: 'white' }}>
            <Table
              dataSource={yearsArr[index]}
              columns={columns}
              pagination={{ pageSize: 20 }}
              size={'small'}
            />
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default DataTable;
