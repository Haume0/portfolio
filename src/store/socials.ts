import { create } from 'zustand'

interface ISocials {
  name: string;
  url: string
}
interface ISocialsStore {
  socials: ISocials[];
  getSocial: (name: string) => ISocials | undefined;
}

const useSocials = create<ISocialsStore>((set, get) => ({
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/haume0"
    },
    {
      name: "Behance",
      url: "https://www.behance.net/haume"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/eminercoban/"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/eminercbn/"
    }
  ],
  getSocial: (name: string): ISocials | undefined => {
    return get().socials.find((social: ISocials) => social.name === name)
  }
}))

export default useSocials