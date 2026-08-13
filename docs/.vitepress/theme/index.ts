import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import SecretEntry from "./components/SecretEntry.vue";
import SecretList from "./components/SecretList.vue";
import SecretWrite from "./components/SecretWrite.vue";
import "./secret.css";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("SecretList", SecretList);
    app.component("SecretEntry", SecretEntry);
    app.component("SecretWrite", SecretWrite);
  },
};
