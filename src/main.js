import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// Declare global constant variable
app.config.globalProperties.$API_KEY = 'AIzaSyBFZrk5aieMegr03_QvN7E1iMXDYkuSSM4';

app.mount('#app');
