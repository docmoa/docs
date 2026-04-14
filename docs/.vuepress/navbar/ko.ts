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
  {
    text: "HashiCorp",
    icon: "layer-group",
    link: "/04-HashiCorp/",
    children: [
      { text: "Packer", icon: "/assets/menu-icon/packer.svg", link: "/04-HashiCorp/01-Packer/" },
      { text: "Vagrant", icon: "/assets/menu-icon/vagrant.png", link: "/04-HashiCorp/02-Vagrant/" },
      { text: "Terraform", icon: "/assets/menu-icon/terraform.svg", link: "/04-HashiCorp/03-Terraform/" },
      { text: "Consul", icon: "/assets/menu-icon/consul.svg", link: "/04-HashiCorp/04-Consul/" },
      { text: "Boundary", icon: "/assets/menu-icon/boundary.svg", link: "/04-HashiCorp/05-Boundary/" },
      { text: "Vault", icon: "/assets/menu-icon/vault.svg", link: "/04-HashiCorp/06-Vault/" },
      { text: "Nomad", icon: "/assets/menu-icon/nomad.svg", link: "/04-HashiCorp/07-Nomad/" },
    ],
  },
  {
    text: "Kubernetes",
    icon: "dharmachakra",
    link: "/07-Kubernetes/"
  },
  {
    text: "Software",
    icon: "compact-disc",
    link: "/05-Software/"
  },
  {
    text: "Etc.",
    icon: "mug-hot",
    link: "/06-etc/"
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
