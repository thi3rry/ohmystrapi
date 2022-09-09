
const isInt = (n) => Number(n) === n && n % 1 === 0;
const isFloat = (n) => Number(n) === n && n % 1 !== 0;

export default class SsdStorage {
    /**
     * @type {string|'localstorage'|'memory'} type
     */
    type = 'localstorage';
    prefix;
    values = {};
    encodeValuesAsJson = true;

    constructor(_prefix = 'ssd-storage', _type = 'memory') {
        this.type = _type;
        this.prefix = _prefix+'--';
        this.refreshFromStorage();
    }

    setType(_type = 'localstorage') {
        this.type = _type;
        this.load();
    }



    setItem(key, value) {
        this.values[key] = value;
        this.saveSingle(key);
    }

    getItem(key, defaultValue = null) {
        const cast = typeof defaultValue;
        if (this.values[key]) {
            if (cast === "boolean") {
                return Boolean(this.values[key]);
            }
            if (cast === "string") {
                return String(this.values[key]);
            }
            if (cast === "number" && isInt(defaultValue)) {
                return parseInt(this.values[key]+'', 10);
            }
            if (cast === "number" && isFloat(defaultValue)) {
                return parseFloat(this.values[key]+'');
            }
            return this.values[key];
        }
        return defaultValue;
    }

    removeItem(key) {
        if (this.values[key]) {
            delete this.values[key];
        }
        this.saveSingle(key);
    }

    getAll() {
        return this.values;
    }

    reset() {
        this.values = {};
    }

    refreshFromStorage() {
        this.reset();
        this.load();
    }

    load() {
        let keys = [];
        switch (this.type) {
            case 'memory':
                // nothing to load
                break;
            default:
            case 'localstorage':
                keys = Object.keys(window.localStorage).filter((key) => {
                    return key.startsWith(this.prefix);
                });

                break;
        }
        let i = keys.length;

        while ( i-- ) {
            this.loadSingle(keys[i].replace(this.prefix, ''));
        }
    }
    loadSingle(key) {
        switch (this.type) {
            case 'memory':
                this.values[key] = this.values[key] || null;
            break;
            default:
            case 'localstorage':
              if (this.encodeValuesAsJson) {
                this.values[key] = JSON.parse(window.localStorage.getItem(this.prefix+key));
              }
              else {
                this.values[key] = window.localStorage.getItem(this.prefix+key);
              }
              break;
        }

        return this.getItem(key);
    }

    saveSingle(key) {
        let val = this.values[key]
        switch (this.type) {
            case 'memory':
            break;
            default:
            case 'localstorage':
                if (this.values[key] === undefined) {
                    window.localStorage.removeItem(this.prefix+key);
                }
                else {
                    if (this.encodeValuesAsJson) {
                      val = JSON.stringify(val);
                    }
                    window.localStorage.setItem(this.prefix+key, val);
                }
                break;
        }
        return this.getItem(key);
    }

    save() {
        Object.values(this.values).forEach((val, index) => {
            this.saveSingle(index, val);
        });
    }
}
