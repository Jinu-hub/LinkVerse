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
  /** `/orbit` 명함 QR 랜딩 — 화면 전용 문구 */
  orbit: {
    meta: {
      title: string;
      description: string;
      ogDescription: string;
    };
    diagram: {
      ariaLabel: string;
      placeholder: string;
    };
    hero: {
      badge: string;
      githubAriaLabel: string;
      githubLabel: string;
      blogAriaLabel: string;
      blogLabel: string;
      headlineBefore: string;
      headlineAfter: string;
      introBeforeLink: string;
      introAfterLink: string;
      introSecondParagraph: string;
      identityServicesLabel: string;
    };
    manifesto: {
      sectionTitle: string;
      highlightKinds: string;
      paragraph1Suffix: string;
      paragraph2BeforeHighlight: string;
      highlightEcosystem: string;
      paragraph2Suffix: string;
      principle1Title: string;
      principle1Body: string;
      principle2Title: string;
      principle2Body: string;
      principle3Title: string;
      principle3Body: string;
    };
    servicesSection: {
      kicker: string;
      title: string;
    };
    services: {
      linkVerse: {
        name: string;
        tagline: string;
        description: string;
      };
      nexLetter: {
        name: string;
        tagline: string;
        description: string;
      };
      marketMemory: {
        name: string;
        tagline: string;
        description: string;
      };
      moreComing: {
        name: string;
        tagline: string;
        description: string;
      };
    };
    status: {
      live: string;
      beta: string;
      soon: string;
    };
    cardFooter: {
      stayTuned: string;
      openService: string;
    };
    closing: {
      title: string;
      body: string;
      blogHint: string;
      blogCta: string;
    };
  };
  navigation: {
    en: string;
    ja: string;
    ko: string;
  };
  /** 블로그 레이아웃 상단 브레드크럼 */
  blog: {
    breadcrumb: {
      orbit: string;
      blog: string;
      orbitAriaLabel: string;
    };
    posts: {
      categoryFilter: string;
      allCategories: string;
      categoryFilterAriaLabel: string;
      yearFilter: string;
      monthFilter: string;
      sortFilter: string;
      allPeriod: string;
      sortLatest: string;
      sortOldest: string;
      metaLine: string;
    };
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
