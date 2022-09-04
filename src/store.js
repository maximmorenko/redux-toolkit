import { configureStore } from "@reduxjs/toolkit";
import { 
  persistStore,
  persistReducer,
  // если работаем с toolkit то нужен еще ряд констант экшнов (из оф. док)
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// также для персиста нужен комбаин из редакса
import {combineReducers} from 'redux';


import {filterReducer} from './features/Filters/filter-slice';
import {todoReducer} from './features/Todos/todos-slice';

// для персистРедюсера нужен рутРедусер и объект настроек (персист конфиг)
// создадим рутРедюсер
const rootReducer = combineReducers({
  todos: todoReducer,
  filter: filterReducer,
})

// подготовка конфига
const persistConfig = {
  key: 'root',
  storage,
}

// Создаем персистРедюсер и передаем в него заготовленные рут и конфиг
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  // так как тулкит по умолчанию подключает некоторые мидлвейры, то их слудует отключить
  // в момент создания стора, в мидлвейр нужно отключить полученые экшны(константы)
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    // в ключе serializableCheck перечислим экшны которые нужно игнорировать
    serializableCheck: {
      ignoreActions: [
        FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER,
      ]
    }
  })
});


// для персист гейт (обертка приложения в индексе) нужен персистор. создадим его
export const persistor = persistStore(store);
