
import {
    useStrapi,
    useUsersPermissionsApi,
    useEntityApi,
    useSingleTypeEntityApi
} from 'ohmystrapi';

const strapi = useStrapi({
    baseUrl: 'http://localhost:1337',
});
const strapiAuth = strapi.use(useUsersPermissionsApi());
strapi.use(usePasswordLessApi());
const articlesApi = strapi.use(useEntityApi('articles', (obj) => ({id: obj.id, ...obj.attributes}), ['comments']));
strapi.use(useEntityApi('settings', (obj) => ({id: obj.id, ...obj.attributes})));

// Login a user
await strapi.usersPermissions.login({identifier: 'login@example.com', password: 'password'});
// Or
await strapiAuth.login({identifier: 'login@example.com', password: 'password'});

const personnalData = await strapiApi.user.me();


// get articles
const articles = await articlesApi.find();
articles.forEach(article => console.log(article.title));

// get articles with "strapi" in content
const articlesFiltered = await strapi.articles.find({content: {$contains: 'strapi'}});
articlesFiltered.forEach(article => console.log(article.title));

// get the first article with title contains strapi
const article = await strapi.articles.searchOne({title: {$contains: 'strapi'}});
