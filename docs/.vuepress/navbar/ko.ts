import { navbar } from "vuepress-theme-hope";

export const koNavbar = navbar([
  "/",
  { text: "How To", icon: "rocket", link: "/00-Howto/" },
  {
    text: "Infra",
    icon: "server",
    children: [
      { text: "Infrastructure", link: "/01-Infrastructure/" },
      { text: "Private-Platform", link: "/02-PrivatePlatform/" },
      { text: "Public-Cloud", link: "/03-PublicCloud/" },
    ],
  },
  { text: "Software", icon: "code", link: "/05-Software/" },
  {
    text: "HashiCorp",
    icon: "layer-group",
    link: "/04-HashiCorp/"
  },
  {
    text: "Kubernetes",
    icon: "dharmachakra",
    link: "/07-Kubernetes/"
  },
  { text: "Etc.",
    icon: "mug-hot",
    link: "/06-etc/",
    children: [
      { text: "Book Memo", icon: "book", link: "/06-etc/book-memo/" },
      { text: "Class", icon: "chalkboard-user", link: "/06-etc/class/" },
      { text: "Information", icon: "circle-info", link: "/06-etc/information/" },
      { text: "MacOS", icon: "brands:apple", link: "/06-etc/mac/" },
      { text: "nodejs", icon: "brands:node-js", link: "/06-etc/nodejs/" },
    ],
  },
  {
    text: "MORE",
    icon: "circle-info",
    children: [
      { text: "About", icon: "house-circle-exclamation", link: "/99-about/01-About.html" },
      { text: "Thank you", icon: "heart", link: "/99-about/02-Thanks.html" },
    ],
  },
  { text: "Recently", icon: "clock-rotate-left", link: "/timeline/" },
]);
