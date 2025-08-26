// Interfaces
import { SelectItem } from 'primereact/selectitem';
import { ICountryCodes } from '../../interfaces/country-code';

export default function transformCountryCodes(
  CountryCodes: ICountryCodes[]
): SelectItem[] {
  const transformedCountryCodes: SelectItem[] = CountryCodes.map(
    (country_code) => ({
      label: country_code.label,
      code: country_code.value,
    })
  );
  return transformedCountryCodes;
}
