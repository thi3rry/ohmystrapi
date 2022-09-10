import { useStrapi } from '../src/strapi.js';
import { useUsersPermissionsApi } from '../src/plugins/users-permissions.js';
import { describe, test, expect, afterEach } from 'vitest'
import {getMessage} from "../src/data/strapi-api-messages.js";
import {$wait} from "../src/utils.js";

const strapiUrl = 'http://localhost:1337';
const strapi = useStrapi({
    baseUrl: strapiUrl,
});
const strapiUserApi = strapi.use(useUsersPermissionsApi());



afterEach(() => $wait(0.2))

describe('Users permissions', () => {
    describe('Login success', () => {
        // Wait for 500ms after each test to avoid HTTP 429 too many attemps
        afterEach(async () => $wait(0.5));

        const loginRequestSuccess = strapiUserApi.loginRequest({identifier: 'example', password: 'examplePassword'});
        const loginSuccess = strapiUserApi.login({identifier: 'example', password: 'examplePassword'});
        test('login request success', async () => {
            await expect(loginRequestSuccess).resolves.toHaveProperty('jwt');

            const successResult = await loginRequestSuccess;
            expect(successResult).toHaveProperty('jwt');
            expect(successResult).toHaveProperty('user');
            expect(successResult).toMatchObject({user: {username: 'example', confirmed: true}});
            expect(successResult).toEqual(expect.objectContaining({jwt: expect.any(String)}));
            expect.assertions(5);

        })
        test('login success', async () => {
            await expect(loginSuccess).resolves.toHaveProperty('id');
            const successResult = await loginSuccess;

            expect(successResult).not.toHaveProperty('user');
            expect(successResult).not.toHaveProperty('jwt');
            expect(successResult).toHaveProperty('id');
            expect(successResult).toHaveProperty('username');
            expect(successResult).toHaveProperty('email');
            expect(successResult).toMatchObject({username: 'example', confirmed: true});

            expect.assertions(7);
        })
    })
    describe('Login failed', () => {
        afterEach(async () => $wait(5));
        const loginRequestFailure = strapiUserApi.loginRequest({identifier: 'd', password: 'q'});
        const loginFail = strapiUserApi.login({identifier: 'd', password: 'q'});
        test('login failed', async () => {
            await expect(loginRequestFailure).rejects.toEqual(expect.objectContaining({status: 400}));
            expect.assertions(1);
        });
        test('login bad credentials', async () => {
            await expect(loginFail).rejects.toThrow();
            expect.assertions(1);
        });
        test('login bad credentials 2', async () => {
            const failure = await loginFail.catch((err) => err)
            expect(failure).toEqual('Invalid identifier or password');
            expect.assertions(1);
        });
        test('Error message mapping', async () => {
            const failure = await loginFail.catch((err) => err)
            expect(getMessage(failure)).toEqual('Identifiant ou mot de passe incorrect');
            expect.assertions(1);
        })
    })
})
