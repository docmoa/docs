import { navbar } from "vuepress-theme-hope";

export const koNavbar = navbar([
  "/",
  { text: "How To", icon: "launch", link: "/00-Howto/" },
  {
    text: "Infra",
    children: [
      { text: "Infrastructure", link: "/01-Infrastructure/" },
      { text: "Private-Platform", link: "/02-PrivatePlatform/" },
      { text: "Public-Cloud", link: "/03-PublicCloud/" },
    ],
  },
  { text: "Software", link: "/05-Software/" },
  { text: "HashiCorp", link: "/04-HashiCorp/" },
  { text: "Etc.", link: "/06-etc/" },
  {
    text: "MORE",
    children: [
      { text: "About", link: "/99-about/01-About.html" },
      { text: "Thank you", link: "/99-about/02-Thanks.html" },
      { text: "Go Contribute", link: "https://github.com/docmoa/docs" },
    ],
  },
  { text: "#Tags", link: "/tag" },
]);
