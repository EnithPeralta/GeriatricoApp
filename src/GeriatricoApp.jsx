import { Provider } from "react-redux";
import { AppRouter } from "./router/AppRouter";
import { store } from "./store/store";
import './index.css';

export const GeriatricoApp = () => {
    return (
        <Provider store={store}>
            <AppRouter />
        </Provider>
    )
}
