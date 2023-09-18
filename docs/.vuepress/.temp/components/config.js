import { defineClientConfig } from "@vuepress/client";
import { hasGlobalComponent } from "D:/workspaces/docmoa-hope/node_modules/vuepress-shared/lib/client/index.js";
import { h } from "vue";

import { useStyleTag } from "D:/workspaces/docmoa-hope/node_modules/@vueuse/core/index.mjs";
import Badge from "D:/workspaces/docmoa-hope/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import FontIcon from "D:/workspaces/docmoa-hope/node_modules/vuepress-plugin-components/lib/client/components/FontIcon.js";
import BackToTop from "D:/workspaces/docmoa-hope/node_modules/vuepress-plugin-components/lib/client/components/BackToTop.js";

import "D:/workspaces/docmoa-hope/node_modules/vuepress-plugin-components/lib/client/styles/sr-only.scss";

export default defineClientConfig({
  enhance: ({ app }) => {
    if(!hasGlobalComponent("Badge")) app.component("Badge", Badge);
    if(!hasGlobalComponent("FontIcon")) app.component("FontIcon", FontIcon);
    
  },
  setup: () => {
      useStyleTag(`\
  @import url("https://at.alicdn.com/t/c/font_2410206_5vb9zlyghj.css");
  `);
  },
  rootComponents: [
    () => h(BackToTop, {}),
  ],
});
