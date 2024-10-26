'use client';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#f8f8f8',
      },
    },
  },
});

export function Providers({ children }) {
  return (
    <ChakraProvider theme={theme}>{children}</ChakraProvider>
  );
}
