/**
 * @typedef Strapi4RestError
 * @property {number} status HTTP Status
 * @property {string|'ApplicationError'|'ValidationError'} name Strapi error name ('ApplicationError' or 'ValidationError')
 * @property {string} message A human reable error message
 * @property {Object} details error info specific to the error type
 */
export interface Strapi4RestError {
    status: number;
    name: string|'ApplicationError'|'ValidationError';
    message: string;
    detail: any;
}


/**
 * @template T
 * @typedef Strapi4SingleEntryApiResponse<T>
 * @property {number} id
 * @property {Object|T} attributes
 */
export interface Strapi4SingleEntryApiResponse<T> {
    id: number;
    attributes: T;
}

/**
 * @typedef Strapi4ApiResponse<T>
 * @property {Object|null|Strapi4SingleEntryApiResponse|Strapi4SingleEntryApiResponse[]|T} data the response data itself
 * @property {Object} meta information about pagination, publication state, available locales, etc.
 * @property {Strapi4ApiMetaPaginationByOffsetResponse|Strapi4ApiMetaPaginationByPageResponse} [meta.pagination]
 * @property {Strapi4RestError} [error] information about any error thrown by the request
 */
export interface Strapi4ApiResponse<T> {
    data: Object|null|Strapi4SingleEntryApiResponse<T>|Strapi4SingleEntryApiResponse<T>[]|T;
    meta: Object; // Information about pagination, publication state, available locales, etc.
    error?: Strapi4RestError;
}

/**
 * @typedef Strapi4PaginationByOffsetParams
 * @property {number} start default to 0
 * @property {number} limit default to 25
 * @property {boolean} withCount default to true
 */
export interface Strapi4PaginationByOffsetParams {
    start: number;
    limit: number;
    withCount: boolean;
}

/**
 * @typedef Strapi4PaginationByPageParams
 * @property {number} page default to 1
 * @property {number} pageSize default to 25
 * @property {boolean} withCount default to true
 */
export interface Strapi4PaginationByPageParams {
    page: number;
    pageSize: number;
    withCount: number;
}


/**
 * @typedef Strapi4QueryParams
 * @property {string[]} [fields] {@link https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/populating-fields.html#field-selection}
 * @property {string|Object|'*'} [populate] {@link https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/populating-fields.html#relation-media-fields}
 */
export interface Strapi4QueryParams {
    fields?: string[];
    populate?: string|any;
}

/**
 * @typedef Strapi4SearchParams
 * @extends Strapi4QueryParams
 * @property {array} [sort] An array of the field name to order (default order is asc) (eg: ['title:asc', 'date:desc'])
 * @property {Object} [filters] {@link https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/filtering-locale-publication.html#filtering}
 * @property {Strapi4PaginationByPageParams|Strapi4PaginationByOffsetParams} [pagination]
 * @property {string|'live'|'preview'} [publicationState]
 * @property {string} [locale]
 *
 */
export interface Strapi4SearchParams extends Strapi4QueryParams {
    sort?: string[];
    filters?: Object;
    pagination?: Strapi4PaginationByPageParams|Strapi4PaginationByOffsetParams;
    publicationState?: string|'live'|'preview';
    locale?: string;
}




/**
 * @type Object
 * @typedef Strapi4ApiMetaPaginationByOffsetResponse
 * @property {number} start
 * @property {number} limit
 * @property {number} total
 */
export interface Strapi4ApiMetaPaginationByOffsetResponse {
    start: number;
    limit: number;
    total: number;
}

/**
 * @type {Object}
 * @typedef Strapi4ApiMetaPaginationByPageResponse
 * @property {number} page
 * @property {number} pageSize
 * @property {number} pageCount
 * @property {number} total
 */
export interface Strapi4ApiMetaPaginationByPageResponse {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}

