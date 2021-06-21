import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
// import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import Vue from "vue";
import VueApollo from 'vue-apollo';
import App from "./App.vue";
import AuthPlugin from "./plugins/auth";
import router from "./router";

Vue.use(AuthPlugin);

// vue apollo
Vue.use(VueApollo)

Vue.config.productionTip = false;
// get the authorization header
const getHeader = () => {
  const headers = {};
  const token = window.localStorage.getItem('apollo-token');

  if (token) {
    headers.authorization = `Bearer ${token}`
  }

  return headers;
}

const link = new WebSocketLink({
  uri: 'wss://hasura.io/learn/graphql',
  options: {
    reconnect: true,
    timeout: 30000,
    connectionParams: () => {
      return {headers: getHeader()}
    }
  }
})

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    appTypename: true
  })
})

const apolloProvider = new VueApollo({
  defaultClient: client,
})

new Vue({
  router,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
