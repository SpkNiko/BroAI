export const APP_NAME =
  "BroAI";

export const MODES = {
  PROGRAMMER:
    "PROGRAMMER",

  CHAT:
    "CHAT",

  LEARN:
    "LEARN",
} as const;

export type AppMode =
  (typeof MODES)[keyof typeof MODES];

export const MODE_META = {
  PROGRAMMER: {
    label: "Programista",
    description:
      "Buduj, naprawiaj i analizuj kod.",
  },

  CHAT: {
    label: "Gadanie",
    description:
      "Naturalna rozmowa z pamięcią.",
  },

  LEARN: {
    label: "Nauka",
    description:
      "Ucz się krok po kroku i śledź postępy.",
  },
} as const;
