import {useContentManagerApi} from "../plugins/content-manager.js";

/**
 * @template M
 */
export default class API {
    /**
     * @property {EntityMapperCallback} entityMapper
     */
    entityMapper;

    /**
     * the pluralized entity name
     * @property {string} entity
     */
    entity;

    /**
     * @property {Strapi4SearchParams.populate|string|Object|'*'} populateConfig See https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/populating-fields.html#relation-media-fields
     */
    populateConfig;

    /**
     * @constructor
     * @param {StrapiAPI} strapi an initialize Strapi object
     * @param {string} entity the name (pluralized) of the entity
     * @param {EntityMapperCallback} entityMapper
     * @param {Strapi4SearchParams.populate|string|Object|'*'} [populateConfig] See https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/populating-fields.html#relation-media-fields
     */
    constructor({
        strapi,
        entity,
        entityMapper = (obj) => obj,
        populateConfig = null
    }) {
        this.entity = entity;
        this.entityMapper = entityMapper;
        this.populateConfig = populateConfig;
        this.strapi = strapi;
        this.contentManager = useContentManagerApi(strapi);
    }
}
