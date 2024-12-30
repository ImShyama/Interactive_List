import { configureStore} from "@reduxjs/toolkit";
import settingReducer from "./settingSlice";

const appStore = configureStore({
    reducer:{
        setting: settingReducer,
    }
});

export default appStore;