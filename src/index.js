export {useEntityApi, useSingleTypeEntityApi, useSluggableEntityApi} from './plugins/content-manager.js'
export {usePasswordLessApi} from './plugins/passwordless.js'
export {useUsersPermissionsApi} from './plugins/users-permissions.js'
export {useStrapi} from './strapi.js'

/**
 * A function to parse entity EditorJS attributes
 *
 * @function
 * @param {string} data
 * @return {any}
 */
export function parseEditorJsAttribute(data) {
    return JSON.parse(data);
}

