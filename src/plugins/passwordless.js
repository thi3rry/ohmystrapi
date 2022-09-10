import {setAuthToken} from "../auth.js";

/**
 * @return {null|*|PublicKeyCredentialUserEntity|User|Object|{sendLoginLink(*): Promise<*>, login(*): Promise<null|*|PublicKeyCredentialUserEntity|User|Object>}}
 */
export const usePasswordLessApi = () => {
    return {
        name: 'passwordLess',
        install({strapi}) {
            return {
                strapi,
                async sendLoginLink(email) {
                    const params = {
                        method: 'POST',
                        body: {
                            email,
                            username: email,
                            context: {
                                currentUrl: location.href
                            }
                        }
                    };
                    return await strapi.createFetch({withAuthHeaders: false})(
                        `${strapi.apiBaseUrl}/passwordless/send-link`,
                        params
                    )
                        // .catch(err => {
                        //     if (err && err.error.message === 'wrong.email') {
                        //         return strapi.createFetch({withAuthHeaders: false})(
                        //             `${strapi.apiBaseUrl}/passwordless/send-link`,
                        //             {
                        //                 ...params,
                        //                 body: {
                        //                     ...params.body,
                        //                     email
                        //                 }
                        //             }
                        //         )
                        //     }
                        //     return Promise.reject(err);
                        // })
                        ;

                },
                async login(loginToken) {
                    const data = await strapi.createFetch({withAuthHeaders: false})(`${strapi.apiBaseUrl}/passwordless/login`, {params: {loginToken}})
                    const token = data.jwt
                    setAuthToken(token);
                    return data.user;
                }
            };
        },

    }
}
