// import {NgModule} from '@angular/core';
// import {APOLLO_OPTIONS} from 'apollo-angular';
// import {ApolloClientOptions, InMemoryCache} from '@apollo/client/core';
// import {HttpLink} from 'apollo-angular/http';

// const uri = 'https://dev-ecp-api.optum.com/ref/v1/graphql'; // <-- add the URL of the GraphQL server here
// export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
//   return {
//     link: httpLink.create({uri}),
//     cache: new InMemoryCache(),
//   };
// }

// @NgModule({
//   providers: [
//     {
//       provide: APOLLO_OPTIONS,
//       useFactory: createApollo,
//       deps: [HttpLink],
//     },
//   ],
// })
// export class GraphQLModule {}
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {  Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';

const uri = 'https://ect-hackathon.optum.com/hackelite/v1/graphql';

export function provideApollo(httpLink: HttpLink) {
  const basic = setContext((operation, context) => ({
    headers: {
     'content-type':'application/json',
     'x-hasura-admin-secret':'hackeliteadminsecretkey'


    }
  }));

  // Get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  // const auth = setContext((operation, context) => ({
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   },
  // }));

  const link = ApolloLink.from([basic, httpLink.create({ uri })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache
  }
}

@NgModule({
  exports: [
    HttpClientModule,
    // ApolloModule,
    HttpLinkModule
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: provideApollo,
    deps: [HttpLink]
  }]
})
export class GraphQLModule {}