import { Typography, Icon } from 'antd';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import DataTable from '../src/components/DataTable';
import Head from 'next/head';

const { Title } = Typography;

const Index = () => {
  const [reportData, setReportData] = useState({});
  const [isLoaded, setLoaded] = useState(false);
  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = async () => {
      const csv = reader.result;

      const response = await fetch('/api/csv', {
        method: 'POST',
        body: csv,
      });

      const data = await response.json();
      setReportData({ ...data });
      setLoaded(true);
    };

    acceptedFiles.forEach(file => reader.readAsText(file));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <>
      <Head>
        <style jsx global>{`
          body {
            background: #f2f7ff;
          }
        `}</style>
      </Head>
      <div style={{ margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {!isLoaded && (
            <>
              <Title
                style={{
                  paddingTop: '32px',
                  paddingBottom: '8px',
                  color: 'hsl(226, 44%, 22%)',
                }}
              >
                Client Revenue by Year
              </Title>
              <div
                {...getRootProps()}
                style={{
                  backgroundColor: '#D6E5FD',
                  padding: '64px',
                  // border: '4px dotted #002180',
                  borderRadius: '8px',
                  boxShadow: '0 2px 0 hsla(225, 41%, 18%, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
              >
                <Icon
                  type="cloud-upload"
                  style={{
                    fontSize: '64px',
                    align: 'center',
                    color: '#84AEF6',
                    paddingBottom: '8px',
                  }}
                />
                <input {...getInputProps()} />
                <p style={{ color: 'hsl(226, 44%, 22%)' }}>
                  Drag 'n' drop CSV file here or click to select files.
                </p>
              </div>
            </>
          )}
          {isLoaded && <DataTable reportData={reportData} />}
        </div>
      </div>
    </>
  );
};

export default Index;
