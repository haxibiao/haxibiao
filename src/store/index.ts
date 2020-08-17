export { Keys, Storage } from './localStorage';
export { observer } from 'mobx-react';

//单例 store = viewmodel
export { default as appStore } from './appStore';
export { default as userStore } from './userStore';
export { default as chatStore } from './ChatStore';
export { default as videoStore } from './DrawVideoStore';

//非单例的store = viewmdoel
export { default as PlayerStore } from './PlayerStore';
