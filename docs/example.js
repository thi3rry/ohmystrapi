
import {
    useStrapi,
    useUsersPermissionsApi,
    useEntityApi,
    useSingleTypeEntityApi
} from 'ohmystrapi';

const strapi = useStrapi({
    baseUrl: 'http://localhost:1337',
});
const strapiApi = {
    user: useUsersPermissionsApi(strapi),
    passwordLess: usePasswordLessApi(strapi),
    article: useEntityApi('articles'),
    setting: useSingleTypeEntityApi('settings')
};

// Login a user
await strapiApi.user.login({identifier: 'login@example.com', password: 'password'});
const personnalData = await strapiApi.user.me();


// get articles
const articles = await strapi.article.find();
articles.forEach(article => console.log(article.title));

// get articles with "strapi" in content
const articlesFiltered = await strapi.article.find({content: {$contains: 'strapi'}});
articlesFiltered.forEach(article => console.log(article.title));

// get the first article with title contains strapi
const article = await strapi.article.searchOne({title: {$contains: 'strapi'}});
