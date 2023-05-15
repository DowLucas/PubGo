// Reducers
import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import counterReducer from '../features/counter/counterSlice';

export aconst rootReducer = combineReducers({
    counter: counterReducer,
});
