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
        updateFilterSettings: (state, action) => {
            // Specifically update only filterSettings, replacing any existing filterSettings
            state.settings = {
                ...state.settings,
                filterSettings: action.payload // Replace filterSettings completely
            };
        },
    }
})

export const { updateSetting, updateFilterSettings } = settingSlice.actions;

export default settingSlice.reducer;