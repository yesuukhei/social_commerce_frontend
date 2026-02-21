<template>
  <div
    class="min-h-screen flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 dark-mode-transition"
  >
    <!-- Sidebar for Desktop -->
    <aside
      class="hidden md:flex md:w-64 flex-col bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 sticky top-0 h-screen transition-colors duration-300"
    >
      <div class="p-6">
        <!-- Store Switcher at the very top -->
        <div v-if="user">
          <UDropdownMenu
            :items="storeSwitcherItems"
            :ui="{
              content: 'w-52 shadow-2xl border-zinc-200 dark:border-zinc-800',
            }"
          >
            <div
              class="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-700/50 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group"
            >
              <div class="flex items-center gap-2 overflow-hidden">
                <UAvatar
                  v-if="currentStore?.logoUrl"
                  :src="currentStore.logoUrl"
                  size="sm"
                  class="shrink-0 group-hover:scale-110 transition-transform"
                />
                <div
                  v-else
                  class="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform"
                >
                  <span class="material-symbols-rounded text-lg">{{
                    selectedStoreId ? "store" : "dashboard_customize"
                  }}</span>
                </div>
                <div class="overflow-hidden">
                  <p
                    class="text-xs font-black text-zinc-900 dark:text-white truncate"
                  >
                    {{ currentStore?.name || "Дэлгүүр сонгох" }}
                  </p>
                  <p
                    class="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter truncate"
                  >
                    {{
                      selectedStoreId ? "Идэвхтэй дэлгүүр" : "Нэгдсэн удирдлага"
                    }}
                  </p>
                </div>
              </div>
              <span class="material-symbols-rounded text-sm text-zinc-400"
                >unfold_more</span
              >
            </div>
          </UDropdownMenu>
        </div>
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

        <!-- Desktop User Profile Dropdown -->
        <UDropdownMenu
          v-if="user"
          :items="[
            {
              label: user.name,
              disabled: true,
              class:
                'font-black text-zinc-900 dark:text-white pointer-events-none',
            },
            { type: 'separator' },
            {
              label: 'Гарах',
              icon: 'i-heroicons-arrow-left-on-rectangle',
              onSelect: handleLogout,
              class:
                'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-bold hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors',
              iconClass: 'text-red-500 dark:text-red-400',
            },
          ]"
          :ui="{
            content: 'w-48 shadow-xl border-zinc-200 dark:border-zinc-800',
          }"
        >
          <div
            class="flex items-center space-x-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100/50 dark:border-transparent cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <UAvatar
              :src="user.avatar"
              :alt="user.name"
              :text="user.name?.substring(0, 2)"
              size="sm"
              class="ring-1 ring-zinc-200 dark:ring-zinc-700"
            />
            <div class="overflow-hidden flex-1">
              <p
                class="text-xs font-bold text-zinc-900 dark:text-white truncate"
              >
                {{ user.name }}
              </p>
              <p
                class="text-[9px] text-zinc-500 dark:text-zinc-500 truncate uppercase font-bold tracking-tight"
              >
                {{ user.email || "Admin" }}
              </p>
            </div>
            <span class="material-symbols-rounded text-sm text-zinc-400"
              >unfold_more</span
            >
          </div>
        </UDropdownMenu>
      </div>
    </aside>

    <!-- Content Area -->
    <main class="flex-1 flex flex-col relative pb-32 md:pb-0 min-w-0">
      <!-- Top header for mobile -->
      <header
        class="md:hidden flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-40 transition-colors duration-300"
      >
        <div class="flex items-center gap-2 w-full justify-between">
          <!-- Mobile Store Switcher -->
          <UDropdownMenu
            v-if="user"
            :items="storeSwitcherItems"
            :ui="{
              content: 'w-52 shadow-2xl border-zinc-200 dark:border-zinc-800',
            }"
          >
            <div
              class="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-700/50 border border-zinc-200/50 dark:border-zinc-600/50 cursor-pointer active:scale-95 transition-all"
            >
              <UAvatar
                v-if="currentStore?.logoUrl"
                :src="currentStore.logoUrl"
                size="xs"
                class="shrink-0"
              />
              <div
                v-else
                class="w-5 h-5 rounded-md bg-primary-500 flex items-center justify-center text-white shrink-0"
              >
                <span class="material-symbols-rounded text-[12px]">{{
                  selectedStoreId ? "store" : "dashboard_customize"
                }}</span>
              </div>
              <span
                class="text-[10px] font-bold text-zinc-900 dark:text-white truncate max-w-[70px]"
              >
                {{ currentStore?.name || "Дэлгүүр" }}
              </span>
              <span class="material-symbols-rounded text-[14px] text-zinc-400"
                >expand_more</span
              >
            </div>
          </UDropdownMenu>

          <!-- Mobile Theme Toggle -->
          <button
            @click="toggleColorMode"
            class="w-9 h-9 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            <span class="material-symbols-rounded text-lg">{{
              colorModeIcon
            }}</span>
          </button>
          <!-- User Profile Dropdown -->
          <UDropdownMenu
            v-if="user"
            :items="[
              {
                label: user.name,
                disabled: true,
                class:
                  'font-black text-zinc-900 dark:text-white pointer-events-none',
              },
              { type: 'separator' },
              {
                label: 'Гарах',
                icon: 'i-heroicons-arrow-left-on-rectangle',
                onSelect: handleLogout,
                class:
                  'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-bold hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors',
                iconClass: 'text-red-500 dark:text-red-400',
              },
            ]"
            :ui="{
              content: 'w-48 shadow-xl border-zinc-200 dark:border-zinc-800',
            }"
          >
            <UAvatar
              :src="user.avatar"
              :alt="user.name"
              :text="user.name?.substring(0, 2)"
              size="sm"
              class="cursor-pointer ring-1 ring-zinc-200 dark:ring-zinc-700"
            />
          </UDropdownMenu>
        </div>
      </header>

      <!-- Page Content -->
      <div class="p-6 md:p-10">
        <slot />
      </div>

      <!-- Bottom Navigation for Mobile -->
      <nav
        class="md:hidden fixed bottom-3 left-6 right-6 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-full flex items-center justify-around px-2 border border-zinc-200/50 dark:border-zinc-800 z-100 transition-colors duration-300"
      >
        <ULink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          raw
          exact
          class="flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group"
          active-class="bg-primary-500 text-white scale-110"
          inactive-class="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          <span
            class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform"
            >{{ item.icon }}</span
          >
        </ULink>
      </nav>
    </main>
  </div>
