import qs from "qs";
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
export const useContentManagerApi = (strapi) => {
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
    };
};
