export default defineAppConfig({
  ui: {
    colors: {
      primary: "violet",
      neutral: "zinc",
      success: "teal",
      warning: "orange",
      error: "rose",
    },

    button: {
      slots: {
        base: "font-semibold transition-all active:scale-95 !rounded-full justify-center",
      },
      variants: {
        size: {
          sm: "px-6 py-2 text-sm font-semibold",
          md: "px-8 py-2.5 text-sm font-semibold",
          lg: "px-8 py-3.5 text-base font-semibold",
        },
        variant: {
          solid: "!text-white hover:brightness-110",
        },
      },
    },

    card: {
      slots: {
        root: "rounded-3xl border-zinc-200/60 dark:border-zinc-700 bg-white dark:bg-zinc-800",
        header: "border-b border-zinc-200/60 dark:border-zinc-700 p-6",
        body: "p-6",
        footer: "border-t border-zinc-200/60 dark:border-zinc-700 p-6",
      },
    },

    input: {
      slots: {
        base: "font-medium transition-all !rounded-full border-zinc-200/60 dark:border-zinc-700 focus:ring-primary-300 dark:bg-zinc-900",
        leading: "pl-4",
        leadingIcon: "text-zinc-400 dark:text-zinc-500 shrink-0",
      },
      variants: {
        size: {
          md: "px-4 py-2.5 text-sm",
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
        root: "rounded-3xl p-5 border border-zinc-200/60 dark:border-zinc-700",
      },
    },

    textarea: {
      slots: {
        base: "font-medium transition-all !rounded-3xl border-zinc-200/60 dark:border-zinc-700 focus:ring-primary-300 dark:bg-zinc-900",
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
        base: "rounded-full font-medium px-4 border-zinc-200/60 dark:border-zinc-700 focus:ring-primary-500 dark:bg-zinc-900",
        content:
          "rounded-2xl p-1 border border-zinc-200/60 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-xl",
      },
    },

    modal: {
      slots: {
        overlay: "bg-zinc-950/70 backdrop-blur-sm",
        content:
          "rounded-3xl border border-zinc-200/60 dark:border-zinc-700 bg-white dark:bg-zinc-950",
      },
    },

    avatar: {
      slots: {
        root: "rounded-full ring-2 ring-white dark:ring-zinc-700",
      },
    },

    dropdown: {
      slots: {
        content:
          "!rounded-2xl !p-1.5 border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900",
        item: "rounded-xl font-medium",
      },
    },
    selectMenu: {
      slots: {
        base: "!rounded-full font-medium !px-4 !py-2.5",
        content:
          "!rounded-2xl !p-1 border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900",
        item: "rounded-xl font-medium mx-1 my-0.5",
      },
    },
    dropdownMenu: {
      slots: {
        content:
          "!rounded-2xl !p-1 border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900",
        item: "rounded-xl font-medium mx-1 my-0.5",
      },
    },
  },
});
