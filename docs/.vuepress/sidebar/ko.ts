import { sidebar as hope_sidebar } from "vuepress-theme-hope";

export const koSidebar = hope_sidebar({
  "/00-Howto/": "structure",
  "/01-Infrastructure/": "structure",
  "/02-PrivatePlatform/": "structure",
  "/03-PublicCloud/": "structure",
  "/04-HashiCorp/": "structure",
  "/05-Software/": "structure",
  "/07-Kubernetes/": "structure",
  "/06-etc/": "structure",
  "/99-about/": "structure",
  "/": [
    "",
    "tag",
    "99-about/01-About",
  ],
});

