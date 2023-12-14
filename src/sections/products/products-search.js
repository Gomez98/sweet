import { useState } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const ProductsSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const userInput = e.target.value;

    if (/^[a-zA-Z0-9\s]*(\.[a-zA-Z0-9\s]*)?$/.test(userInput) || userInput === '') {
      setSearchTerm(userInput);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={searchTerm}
        onChange={handleChange}
        fullWidth
        placeholder="Search product"
        startAdornment={(
          <InputAdornment position="start">
            <SvgIcon color="action" fontSize="small">
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        )}
        endAdornment={(
          <InputAdornment position="end">
            <SvgIcon
              color="action"
              fontSize="small"
              onClick={handleSearch}
              style={{ cursor: 'pointer' }}
            >
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        )}
        sx={{ maxWidth: 500 }}
      />
    </Card>
  );
};
