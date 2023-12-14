import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { Box, Container, Stack, Typography, CircularProgress } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ProductsTable } from 'src/sections/products/products-table';
import { ProductsSearch } from 'src/sections/products/products-search';
import API_BASE_URL from '../utils/apiConfigs';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

const Page = () => {
  const [originalProducts, setOriginalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalElements, setTotalElements] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const isTermValid = (term) => {
    const regex = /^[a-zA-Z0-9\s]*(\.[a-zA-Z0-9\s]*)?$/;
    return regex.test(term);
  };

  const handleSearch = useCallback((term) => {
    if (isTermValid(term)) {
      setSearchTerm(term);
      setPage(0);
    } else {
      openSnackbar(
        'Invalid term. Please use only letters, numbers, and spaces within words.'
      );
    }
  }, []);

  const openSnackbar = (errorMessage) => {
    setErrorMessage(errorMessage);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setErrorMessage('');
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${API_BASE_URL}/api/product/all`,
          {
            params: { page, size: rowsPerPage, term: searchTerm },
          }
        );

        setOriginalProducts(response.data.data.content);
        setTotalElements(response.data.data.totalElements);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'An error happened.';
        openSnackbar(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, rowsPerPage, searchTerm]);

  return (
    <>
      <Head>
        <title>Products | Devias Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          position: 'relative',
        }}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">Products</Typography>
              </Stack>
            </Stack>
            <ProductsSearch onSearch={handleSearch} />
            <ProductsTable
              count={totalElements}
              items={originalProducts}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
      >
        <SnackbarContent message={errorMessage} />
      </Snackbar>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
