import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import authService from './authService';

// get user from localstorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null, // if user exists in local storage, assign to initial state
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// register user, user will be passed in from the register component
// dispatched from register function
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try{
        return await authService.register(user); // payload returned from register.fulfilled case 
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message) // will send the error message as payload
    }
})

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try{
        return await authService.login(user); // payload returned from register.fulfilled case 
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message) // will send the error message as payload
    }
})

// logout
export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout()
})


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => { // in order to reset values when done with login/register
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
            state.message = ''
        }
    },
    // below will account for pending, fulfilled & rejected states
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => { // data that came back (user token) stored in action
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload; // will be returned in the register function above
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; // passed to thunkAPI.rejectWithValue(message)
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            // same as above register cases
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => { 
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload; 
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; 
                state.user = null;
            })
    }
})

export const {reset} = authSlice.actions;
export default authSlice.reducer;