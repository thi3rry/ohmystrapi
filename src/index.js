// import {AxiosResponse, AxiosRequestConfig} from 'axios/index.d.ts';
import CollectionEntityApi from './class/CollectionEntityApi.js';
import SluggableEntityApi from './class/CollectionEntityApi.js';
import SingleTypeEntityApi from './class/SingleTypeEntityApi.js';
export {useStrapi} from './strapi.js';


/**
 * A function to parse entity EditorJS attribute
 *
 * @function
 * @param {string} data
 * @return {any}
 */
export function parseEditorJsAttribute(data) {
    return JSON.parse(data);
}

/**
 *
 * @param {StrapiAPI} strapi
 * @param {string} entity the pluralize name of the entity
 * @param entityMapper
 * @param populateConfig
 * @return {CollectionEntityApi}
 */
export function useEntityApi(strapi, entity, entityMapper = null, populateConfig = null) {
    if (entityMapper === null) {
        entityMapper = (obj) => obj;
    }
    return new CollectionEntityApi({
        strapi,
        entity,
        entityMapper,
        populateConfig
    });
}


/**
 * Create a SluggableEntityApi instance
 *
 * @function
 * @template {object} U - An entity object
 * @param {StrapiAPI} strapi
 * @param {string} entity the pluralize name of the entity
 * @param {function(object): U} entityMapper
 * @param {Strapi4SearchParams.populate|string|Object|'*'} [populateConfig] See https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/populating-fields.html#relation-media-fields
 * @return SluggableEntityApi<U|*>
 */
export function useSluggableEntityApi(strapi, entity, entityMapper = null, populateConfig = null) {
    if (entityMapper === null) {
        entityMapper = (obj) => obj;
    }
    return new SluggableEntityApi({
        strapi,
        entity,
        entityMapper,
        populateConfig
    });
}

/**
 * Create a SingleTypeEntityApi instance
 *
 * @template U - An entity object
 * @param {StrapiAPI} strapi
 * @param {string} entity the pluralize name of the entity
 * @param {function(object): U} entityMapper
 * @param {Strapi4SearchParams.populate|string|Object|'*'} [populateConfig] See https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/populating-fields.html#relation-media-fields
 * @return SingleTypeEntityApi<U|*>
 */
export function useSingleTypeEntityApi(strapi, entity, entityMapper = null, populateConfig = null) {
    if (entityMapper === null) {
        entityMapper = (obj) => obj;
    }
    return new SingleTypeEntityApi({
        strapi,
        entity,
        entityMapper,
        populateConfig
    });
}





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
 * @template E
 * @callback EntityMapperCallback A callback to pass all objects returned from the API
 * @param {Object} object
 * @returns {E}
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
