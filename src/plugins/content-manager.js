import qs from "qs";
import CollectionEntityApi from "../class/CollectionEntityApi.js";
import SluggableEntityApi from "../class/CollectionEntityApi.js";
import SingleTypeEntityApi from "../class/SingleTypeEntityApi.js";
/**
 * @typedef User
 * @property {int} id
 * @property {string} email
 * @property {string} username
 * @property {boolean} confirmed
 * @property {boolean} blocked
 * @property {string|"local"|null} provider
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/*+
 * @return {null|*|PublicKeyCredentialUserEntity|User|Object|{changeForgottenPassword({code: string, password: string, passwordConfirmation: string}): Promise<true>, updateMe({id: *, [p: string]: *}): *, askForgotPasswordLink({email: *}): Promise<User>, me(): Promise<User>, login({identifier: *, password: *}): Promise<User>, changePassword({currentPassword: *, newPassword: *, newPasswordConfirmation: *}): Promise<*|undefined>, register({username: string, email: string, password: string}, {withLogin: boolean}=): Promise<User>}|Promise<User>|Promise<*>}
 */
export const useContentManagerApi = () => ({
    name: 'contentManager',
    install({strapi}) {
        return {
            /**
             * Return an array of strapi entity response
             * @param {string} entity The plural form of the entity name
             * @param {Strapi4SearchParams} searchParams
             * @return {Promise<AxiosResponse<Strapi4ApiResponse<Strapi4SingleEntryApiResponse>>>}
             */
            async find (entity, searchParams) {
                return await strapi.createFetch()(`${strapi.apiBaseUrl}/${entity}?${qs.stringify(searchParams)}`)
            },

            /**
             * Search for the one Entity
             *
             * @param {string} entity The plural form of the entity name
             * @param {Strapi4SearchParams} searchParams
             * @param {number} [index] default 0
             *
             * @return {Promise<Strapi4ApiResponse>}
             */
            async searchOne (entity, searchParams, index = 0) {
                try {
                    const {data} = await this.find(entity, searchParams);
                    if (data && data[index]) {
                        return Promise.resolve(data[index]);
                    }
                    return Promise.resolve(null);
                }
                catch (e) {
                    return Promise.reject(e);
                }
            },

            /**
             * Return the total elements of a search
             *
             * @param {string} entity
             * @param {Strapi4SearchParams} searchParams
             *
             * @return {Promise<number>}
             */
            async count (entity, searchParams) {
                try {
                    const pagination = searchParams.pagination || { withCount: true };
                    const data = await this.find(entity, {...searchParams, pagination: {...pagination, withCount: true}});
                    return data.pagination.total;
                }
                catch (e) {
                    return Promise.reject(e);
                }
            },

            async findOne (entity, id, queryParams = {}) {
                try {
                    const url = `${strapi.apiBaseUrl}/${entity}/${id}?${qs.stringify(queryParams)}`;
                    const {data} = await (strapi.createFetch()(url));
                    return data;
                }
                catch (e) {
                    return Promise.reject(e);
                }
            },

            async create (entity, attributes, queryParams = {}) {
                const url = `${strapi.apiBaseUrl}/${entity}?${qs.stringify(queryParams)}`;
                return strapi.createFetch()(url, {method: 'POST', body: {data: attributes}})
            },

            /**
             *
             * @param entity
             * @param id
             * @param attributes
             * @param {Strapi4QueryParams} queryParams
             * @returns {Promise<*>}
             */
            async update (entity, id, attributes, queryParams= {}) {
                try {
                    const url = `${strapi.apiBaseUrl}/${entity}/${id}?${qs.stringify(queryParams)}`;
                    const {data} = await (strapi.createFetch()(url, {method: 'PUT', body: attributes}))
                    return data;
                }
                catch (e) {
                    return Promise.reject(e);
                }
            },

            async delete (entity, id) {
                return await (strapi.createFetch()(`${strapi.apiBaseUrl}/${entity}/${id}`, {method: 'DELETE'}))
            },

            configure(callback, entity, entityMapper = null, populateConfig = null) {
                this.entities[entity] = callback(entity, entityMapper, populateConfig);
            }
        }
    },

});



/**
 *
 * @param {string} entity the pluralize name of the entity
 * @param entityMapper
 * @param populateConfig
 * @return {CollectionEntityApi}
 */
export const useEntityApi = (entity, entityMapper = null, populateConfig = null) => ({
    name: entity,
    install({strapi}) {
        console.log('entityMapper', entityMapper);
        return new CollectionEntityApi({
            strapi,
            entity,
            entityMapper,
            populateConfig
        });
    }
})


/**
 * Create a SluggableEntityApi instance
 *
 * @function
 * @template {object} U - An entity object
 * @param {string} entity the pluralize name of the entity
 * @param {function(object): U} entityMapper
 * @param {Strapi4SearchParams.populate|string|Object|'*'} [populateConfig] See https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/populating-fields.html#relation-media-fields
 * @return SluggableEntityApi<U|*>
 */
export const useSluggableEntityApi = (entity, entityMapper = null, populateConfig = null) => ({
    name: entity,
    install({strapi}) {
        return new SluggableEntityApi({
            strapi,
            entity,
            entityMapper,
            populateConfig
        });
    }
});

/**
 * Create a SingleTypeEntityApi instance
 *
 * @template U - An entity object
 * @param {string} entity the pluralize name of the entity
 * @param {function(object): U} entityMapper
 * @param {Strapi4SearchParams.populate|string|Object|'*'} [populateConfig] See https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/populating-fields.html#relation-media-fields
 * @param {StrapiAPI} strapi
 * @return SingleTypeEntityApi<U|*>
 */
export const useSingleTypeEntityApi = (entity, entityMapper = null, populateConfig = null, ...{strapi}) => ({
    name: entity,
    install({strapi}) {
        return new SingleTypeEntityApi({
            strapi,
            entity,
            entityMapper,
            populateConfig
        });
    }
});



/** @callback ApiCountMethod
 * @param {Object} params
 * @param {Object} params.search the search object filters
 * @return {Promise<number>}
 */

/** @callback ApiInsertMethod
 */
/** @callback ApiUpdateMethod
 */
/** @callback ApiUpsertMethod
 */
/** @callback ApiDeleteMethod
 * @param {number|string} id The identifier to delete
 * @return boolean Whether the entity has been deleted or not
 */



/**
 * @typedef ApiFindMethod
 * @function ApiFindMethod
 * @async
 * @param {Strapi4SearchParams} params
 * @return {Promise<T[]>}
 */
/**
 * @typedef ApiSearchMethod
 * @function ApiSearchMethod
 * Alias of find() but returns metadata about the search
 * @return {Strapi4ApiResponse}
 */
/**
 * @typedef  ApiFindOneMethod
 * @function ApiFindOneMethod
 * @param {*} params
 * @return {Promise<T>}
 */
/**
 * @typedef  ApiSearchOneMethod
 * @function ApiSearchOneMethod
 * @param {strapi~Strapi4SearchParams} searchParams
 * @param {number} index the index to get from the results of the search
 * @return {Promise<T|null>}
 */

