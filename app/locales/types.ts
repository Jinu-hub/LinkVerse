export type Translation = {
  home: {
    title: string;
    subtitle: string;
  };
  navigation: {
    en: string;
    kr: string;
    //es: string;
  };
};

export type DisplayType = "default" | "bookmarks" | "tags" | "memos";