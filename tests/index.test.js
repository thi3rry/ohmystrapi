import { useStrapi } from '../src/strapi.js';
import { describe, test, expect, afterEach } from 'vitest'
import {$wait} from "../src/utils.js";

const strapiUrl = 'http://localhost:1337';
const strapi = useStrapi({
    baseUrl: strapiUrl,
});


afterEach(() => $wait(0.2))


describe('strapi Alive ?', () => {
    test('baseUrl of strapi', () => {
        expect(strapi.baseUrl).toBe(strapiUrl);
        expect(strapi.apiBaseUrl).toBe(`${strapiUrl}/api`);
    })

    test('strapi is alive', async () => {
        await expect(strapi.isAlive()).resolves.toEqual(true);
    });
});


