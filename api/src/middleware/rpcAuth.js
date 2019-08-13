import bcrypt from 'bcrypt';

const { RPC_SECRET } = process.env;

export default async (req, res, next) => {
  const {
    body: { params },
  } = req;

  if (!params || !params.length) return res.status(401).send('Go away');

  const [authToken] = params;

  if (!authToken) return res.status(401).send('Go away');

  let tokenChecksOut;

  try {
    tokenChecksOut = await bcrypt.compare(RPC_SECRET, authToken);
  } catch (e) {
    return res.status(500).send('Error');
  }

  if (!tokenChecksOut) return res.status(401).send('Go away');

  // Mutate request object
  req.body.params = params.slice(1);

  next();
};
