import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// Declare global constant variable
app.config.globalProperties.$API_KEY = '';

app.mount('#app');
