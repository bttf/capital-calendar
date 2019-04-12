import db from '../../db';
import plaidClient from '../plaid/client';

export default async institutionId => {
  const { institution: metadata } = await plaidClient.getInstitutionById(institutionId, {
    include_optional_metadata: true,
  });

  if (!metadata) return null;

  return await db.PlaidInstitution.create(
    {
      institutionId,
      name: metadata.name,
      primaryColor: metadata.primary_color,
      url: metadata.url,
      logo: metadata.logo,
    },
    { returning: true },
  );
};
