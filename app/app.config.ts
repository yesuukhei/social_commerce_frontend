export default defineAppConfig({
  ui: {
    colors: {
      primary: "indigo",
      neutral: "slate",
      success: "emerald",
      warning: "amber",
      error: "rose",
    },

    button: {
      slots: {
        base: "font-semibold transition-all active:scale-95 !rounded-full justify-center",
      },
      variants: {
        size: {
          sm: "px-6 py-2.5 text-sm font-semibold",
          md: "px-8 py-3 text-sm font-semibold",
          lg: "px-8 py-3.5 text-base font-semibold",
        },
        variant: {
          solid: "!text-white hover:brightness-110",
        },
      },
    },

    card: {
      slots: {
        root: "rounded-3xl border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900",
        header: "border-b border-slate-200/60 dark:border-slate-800/50 p-6",
        body: "p-6",
        footer: "border-t border-slate-200/60 dark:border-slate-800/50 p-6",
      },
    },

    input: {
      slots: {
        base: "font-medium transition-all !rounded-full  border-slate-200/60 dark:border-slate-800/50 focus:ring-primary-300",
      },
      variants: {
        size: {
          md: "px-4 py-3 text-sm",
          lg: "px-5 py-3.5 text-base",
        },
      },
    },

    badge: {
      slots: {
        base: "!rounded-full font-bold px-3 py-1",
      },
    },

    alert: {
      slots: {
        root: "rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800/50",
      },
    },

    textarea: {
      slots: {
        base: "font-medium transition-all !rounded-3xl  border-slate-200/60 dark:border-slate-800/50 focus:ring-primary-300",
      },
      variants: {
        size: {
          sm: "px-4 py-3",
          md: "px-4 py-3 text-sm",
          lg: "px-6 py-4 text-base",
        },
      },
    },

    select: {
      slots: {
        base: "rounded-full font-medium px-4  border-slate-200/60 dark:border-slate-800/50 focus:ring-primary-500",
      },
    },

    modal: {
      slots: {
        overlay: "bg-slate-950/60 backdrop-blur-[2px]",
        content:
          "rounded-3xl  border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900",
      },
    },

    avatar: {
      slots: {
        root: "rounded-full ring-2 ring-white dark:ring-slate-800",
      },
    },

    dropdown: {
      slots: {
        content:
          "rounded-2xl p-1  border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-lg",
        item: "rounded-xl font-medium",
      },
    },
  },
});
