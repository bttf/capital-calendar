import bcrypt from 'bcrypt';

const { RPC_SECRET } = process.env;

export default async (req, res, next) => {
  console.log('DEBUG rpcAuth\n');

  const {
    body: { params },
  } = req;

  if (!params || !params.length) return res.status(401).send('Go away');

  const [authToken] = params;

  console.log('DEBUG params', params);

  if (!authToken) return res.status(401).send('Go away');

  let tokenChecksOut;

  try {
    tokenChecksOut = await bcrypt.compare(RPC_SECRET, authToken);
  } catch (e) {
    return res.status(500).send('Error');
  }

  console.log('DEBUG tokenChecksOut', tokenChecksOut);

  if (!tokenChecksOut) return res.status(401).send('Go away');

  // Mutate request object
  req.body.params = params.slice(1);

  console.log('DEBUG req.params', req.params);

  next();
};
