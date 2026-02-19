<template>
  <div
    class="min-h-screen flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 dark-mode-transition"
  >
    <!-- Sidebar for Desktop -->
    <aside
      class="hidden md:flex md:w-64 flex-col bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 sticky top-0 h-screen transition-colors duration-300"
    >
      <div class="p-6">
        <h1
          class="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center"
        >
          <span class="material-symbols-rounded mr-2 text-primary-500"
            >shopping_bag</span
          >
          Smart Commerce
        </h1>
        <p
          class="text-zinc-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1"
        >
          SaaS Dashboard v4.3
        </p>
      </div>

      <nav class="flex-1 px-4 py-4 space-y-1">
        <ULink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          raw
          exact
          class="flex items-center px-4 py-3 text-sm font-semibold rounded-full transition-all group"
          active-class="bg-primary-500 text-white"
          inactive-class="text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white"
        >
          <span
            class="material-symbols-rounded mr-3 text-xl group-hover:scale-110 transition-transform"
            >{{ item.icon }}</span
          >
          {{ item.label }}
        </ULink>
      </nav>

      <!-- Dark Mode Toggle + User Profile -->
      <div class="p-4 border-t border-zinc-100 dark:border-zinc-700 space-y-3">
        <!-- Theme Toggle -->
        <button
          @click="toggleColorMode"
          class="w-full flex items-center justify-between px-3 py-2.5 rounded-full bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all group cursor-pointer"
        >
          <div class="flex items-center space-x-3">
            <span
              class="material-symbols-rounded text-xl text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors"
            >
              {{ colorModeIcon }}
            </span>
            <span
              class="text-sm font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors"
            >
              {{ colorModeLabel }}
            </span>
          </div>
          <div
            class="relative w-10 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 transition-colors"
            :class="{ 'bg-primary-500': isDark }"
          >
            <div
              class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300"
              :class="isDark ? 'translate-x-5' : 'translate-x-0.5'"
            ></div>
          </div>
        </button>

        <!-- User Profile -->
        <div
          class="flex items-center space-x-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100/50 dark:border-transparent"
        >
          <UAvatar text="АХ" size="sm" />
          <div class="overflow-hidden">
            <p class="text-sm font-bold text-zinc-900 dark:text-white truncate">
              Админ
            </p>
            <p
              class="text-[10px] text-zinc-500 dark:text-zinc-500 truncate uppercase font-bold tracking-tight"
            >
              admin@shop.mn
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Content Area -->
    <main class="flex-1 flex flex-col relative pb-20 md:pb-0">
      <!-- Top header for mobile -->
      <header
        class="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-10 transition-colors duration-300"
      >
        <div class="flex items-center">
          <span class="material-symbols-rounded mr-2 text-primary-500"
            >shopping_bag</span
          >
          <h1 class="text-lg font-bold text-zinc-900 dark:text-white">
            Smart Commerce
          </h1>
        </div>
        <div class="flex items-center gap-1">
          <!-- Mobile Theme Toggle -->
          <button
            @click="toggleColorMode"
            class="w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <span class="material-symbols-rounded text-xl">{{
              colorModeIcon
            }}</span>
          </button>
          <UButton color="gray" variant="ghost">
            <span class="material-symbols-rounded">notifications</span>
          </UButton>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-6 md:p-10">
        <slot />
      </div>

      <!-- Bottom Navigation for Mobile -->
      <nav
        class="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-full flex items-center justify-around px-2 border border-zinc-200/50 dark:border-zinc-800 z-50 transition-colors duration-300"
      >
        <ULink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          raw
          exact
          v-slot="{ isActive }"
          class="flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group"
          active-class="bg-primary-500 text-white scale-110"
          inactive-class="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          <span
            class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform"
            >{{ item.icon }}</span
          >
          <!-- Active Indicator Dot -->
          <div
            v-if="isActive"
            class="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
          ></div>
        </ULink>
      </nav>
    </main>
  </div>
</template>

<script setup>
const colorMode = useColorMode();

const isDark = computed(() => colorMode.value === "dark");

const colorModeIcon = computed(() => {
  if (colorMode.value === "dark") return "dark_mode";
  if (colorMode.value === "light") return "light_mode";
  return "routine";
});

const colorModeLabel = computed(() => {
  if (colorMode.value === "dark") return "Шөнийн горим";
  if (colorMode.value === "light") return "Өдрийн горим";
  return "Автомат";
});

const toggleColorMode = () => {
  const modes = ["light", "dark"];
  const currentIndex = modes.indexOf(colorMode.preference);
  colorMode.preference = modes[(currentIndex + 1) % modes.length];
};

const navItems = [
  { label: "Хяналтын самбар", mobileLabel: "Нүүр", to: "/", icon: "dashboard" },
  {
    label: "Бараа",
    mobileLabel: "Бараа",
    to: "/products",
    icon: "inventory_2",
  },
  {
    label: "Захиалга",
    mobileLabel: "Захиалга",
    to: "/orders",
    icon: "shopping_cart",
  },
  {
    label: "Тохиргоо",
    mobileLabel: "Тохиргоо",
    to: "/settings",
    icon: "settings",
  },
];
</script>
