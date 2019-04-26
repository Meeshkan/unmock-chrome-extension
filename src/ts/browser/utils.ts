import { browser, Tabs } from "webextension-polyfill-ts";
import { getLocalStorage } from "./storage";
import { State } from "../state";

export const getActiveTab = async (): Promise<Tabs.Tab> => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tabs[0];
};

export const downloadTo = ({ url }) => {
  browser.downloads.download({
    url,
    filename: "api-spec.json",
  });
};

export const openExplorer = async () => {
  return await browser.windows.create({
    url: browser.runtime.getURL("explorer.html"),
    type: "popup",
  });
};

export const openSwaggerEditor = async () => {
  const width = window.screen.availWidth;
  console.log(`Width: ${width}`);
  return await browser.windows.create({
    url: browser.runtime.getURL("swagger.html"),
    type: "popup",
    left: 0,
    top: 0,
    width: Math.floor(width / 3),
  });
};

export const openSwaggerEditorNpm = async () => {
  const width = window.screen.availWidth;
  console.log(`Width: ${width}`);
  return await browser.windows.create({
    url: browser.runtime.getURL("swagger-npm.html"),
    type: "popup",
    left: 0,
    top: 0,
    width: Math.floor(width / 3),
  });
};

type StateChangeHandler = (state: State) => void;

export const buildStateChangeHandler = (
  stateChangeHandler: (state: State) => void
) => {
  return async (changes, namespace) => {
    const state = await getLocalStorage();
    stateChangeHandler(state);
  };
};

export const subscribeToChanges = (stateChangeHandler: StateChangeHandler) => {
  const listener = buildStateChangeHandler(stateChangeHandler);
  browser.storage.onChanged.addListener(listener);
  return listener;
};

export const unsubscribeToChanges = (listener: any) => {
  browser.storage.onChanged.removeListener(listener);
};
