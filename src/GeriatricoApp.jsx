import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { AppRouter } from "./router/AppRouter";
import { store, persistor } from "./store/store";
import './index.css';

export const GeriatricoApp = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AppRouter />
            </PersistGate>
        </Provider>
    )
}
