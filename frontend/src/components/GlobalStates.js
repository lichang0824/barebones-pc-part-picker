import {atom} from 'recoil';

export const usernameState = atom({
    key: 'usernameState',
    default: ''
});

export const currentPcIDState = atom({
    key: 'currentPcIDState',
    default: null
});

export const currentPcNameState = atom({
    key: 'currentPcNameState',
    default: ''
});