import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ThemeProvider } from '@emotion/react';
import { theme } from './features/household/theme/theme';
import { CssBaseline } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { store } from './app/store.ts';
import './index.css';
import App from './App.tsx';
import Menu from './features/front/Menu.tsx';
import HouseholdMain from './features/household/HouseholdMain.tsx';
import AppLayout from './features/household/components/layout/AppLayout';
import Report from './features/household/pages/Report';
import NoMatch from './features/household/pages/NoMatch';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/insta_clone" element={<App />} />
          <Route path="/household" element={<HouseholdMain />} />
        </Routes>
      </BrowserRouter> */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/insta_clone" element={<App />} />
            <Route path="/household" element={<AppLayout />}>
              <Route index element={<HouseholdMain />} />
              <Route path="/household/report" element={<Report />} />
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
