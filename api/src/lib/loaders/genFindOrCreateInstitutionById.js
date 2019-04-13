import Dataloader from 'dataloader';
import db from '../../db';
import createInstitution from '../../lib/institution/createInstitution';

export default () =>
  new Dataloader(async ids => {
    const institutions = await db.PlaidInstitution.findAll({
      where: { institutionId: ids },
    });

    return Promise.all(
      ids.map(async institutionId => {
        let institution = institutions.find(i => i.institutionId === institutionId);

        if (!institution) {
          institution = await createInstitution(institutionId);
        }

        return institution;
      }),
    );
  });
