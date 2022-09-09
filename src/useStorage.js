import SsdStorage from "./class/SsdStorage.js";

export const useStorage = (localstoragePrefix = 'strapi-sdk--') => {
    let storage = new SsdStorage(localstoragePrefix+'user', 'memory');
    try {
        storage = new SsdStorage(localstoragePrefix+'user', 'localstorage');
    }
    catch (e) {
        storage = new SsdStorage(localstoragePrefix+'user', 'memory');
    }
    return storage;
}
