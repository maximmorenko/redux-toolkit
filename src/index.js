import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'
import ReactDOM from "react-dom";

import { persistor, store } from "./store";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    {/* оборачиваем приложение в персист гейт */}
    <PersistGate loading={null} persistor={persistor}> 
      <App />
    </PersistGate>
  </Provider>,
  rootElement
);
