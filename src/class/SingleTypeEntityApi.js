/**
 * A collection of function to process strapi single type entity
 * @extends API
 */
import API from "./API.js";

export default class SingleTypeEntityApi extends API {
    async fetch() {
        const {data} = await this.strapi.createFetch()(`${this.strapi.apiBaseUrl}/${this.entity}`, { params: {populate: this.populateConfig} })
        return this.entityMapper(data);
    }

    /**
     * Update or create the entity
     *
     * @param {T|object} attributes
     * @return {Promise<T>}
     */
    async createOrUpdate (attributes) {
        const {data} = await this.strapi.createFetch()(`${this.strapi.apiBaseUrl}/${this.entity}`, {
            method: 'PUT',
            body: attributes,
            params: { populate: this.populateConfig }
        })
        return this.entityMapper(data);
    }

    async delete (entity) {
        return await this.strapi.createFetch()(`${this.strapi.apiBaseUrl}/${entity}`, {method: 'DELETE'})
    }
}
