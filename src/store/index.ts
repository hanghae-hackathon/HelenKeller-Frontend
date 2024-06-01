import { createStore } from "redux";
import rootReducer from "./reducers"; // Assuming you have a rootReducer combining all reducers

const store = createStore(rootReducer);

export default store;
