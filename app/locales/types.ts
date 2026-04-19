export type Translation = {
  home: {
    title: string;
    subtitle: string;
    hero: {
      headlineLine1Before: string;
      headlineLine1Highlight: string;
      headlineLine2Before: string;
      headlineLine2Highlight: string;
      description: string;
      previewImageAlt: string;
    };
    cta: {
      getStarted: string;
    };
    features: {
      organizeTitle: string;
      organizeDesc: string;
      recommendationsTitle: string;
      recommendationsDesc: string;
      memoTitle: string;
      memoDesc: string;
    };
    audience: {
      sectionTitle: string;
      developerTitle: string;
      developerDesc: string;
      designerTitle: string;
      designerDesc: string;
      creatorTitle: string;
      creatorDesc: string;
      studentTitle: string;
      studentDesc: string;
    };
    howItWorks: {
      sectionTitle: string;
      saveLinkTitle: string;
      saveLinkDesc: string;
      tagOrganizeTitle: string;
      tagOrganizeDesc: string;
      memoStepTitle: string;
      memoStepDesc: string;
    };
    finalCta: {
      title: string;
      description: string;
    };
  };
  navigation: {
    en: string;
    ja: string;
    ko: string;
  };
  join: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    title: string;
    description: string;
    name: string;
    email: string;
    password: string;
    passwordHint: string;
    confirmPassword: string;
    createAccount: string;
    alreadyHave: string;
    signIn: string;
    marketing: string;
    terms: string;
    tos: string;
    and: string;
    privacy: string;
    accountCreated: string;
    verifyEmail: string;
  };
  login: {
    title: string;
    description: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    forgotPassword: string;
    loginButton: string;
    emailNotConfirmedTitle: string;
    emailNotConfirmedDesc: string;
    resendConfirmation: string;
    noAccount: string;
    signUp: string;
  };
};
