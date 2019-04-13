import genInstitutionById from './genInstitutionById';
import genFindOrCreateInstitutionById from './genFindOrCreateInstitutionById';

export const genLoaders = () => ({
  institutionById: genInstitutionById(),
  findOrCreateInstitutionById: genFindOrCreateInstitutionById(),
});
