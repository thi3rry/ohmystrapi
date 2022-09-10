import {setAuthToken} from "../auth.js";
import {getErrorMessageFromAxiosResponse} from "../data/strapi-api-messages.js";
import {useContentManagerApi} from "./content-manager.js";

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
export const useUsersPermissionsApi = () => ({
    name: 'usersPermissions',
    install({strapi}) {
        return {
            strapi: strapi,
            contentManager: useContentManagerApi().install({strapi}),
            /**
             * @typedef LoginResponse
             * @property {string} jwt the token to authenticate the user on request
             * @property {User|object|*} user the user object
             */

            /** @callback APILoginMethod
             * Set the token in localStorage
             * @param {object} authDetails
             * @param {string} authDetails.identifier
             * @param {string} authDetails.password
             * @returns {Promise<LoginResponse>}
             */
            loginRequest({identifier, password})
            {
                return (this.strapi.createFetch({withAuthHeaders: false, returnResponseData: true})(
                    `/auth/local`,
                    {
                        body: {
                            identifier,
                            password
                        },
                        method: 'POST'
                    }
                ))
                    .catch((err) => {
                        /** @var {import('ohmyfetch').FetchError} err */
                        if (err.response.status === 400 && err.data && err.data.error) {
                            return Promise.reject(err.data.error);
                        }
                        throw err;
                    })
                    ;
            }
        ,


            /**
             * Authenticate a user and store token in storage
             * @see ./auth.js
             * @param identifier
             * @param password
             * @return {Promise<User>}
             */
            async login({identifier, password}) {
                return this.loginRequest({identifier, password})
                    .then(
                        data => {
                            const token = data.jwt
                            setAuthToken(token);
                            return data.user;
                        },
                        err => {
                            if (err.status === 400 && err.message) {
                                return Promise.reject(err.message);
                            }
                            throw err;
                        }
                    )
                    ;
            },


            /** @callback APILoginMethod
             * Set the token in localStorage
             * @param {object} authDetails
             * @param {string} authDetails.email
             * @returns {Promise<object>}
             */
            async forgotPasswordRequest({email}) {
                return await(this.strapi.createFetch({withAuthHeaders: false})(
                    `${this.strapi.apiBaseUrl}/auth/forgot-password`,
                    {
                        method: 'POST',
                        body: {email}
                    }
                ));
            },

            /**
             * Call the server to send an email with a uniq link to reset password of a user
             * @param email
             * @return {Promise<User>}
             */
            async askForgotPasswordLink({email}) {
                try {
                    await this.forgotPassword({email});
                    return true;
                } catch (e) {
                    return getErrorMessageFromAxiosResponse(e);
                }
            },


            /**
             * Call the server to send a email with a uniq link
             * @param {string} code
             * @param {string} password
             * @param {string} passwordConfirmation
             * @returns {Promise<true>}
             */
            async changeForgottenPasswordRequest({code, password, passwordConfirmation}) {
                return await(this.strapi.createFetch({withAuthHeaders: false})(
                    `${this.strapi.apiBaseUrl}/auth/reset-password`,
                    {
                        method: 'POST',
                        body: {
                            code,
                            password,
                            passwordConfirmation
                        }
                    }
                ));
            },

            /**
             * Call the server to send an email with a uniq link to reset password of a user
             * @param {string} code the code passed throught the url
             * @param {string} password
             * @param {string} passwordConfirmation
             * @return {Promise<true>}
             */
            async changeForgottenPassword({code, password, passwordConfirmation}) {
                const data = await this.changeForgottenPasswordRequest({code, password, passwordConfirmation});
                return getErrorMessageFromAxiosResponse(data);
            },

            async changePassword({currentPassword, newPassword, newPasswordConfirmation}) {
                const data = await(this.strapi.createFetch()(
                    `${this.strapi.apiBaseUrl}/auth/change-password`,
                    {
                        method: 'POST',
                        body: {
                            currentPassword: currentPassword,
                            password: newPassword,
                            passwordConfirmation: newPasswordConfirmation
                        }
                    }
                ));
                return getErrorMessageFromAxiosResponse(data);
            },


            /**
             * @typedef RegistrationResponse
             * @property {string} jwt the token to authenticate the user on request
             * @property {User|object|*} user the token to authenticate the user on request
             */

            /**
             * Register the user
             * @param {object} registrationDetails
             * @param {string} registrationDetails.username
             * @param {string} registrationDetails.email
             * @param {string} registrationDetails.password
             * @returns {Promise<RegistrationResponse>}
             */
            async registerRequest(registrationDetails) {
                return await(this.strapi.createFetch({withAuthHeaders: false})(`${this.strapi.apiBaseUrl}/auth/local/register`, {
                    method: 'POST',
                    body: registrationDetails
                }));
            },


            /**
             * Register the user and automatically set the jwt token returned by the endpoint in localStorage
             * @param {object} authDetails
             * @param {string} authDetails.username
             * @param {string} authDetails.email
             * @param {string} authDetails.password
             * @param {object} options
             * @param {boolean} options.withLogin
             * @returns {Promise<User>}
             */
            async register(
                authDetails,
                {withLogin = true} = {withLogin: true}
            ) {
                // console.log('apolloClient', apolloClient);
                // try {
                //     const { data } = await apolloClient.mutate({ mutation: REGISTER_USER, variables: { ...authDetails } })
                //     const token = data.register.jwt
                //     if (withLogin) {
                //         setAuthToken(token);
                //     }
                //     return data.register;
                // } catch (e) {
                //     console.error(e)
                // }

                try {
                    //const { data } = await apolloClient.mutate({ mutation: REGISTER_USER, variables: { ...authDetails } })
                    const data = await this.registerRequest({...authDetails})
                    const token = data.jwt
                    if (withLogin) {
                        setAuthToken(token);
                    }
                    return data.user;
                } catch (e) {
                    // console.error(e)
                    throw e;
                }
            },


            /**
             *
             * @return {Promise<User>}
             */
            async me() {
                return await(this.strapi.createFetch()(`${this.strapi.apiBaseUrl}/users/me`));
            },
            updateMe({id, ...params}) {
                return this.contentManager.update('users', id, params);
            },
        };
    },
});
