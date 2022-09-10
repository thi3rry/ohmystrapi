/**
 * A collection of function to process sluggable entity
 * @extends CollectionEntityApi
 *
 */
import CollectionEntityApi from "./CollectionEntityApi.js";

export default class SluggableEntityApi extends CollectionEntityApi {
    /** @type ApiFindOneMethod */
    async findOne({id, slug}) {
        if (id) {
            return super.findOne({id});
        }
        else if (slug) {
            return this.searchOne({filters: {slug: {$eq: slug}}});
        }
    }
}