</template>

<script setup>
const colorMode = useColorMode();
const { user, logout } = useAuth();
const {
  selectedStoreId,
  stores,
  currentStore,
  selectStore,
  fetchStores,
  createNewStore,
} = useStore();

onMounted(async () => {
  if (user.value) {
    await fetchStores();

    // Redirect to settings if no store exists
    if (stores.value.length === 0 && useRoute().path !== "/settings") {
      navigateTo("/settings");
    }
  }
});

const storeSwitcherItems = computed(() => {
  const storeGroup = stores.value.map((s) => ({
    label: s.name,
    icon: s.logoUrl ? undefined : "i-heroicons-building-storefront",
    avatar: s.logoUrl ? { src: s.logoUrl } : undefined,
    onSelect: () => selectStore(s._id),
    class:
      selectedStoreId.value === s._id
        ? "bg-primary-50 text-primary-600 dark:bg-primary-950/30 font-bold"
        : "",
  }));

  const actionGroup = [
    {
      label: "Шинэ дэлгүүр нэмэх",
      icon: "i-heroicons-plus-circle",
      to: "/settings?onboarding=true",
      class: "text-zinc-400 italic font-medium",
    },
  ];

  return [storeGroup, actionGroup].filter((g) => g.length > 0);
});

// Real-time Order Notifications
const { onOrderCreated } = useSocket();
const toast = useToast();

onMounted(() => {
  // Request Notification Permission
  if (process.client && "Notification" in window) {
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }
  }

  onOrderCreated((order) => {
    // 1. Show UI Toast
    toast.add({
      title: "🚨 ШИНЭ ЗАХИАЛГА!",
      description: `${order.customerName} - ₮${order.totalAmount.toLocaleString()} захиалга өглөө.`,
      icon: "i-heroicons-shopping-cart",
      color: "primary",
      timeout: 10000,
      actions: [
        {
          label: "Үзэх",
          click: () => navigateTo(`/orders/${order.orderId}`),
        },
      ],
    });

    // 2. Browser System Notification (for background tabs)
    if (process.client && Notification.permission === "granted") {
      new Notification("Smart Order: Шинэ захиалга!", {
        body: `${order.customerName} - ₮${order.totalAmount.toLocaleString()}`,
        icon: "/favicon.ico",
      });
    }
  });
});

const handleLogout = async () => {
  await logout();
};

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
    label: "Чат",
    mobileLabel: "Чат",
    to: "/inbox",
    icon: "forum",
  },
  {
    label: "Тохиргоо",
    mobileLabel: "Тохиргоо",
    to: "/settings",
    icon: "settings",
  },
];
</script>
