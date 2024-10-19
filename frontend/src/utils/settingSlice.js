import { createSlice } from "@reduxjs/toolkit";

const settingSlice = createSlice({
    name: 'setting',
    initialState: {
        settings: {
            
        }
    },
    reducers: {
        updateSetting: (state, action) => {
            state.settings = {
                ...state.settings,
                ...action.payload // Merging new settings with the existing ones
            };
        },
    }
})

export const { updateSetting } = settingSlice.actions;

export default settingSlice.reducer;