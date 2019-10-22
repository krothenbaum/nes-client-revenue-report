import processCsv from '../../processCsv';

export default async (req, res) => {
  const obj = await processCsv(req.body);

  return res.status(200).json(obj);
};
