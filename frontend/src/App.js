import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import routes, { RouteRenderer } from './routes';
import CapitalCalendarBanner from './components/CapitalCalendarBanner';

const AppContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100vh;
  max-width: 900px;

  margin: 0 auto;
`;

const ContentContainer = styled('div')`
  margin-top: 32px;
  width: 100%;
`;

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <AppContainer>
          <CapitalCalendarBanner />
          <ContentContainer>
            {routes.map((route, i) => (
              <RouteRenderer key={i} {...route} />
            ))}
          </ContentContainer>
        </AppContainer>
      </BrowserRouter>
    );
  }
}

export default App;
