import { createEvent, createStore } from 'effector';
import { ActiveModal, ActivePage } from '../../types';

export const $pathname = createStore<string>(null);
export const setPathName = createEvent<string>();

export const $username = createStore<string>(null);
export const $activePage = createStore<ActivePage>(ActivePage.UNKNOWN);
export const $activePostCode = createStore<string | null>(null);

export const $activeModal = createStore<ActiveModal | null>(null);
export const setActiveModal = createEvent<ActiveModal>();
