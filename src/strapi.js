import {$fetch} from 'ohmyfetch';
import {getAuthHeaders, isTokenValid, resetAuthToken} from "./auth.js";
import qs from "qs";
import ltrim from 'locutus/php/strings/ltrim';
import rtrim from 'locutus/php/strings/rtrim';

/**
 *  The strapi sdk
 * @example useStrapi({baseUrl: 'http://localhost:1337'});
 * @usage useStrapi({baseUrl: 'http://localhost:1337', apiPrefix: '/customApiPrefix'});
 * @param {object} options
 * @param {string} options.baseUrl The url of you strapi with no trailing slash
 * @param {string} options.apiPrefix the prefix of you API, default to '/api'
 * @return {StrapiAPI}
 */
export const useStrapi = ({
        baseUrl, // 'http://localhost:1337'
        apiPrefix = '/api',
    }) => {

    baseUrl = rtrim(baseUrl, '/');
    apiPrefix = '/'+ltrim(rtrim(apiPrefix, '/'), '/');

    const apiBaseUrl = baseUrl+apiPrefix

    /**
     * @typedef StrapiAPI
     */
    return {
        baseUrl,
        apiPrefix,
        apiBaseUrl: baseUrl+apiPrefix,
        /**
         * @param {object} options
         * @param {boolean} [options.withAuthHeaders=true] Attach Authorisation Hearder with token to request, default: true
         * @param {boolean} [options.returnResponseData=true] Each request will return a Promise of the data of the response, default: true
         * @return {import('ohmyfetch').$Fetch}
         */
        createFetch(options = {}) {
            // const $fetch = useFetch();
            const _defaultOptions = {
                withAuthHeaders: true,
                returnResponseData: true,
                responseType: 'json'
            };
            const {withAuthHeaders, returnResponseData, responseType, baseURL} = {
                ..._defaultOptions,
                ...options
            };

            const authHeaders = {
                ...getAuthHeaders()
            };

            const strapiFetch = $fetch.create({
                headers: withAuthHeaders ? authHeaders : {},
                responseType,
                baseURL: baseURL ?? this.apiBaseUrl,
                // paramsSerializer: qs.stringify,
                /**
                 *
                 * @param ctx
                 * @return {Promise<FetchContext<any, ResponseType> & {response: FetchResponse<ResponseType>}>}
                 */
                // async onResponse(ctx) {
                //     console.log('request', ctx.request);
                //     // baseUrl
                //     return ctx;
                // },
                /**
                 *
                 * @param {import('ohmyfetch').FetchContext} fetchContext
                 * @return {Promise<void>}
                 */
                async onResponseError(fetchContext) {
                    /**
                     * {import('ohmyfetch').ResponseType} response
                     */
                    const { request, response, options } = fetchContext;
                    // Log error
                    // console.warn('[fetch response error]', request, response.status, response)
                    // console.log('response', response.headers.status)

                    // Si on a une erreur 401 avec un token "valide" on l'efface pour forcer à en récupérer un
                    // Gestion des cas où un token valide serait présent en localstorage mais dont le serveur ne voudrait pas
                    if (response && response.status === 401 && isTokenValid()) {
                        console.warn('Token was resetted');
                        resetAuthToken();
                    }

                }

            });

            return strapiFetch;

            // return (...args) => {
            //     const f = returnResponseData ? strapiFetch : strapiFetch.raw;
            //     return f(...args)
            //         .catch((error) => {
            //             if (returnResponseData) {
            //                 return Promise.reject(error.data || null)
            //             }
            //             return Promise.reject(error);
            //         })
            //         ;
            // }
        },

        async isAlive() {
            const request = await this.createFetch().raw('/', {baseURL: this.baseUrl});
            return request.status === 200;
        },

        /**
         * Ensure that medias url start with the strapi base url
         * @param {string} url The url of the media
         * @returns {string|*}
         */
        getMediaUrl(url) {
            if (
                url
                && !url.startsWith(this.baseUrl)
                && !url.startsWith('https://')
                && url.startsWith('/')
            ) {
                // Prepend Strapi address
                return `${this.baseUrl}${url}`
            }
            // Otherwise return full URL
            return url
        },

        /**
         * @typedef Plugin
         * @property name
         * @property {Function} install
         * @return {*}
         */


        /**
         * Add property to this object
         * @example const strapi = useStrapi();
         * strapi.use('user', useUsersPermissionsApi);
         * @param {Plugin<T>} plugin
         * @param params? Params to pass to the callback after the first strapi argument
         * @return {T} the use function initialized with the strapi object
         */
        use(plugin) {
            const {name, install} = plugin;
            this[name] = install({strapi: this});
            return this[name];
        }
    };
}
