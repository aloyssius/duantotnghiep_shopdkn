import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { LoadingProvider } from './contexts/LoadingContext';
import { NofiticationProvider } from './contexts/NotificationContext';
import { CollapseProvider } from './contexts/CollapseContext';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <HelmetProvider>
    <LoadingProvider>
      <NofiticationProvider>
        <CollapseProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CollapseProvider>
      </NofiticationProvider>
    </LoadingProvider>
  </HelmetProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
