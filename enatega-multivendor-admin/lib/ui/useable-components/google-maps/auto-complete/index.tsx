import {
  faLocationCrosshairs,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete';
import { useEffect, useState } from 'react';

interface Country {
  name: string;
  code: string;
}

const CountryService: Country[] = [
  { name: 'United States', code: 'USA' },
  { name: 'United Kingdom', code: 'UK' },
  { name: 'Canada', code: 'CA' },
  { name: 'Australia', code: 'AU' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Japan', code: 'JP' },
  { name: 'Italy', code: 'IT' },
  { name: 'Spain', code: 'ES' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Norway', code: 'NO' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Finland', code: 'FI' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Austria', code: 'AT' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Portugal', code: 'PT' },
];

export default function TemplateDemo() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);

  const search = (event: AutoCompleteCompleteEvent) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filteredCountries;

      if (!event.query.trim().length) {
        _filteredCountries = [...countries];
      } else {
        _filteredCountries = countries.filter((country) => {
          return country.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredCountries(_filteredCountries);
    }, 250);
  };

  //   const itemTemplate = (item: Country) => {
  //     return (
  //       <div className="flex align-items-center">
  //         <div>{item.name}</div>
  //       </div>
  //     );
  //   };

  /*   const panelFooterTemplate = () => {
    const isCountrySelected = (filteredCountries || []).some(
      (country: Country) => country.name === selectedCountry?.name
    );
    return (
      <div className="py-2 px-3">
        {isCountrySelected ? (
          <span>
            <b>{selectedCountry?.name}</b> selected.
          </span>
        ) : (
          'No country selected.'
        )}
      </div>
    );
  }; */

  useEffect(() => {
    setCountries(CountryService);
  }, []);

  return (
    <div className={`flex w-full flex-col justify-center gap-y-1 p-2`}>
      <div className="relative">
        <AutoComplete
          className={`h-11 w-full border border-gray-300 px-2 pr-16 text-sm focus:shadow-none focus:outline-none`}
          field="name"
          value={selectedCountry}
          suggestions={filteredCountries}
          completeMethod={search}
          onChange={(e: AutoCompleteChangeEvent) => setSelectedCountry(e.value)}
          placeholder="Select Location"
        />

        {selectedCountry && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
            onClick={() => setSelectedCountry(null)}
          >
            <i className="fas fa-times"></i>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        )}
        <button
          className="absolute right-8 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
          onClick={() => {
            /* Add location functionality here */
          }}
        >
          <FontAwesomeIcon
            icon={faLocationCrosshairs}
            className="text-primary-color"
            size="lg"
          />
        </button>
      </div>
    </div>
  );
}
