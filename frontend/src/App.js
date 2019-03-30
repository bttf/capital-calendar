import React from 'react';
import {
  BrowserRouter,
} from 'react-router-dom'
import routes, { RouteRenderer } from './routes';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="app-container">
          {routes.map((route, i) => (
            <RouteRenderer key={i} {...route} />
          ))}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
