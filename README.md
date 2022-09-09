# ohmystrapi

Lib based on ohmyfetch to consume strapi API



## Install

```shell
npm i ohmystrapi
```

## Usage

```js

import {
    useStrapi, 
    useUsersPermissionsApi, 
    useEntityApi, 
    useSingleTypeEntityApi
} from 'ohmystrapi';

const strapi = useStrapi({
    baseUrl: 'http://localhost:1337',
});
strapi.use('users', useUsersPermissionsApi);
strapi.use('articles', useEntityApi, 'articles');
strapi.use('passwordLess', usePasswordLessApi);
strapi.use('setting', useSingleTypeEntityApi, 'settings');

// Login a user
await strapi.user.login({identifier: 'login@example.com', password: 'password'});
const personnalData = await strapi.user.me();


// get articles
const articles = await strapi.articles.find();
articles.forEach(article => console.log(article.title));

// get articles with "strapi" in content 
const articles = await strapi.articles.search({content: {$contains: 'strapi'}});
articles.data.forEach(article => console.log(article.title));

// get the first article with title contains strapi
const article = await strapi.articles.searchOne({title: {$contains: 'strapi'}});
```
