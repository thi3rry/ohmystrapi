import {afterEach, describe, expect, test} from "vitest";
import { useStrapi } from '../src/strapi.js';
import {useEntityApi} from "../src/plugins/content-manager.js";
import {$wait} from "../src/utils.js";
const strapiUrl = 'http://localhost:1337';
const strapi = useStrapi({
    baseUrl: strapiUrl,
});


describe.only('ContentManager', () => {
    describe('Articles', () => {
        afterEach(async () => $wait(0.8));
        const strapiApiArticles = strapi.use(useEntityApi('articles'));
        test('find one has id', async () => {
            await expect(strapiApiArticles.findOne({id: 1})).resolves.toHaveProperty('id');
            expect.assertions(1);
        })
        test('find is an array', async () => {
            await expect(strapiApiArticles.find({id: 1})).resolves.toHaveLength(1);
            expect.assertions(1);
        });
        test('find has multiple articles', async () => {
            const articles = await strapiApiArticles.find({id: 1});
            expect(articles).toHaveLength(1);
            expect(articles[0]).toHaveProperty('id');
            expect(articles[0].id).toEqual(1);
            expect.assertions(3);
        });

        test('search return a pagination metadata', async () => {
            const articles = await strapiApiArticles.search();
            expect(articles).toHaveProperty('data');
            expect(articles.data).toHaveProperty('length');
            expect(articles).toHaveProperty('meta');
            expect(articles.meta).toHaveProperty('pagination');
            expect.assertions(4)

        })
    })
});
