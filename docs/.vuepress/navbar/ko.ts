import { navbar } from "vuepress-theme-hope";

export const koNavbar = navbar([
  "/",
  { text: "How To", icon: "launch", link: "/00-Howto/" },
  {
    text: "Infra",
    icon: "computer",
    children: [
      { text: "Infrastructure", link: "/01-Infrastructure/" },
      { text: "Private-Platform", link: "/02-PrivatePlatform/" },
      { text: "Public-Cloud", link: "/03-PublicCloud/" },
    ],
  },
  { text: "Software", icon: "code", link: "/05-Software/" },
  {
    text: "HashiCorp",
    icon: "workingDirectory",
    link: "/04-HashiCorp/"
  },
  { text: "Etc.", icon: "flex", link: "/06-etc/" },
  {
    text: "MORE",
    icon: "more",
    children: [
      { text: "About", icon: "info", link: "/99-about/01-About.html" },
      { text: "Thank you", icon: "like", link: "/99-about/02-Thanks.html" },
    ],
  },
  { text: "Tags", icon: "tag", link: "/tag" },
]);
