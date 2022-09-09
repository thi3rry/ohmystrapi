import API from "./API.js";

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
 * @param {Strapi4SearchParams} params
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


/**
 * A collection of function to process entity
 * @template T
 * @extends API
 */
export default class CollectionEntityApi extends API {


    /**
     * ApiFindMethod
     * @async
     * @param {Strapi4SearchParams} params
     * @return {Promise<T[]>}     */
    async find({...params} = {}) {
        const {data} = await this.contentManager.find(this.entity, {...params, populate: params.populate || this.populateConfig });
        return data.map(o => this.entityMapper(o));
    }

    /** @type {ApiSearchMethod}
     */
    async search({...params} = {}) {
        const data = await this.contentManager.find(this.entity, {...params, populate: params.populate || this.populateConfig });
        return {
            ...data,
            data: data.data.map(o => {
                return this.entityMapper(o)
            })
        };
    }

    /**
     * @type {ApiFindOneMethod}
     */
    async findOne({id}) {
        const data = await this.contentManager.findOne(this.entity, id, {populate: this.populateConfig});
        return this.entityMapper(data);
    }

    /**
     * @type ApiSearchOneMethod
     */
    async searchOne (searchParams, index = 0) {
        const res = await this.contentManager.searchOne(this.entity, {...searchParams, populate: searchParams.populate || this.populateConfig }, index);
        if (res) {
            return this.entityMapper(res);
        }
        return null;
    }
    /**
     * @function ApiUpdateMethod
     * @param {T|object} properties
     * @param {string|number} properties.id
     * @param {any} properties.attributes
     * @return {Promise<T>}
     */
    async update({id, ...attributes}) {
        const data = await this.contentManager.update(this.entity, id, attributes, { populate: this.populateConfig});
        return this.entityMapper(data);
    }

    /**
     * @function ApiCountMethod
     * @param {object} params
     * @param {*} params.search the search object filters
     * @return {Promise<number>}
     */
    async count({search}) {
        return await this.contentManager.count(this.entity, search);
    }

    /**
     * @function ApiInsertMethod
     * @param {T|object} data
     * @param {*} data.id
     * @param {*} data.attributes
     * @return {Promise<T>} the created object
     */
    async create ({id, ...attributes}) {
        // The id is destructured to ensure it is not sent to the api
        const result = await this.contentManager.create(this.entity, attributes, { populate: this.populateConfig})
        return this.entityMapper(result);
    }

    /**
     * @deprecated use save() method instead
     * @param id
     * @param attributes
     * @return {Promise<T>}
     */
    async upsert({id, ...attributes}) {
        return this.save({id, ...attributes});
    }

    /**
     * Update or create the entity
     * @param {T|object} data
     * @param {*} data.id
     * @param {*} data.attributes
     * @return {Promise<T>}
     */
    async save({id, ...attributes}) {
        if (!id) {
            return await this.create(attributes);
        }
        return await this.update({id, ...attributes})
    }

    /**
     * @function ApiDeleteMethod
     * @param {number|string} id
     * @return {Promise<T>} the deleted object
     */
    async delete (id) {
        return await this.contentManager.delete(this.entity, id);
    }
}
