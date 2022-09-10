# ohmystrapi

Lib based on ohmyfetch to consume strapi API


## Install

```shell
npm i ohmystrapi
```

## Usage

Basic init
```js
import ohMyStrapi from 'ohmystrapi';

const strapi = ohMyStrapi.useStrapi({
    baseUrl: 'http://localhost:1337',
});
```


You can fetch content with : 

```js
const articlesResponse = await strapi.createFetch()('/articles')
```

BUT! You can also use the [ohmystrapi content-manager plugin](#content-manager)

### Plugins 

<a id="content-manager"></a>
#### ContentManager

```js
strapi.use(useEntityApi('articles'));
strapi.use(useSingleTypeEntityApi('settings'));

// get articles
const articles = await strapi.articles.find();
articles.forEach(article => console.log(article.title));

// get articles with "strapi" in content 
const articles = await strapi.articles.search({content: {$contains: 'strapi'}});
articles.data.forEach(article => console.log(article.title));

// get the first article with title contains strapi
const article = await strapi.articles.searchOne({title: {$contains: 'strapi'}});


// Toogle an `online` boolean on an single entity 'settings'
const {data: {online}} = await strapi.settings.find();
await strapi.settings.createOrUpdate({online: !online});
```

##### EntityMapper

You can pass as a second argument of the useEntityApi a callback that will be used to map every entity returns by find/findOne/search/searchOne etc...


```js
// Put all attributes next to the id of the entity
strapi.use(useEntityApi('articles', (obj) => ({id: obj.id, ...obj.attributes})));
```

#### Auth user

```js
strapi.use(useUsersPermissionsApi());

// Login a user
await strapi.user.login({identifier: 'login@example.com', password: 'password'});
const personnalData = await strapi.user.me();
```

## Tests

It uses vitest to create test and fetch a local strapi.
You need to start a local strapi instance to run tests 
