import React from 'react';
import { Keys, Storage } from './localStorage';

export default StoreContext = React.createContext({});

export { observer, useObservable, useObserver } from 'mobx-react-lite';
export { default as appStore } from './appStore';
export { default as userStore } from './userStore';

export { Keys, Storage };
