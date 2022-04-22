import {
  ChakraProvider, theme
} from '@chakra-ui/react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signin from './pages/Signin';
import Graph from './pages/Graph';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/graph" element={<Graph />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
