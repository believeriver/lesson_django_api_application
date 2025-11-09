import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { store } from './app/store.ts';
import './index.css';
import App from './App.tsx';
import Menu from './features/front/Menu.tsx';
import HouseholdMain from './features/household/HouseholdMain.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/insta_clone" element={<App />} />
          <Route path="/household" element={<HouseholdMain />} />
        </Routes>
      </BrowserRouter>
      {/* <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/household/home" element={<AppLayout />}>
                <Route
                  index
                  element={
                    <Home
                      monthlyTransactions={monthlyTransactions}
                      setCurrentMonth={setCurrentMonth}
                    />
                  }
                />
                <Route path="/household/report" element={<Report />} />
                <Route path="*" element={<NoMatch />} />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider> */}
    </Provider>
  </StrictMode>
);
