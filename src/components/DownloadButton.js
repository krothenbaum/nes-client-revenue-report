import { Button } from 'antd';
import XLSX from 'xlsx';
import { monthsArr } from '../constants';

const DownloadButton = ({ data, years }) => {
  const handleClick = () => {
    const wb = XLSX.utils.book_new();
    data.forEach((items, index) => {
      const wsData = items
        .map(item => {
          const client = {
            ID: item.id,
            Client: item.name,
          };

          monthsArr.forEach((month, index) => {
            client[month] = item[index];
          });

          client.Revenue = item.totalRevenue;

          return client;
        })
        .sort((a, b) => b.Revenue - a.Revenue);
      const ws = XLSX.utils.json_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, years[index]);
    });

    XLSX.writeFile(wb, 'client_revenue_by_year.xlsx');
  };

  return (
    <Button onClick={handleClick} styled={{ marginBottom: '8px' }}>
      Download XLSX
    </Button>
  );
};

export default DownloadButton;
