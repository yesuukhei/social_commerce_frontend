<template>
  <div class="space-y-8">
    <WelcomeBanner
      :name="user?.name"
      description="Таны AI туслах өнөөдөр захиалгуудыг автоматаар боловсруулахад бэлэн байна. Системийн төлөв хэвийн, бүх холболтууд идэвхтэй байна."
    />

    <!-- Dashboard Filters -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <h2
        class="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white"
      >
        Үйл ажиллагааны тойм
      </h2>
      <div
        class="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto"
      >
        <span
          class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest"
          >Хугацаа</span
        >
        <USelectMenu
          v-model="selectedRange"
          :items="rangeOptions"
          class="w-full sm:w-48"
          :ui="{ rounded: 'rounded-xl' }"
        >
          <template #label>
            <span class="truncate text-xs font-bold">{{
              selectedRange?.label || "Сонгох"
            }}</span>
          </template>
        </USelectMenu>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="pending || (selectedStoreId && !currentStore)"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <UCard
        v-for="i in 4"
        :key="i"
        class="h-36"
        :ui="{ body: { padding: 'p-6' } }"
      >
        <div class="space-y-3">
          <div
            class="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse w-1/2"
          ></div>
          <div
            class="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse w-2/3"
          ></div>
          <div
            class="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse w-1/3"
          ></div>
        </div>
      </UCard>
    </div>

    <!-- Launch Readiness Checklist (Only for Incomplete Setup) -->
    <div
      v-else-if="!isFullyConfigured"
      class="bg-primary-500/5 dark:bg-primary-500/10 border border-primary-500/20 rounded-[40px] p-8 space-y-8 relative overflow-hidden group"
    >
      <!-- Glow Effect -->
      <div
        class="absolute -right-20 -top-20 w-80 h-80 bg-primary-500/20 rounded-full blur-[100px] pointer-events-none"
      ></div>

      <div
        class="flex flex-col md:flex-row md:items-end justify-between gap-6 relative"
      >
        <div class="space-y-3">
          <div
            class="inline-flex items-center px-3 py-1 rounded-full bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest"
          >
            ХУРДАН ЭХЛЭХ
          </div>
          <h2
            class="text-3xl font-black text-zinc-900 dark:text-white tracking-tight"
          >
            Таны AI дэлгүүр
            <span class="text-primary-600 dark:text-primary-400"
              >ажиллахад бэлэн</span
            >
            байна уу?
          </h2>
          <p class="text-sm font-medium text-zinc-500 max-w-lg leading-relaxed">
            AI туслах хэрэглэгчдийн захиалгыг автоматаар авч, нэхэмжлэх
            үүсгэхийн тулд дараах 3 алхмыг дуусгах шаардлагатай:
          </p>
        </div>
        <UButton
          to="/settings?wizard=true"
          size="xl"
          class="font-black px-10 h-16 rounded-3xl shadow-2xl shadow-primary-500/20 hover:scale-105 transition-all"
        >
          <span class="material-symbols-rounded mr-2">rocket_launch</span>
          Тохиргоог эхлүүлэх
        </UButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        <!-- Step 1 -->
        <div
          class="p-6 rounded-3xl border transition-all"
          :class="
            currentStore?.facebookPageId
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : 'bg-white/50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 shadow-sm'
          "
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all"
              :class="
                currentStore?.facebookPageId
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
              "
            >
              <span class="material-symbols-rounded text-xl">{{
                currentStore?.facebookPageId ? "check" : "facebook"
              }}</span>
            </div>
            <span
              class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
              >Алхам 1</span
            >
          </div>
          <p class="font-black text-sm text-zinc-900 dark:text-white mb-1">
            Facebook холбох
          </p>
          <p class="text-[11px] font-medium text-zinc-500">
            {{
              currentStore?.facebookPageId
                ? "Амжилттай холбогдсон"
                : "Хуудаснаас захиалга авч эхлэх"
            }}
          </p>
        </div>

        <!-- Step 2 -->
        <div
          class="p-6 rounded-3xl border transition-all"
          :class="
            currentStore?.googleSheetId
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : 'bg-white/50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 shadow-sm'
          "
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all"
              :class="
                currentStore?.googleSheetId
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
              "
            >
              <span class="material-symbols-rounded text-xl">{{
                currentStore?.googleSheetId ? "check" : "leaderboard"
              }}</span>
            </div>
            <span
              class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
              >Алхам 2</span
            >
          </div>
          <p class="font-black text-sm text-zinc-900 dark:text-white mb-1">
            Барааны сан холбох
          </p>
          <p class="text-[11px] font-medium text-zinc-500">
            {{
              currentStore?.googleSheetId
                ? "Google Sheets холбогдсон"
                : "Барааны мэдээлэл болон үлдэгдэл"
            }}
          </p>
        </div>

        <!-- Step 3 -->
        <div
          class="p-6 rounded-3xl border transition-all"
          :class="
            hasProducts
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : 'bg-white/50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 shadow-sm'
          "
        >
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all"
              :class="
                hasProducts
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
              "
            >
              <span class="material-symbols-rounded text-xl">{{
                hasProducts ? "check" : "sync"
              }}</span>
            </div>
            <span
              class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
              >Алхам 3</span
            >
          </div>
          <p class="font-black text-sm text-zinc-900 dark:text-white mb-1">
            Бараа синхрончлох
          </p>
          <p class="text-[11px] font-medium text-zinc-500">
            {{
              hasProducts
                ? "Бараанууд амжилттай татагдсан"
                : "Анхны бараануудаа татаж авах"
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Orders -->
      <UCard
        class="lg:col-span-2"
        :ui="{
          body: { padding: 'p-0' },
          header: { base: 'bg-zinc-50/50 dark:bg-zinc-800/50' },
        }"
      >
        <template #header>
          <div class="flex justify-between items-center w-full min-w-0">
            <h3
              class="font-black text-[10px] sm:text-xs uppercase tracking-widest text-zinc-900 dark:text-white flex items-center min-w-0"
            >
              <div
                class="shrink-0 w-10 h-10 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 flex items-center justify-center mr-3 transition-all duration-500 group-hover:dark:ring-zinc-500"
              >
                <span
                  class="material-symbols-rounded text-xl text-zinc-600 dark:text-white transition-transform duration-500 group-hover:scale-110"
                  >list_alt</span
                >
              </div>
              <span class="truncate">Сүүлийн захиалгууд</span>
            </h3>
            <UButton
              to="/orders"
              variant="subtle"
              color="neutral"
              size="xs"
              class="font-bold rounded-full px-4 shrink-0 transition-all hover:pr-5"
            >
              <span class="hidden sm:inline">Бүгдийг харах</span>
              <span class="sm:hidden">Бүгд</span>
              <span class="material-symbols-rounded text-sm ml-1"
                >chevron_right</span
              >
            </UButton>
          </div>
        </template>

        <!-- Empty State for Table -->
        <EmptyState
          v-if="!recentOrders.length"
          icon="receipt_long"
          title="Захиалга алга байна"
          :description="
            !currentStore?.facebookPageId
              ? 'AI захиалга авч эхлэхийн тулд эхлээд Facebook хуудсаа холбоно уу.'
              : 'Messenger чатбот идэвхжсэний дараа захиалгууд энд харагдана.'
          "
        >
          <template #action v-if="!currentStore?.facebookPageId">
            <UButton
              to="/settings?wizard=true"
              color="primary"
              class="font-bold"
              >Хуудас холбох</UButton
            >
          </template>
        </EmptyState>

        <UTable v-else :data="recentOrders" :columns="orderColumns">
          <template #customer-cell="{ row }">
            <ULink
              :to="`/orders/${row.original._id}`"
              class="flex items-center gap-3 group"
            >
              <UAvatar
                :src="row.original.customer?.avatar"
                :alt="row.original.customer?.name"
                :text="row.original.customer?.name?.substring(0, 2) || 'Х'"
                size="sm"
                class="group-hover:ring-2 group-hover:ring-primary-500 transition-all"
              />
              <div class="flex flex-col">
                <span
                  class="font-bold text-zinc-900 dark:text-white text-sm group-hover:text-primary-500 transition-colors"
                  >{{ row.original.customer?.name || "Тодорхойгүй" }}</span
                >
              </div>
            </ULink>
          </template>
          <template #date-cell="{ row }">
            <span
              class="text-[11px] text-zinc-500 font-medium flex items-center"
            >
              <span class="material-symbols-rounded text-[14px] mr-1"
                >schedule</span
              >
              {{
                formatDateTime
                  ? formatDateTime(row.original.createdAt)
                  : new Date(row.original.createdAt).toLocaleString()
              }}
            </span>
          </template>
          <template #items-cell="{ row }">
            <div class="flex flex-col gap-1 max-w-[200px]">
              <div
                v-for="(item, idx) in row.original.items?.slice(0, 2)"
                :key="idx"
                class="flex items-center text-xs"
              >
                <span
                  class="truncate font-medium text-zinc-700 dark:text-zinc-300 max-w-[120px]"
                  >{{ item.itemName || "Бараа" }}</span
                >
                <span class="text-zinc-400 mx-1">x</span>
                <span class="font-bold text-primary-500">{{
                  item.quantity || 1
                }}</span>
              </div>
              <div
                v-if="row.original.items?.length > 2"
                class="text-[10px] text-zinc-400 font-medium bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded w-fit"
              >
                + цааш {{ row.original.items.length - 2 }} бараа
              </div>
              <div
                v-else-if="!row.original.items?.length"
                class="text-xs text-zinc-500"
              >
                Хоосон
              </div>
            </div>
          </template>
          <template #total-cell="{ row }">
            <span class="font-bold px-2 py-1 text-xs"
              >₮{{ row.original.totalAmount?.toLocaleString() || 0 }}</span
            >
          </template>
          <template #delivery-cell="{ row }">
            <div class="flex flex-col gap-0.5">
              <div class="flex items-center gap-1.5">
                <span
                  class="material-symbols-rounded text-sm"
                  :class="
                    row.original.hasDelivery
                      ? 'text-primary-500'
                      : 'text-zinc-400'
                  "
                >
                  {{ row.original.hasDelivery ? "local_shipping" : "store" }}
                </span>
                <span
                  class="text-xs font-bold"
                  :class="
                    row.original.hasDelivery
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-zinc-600 dark:text-zinc-300'
                  "
                >
                  {{ row.original.hasDelivery ? "Хүргэлт" : "Очиж авах" }}
                </span>
              </div>
              <span
                v-if="row.original.hasDelivery && row.original.address"
                class="text-[10px] text-zinc-500 dark:text-zinc-400 max-w-[150px] truncate leading-tight"
              >
                {{ row.original.address }}
              </span>
              <span
                v-else-if="
                  !row.original.hasDelivery && row.original.pickupAddress
                "
                class="text-[10px] text-zinc-500 dark:text-zinc-400 max-w-[150px] truncate leading-tight"
              >
                {{ row.original.pickupAddress }}
              </span>
            </div>
          </template>
          <template #status-cell="{ row }">
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <UBadge
                  size="xs"
                  variant="subtle"
                  :color="
                    row.original.status === 'completed' ? 'success' : 'warning'
                  "
                  class="font-semibold"
                >
                  {{
                    row.original.status === "completed"
                      ? "Баталгаажсан"
                      : "Хүлээгдэж байна"
                  }}
                </UBadge>
                <UBadge
                  v-if="row.original.needsReview"
                  size="xs"
                  color="error"
                  variant="solid"
                  class="text-[8px] animate-pulse"
                >
                  AI Шалгах
                </UBadge>
              </div>
            </div>
          </template>
          <template #actions-cell="{ row }">
            <div class="flex flex-col gap-2">
              <UButton
                size="xs"
                color="gray"
                variant="ghost"
                :to="`/orders/${row.original._id}`"
                class="font-bold justify-center rounded-lg w-full"
              >
                Дэлгэрэнгүй
              </UButton>

              <UButton
                v-if="row.original.status === 'pending'"
                size="xs"
                color="primary"
                variant="solid"
                class="font-black justify-center rounded-lg w-full"
                :loading="approvingId === row.original._id"
                @click="approveOrder(row.original._id)"
              >
                Батлах
              </UButton>
            </div>
          </template>
        </UTable>
      </UCard>

      <!-- Management Sidebar -->
      <div class="space-y-6">
        <!-- Catalog Control -->
        <UCard
          class="relative overflow-hidden group border-primary-500/20"
          :ui="{ body: { padding: 'p-6' } }"
        >
          <!-- Premium Background Glow -->
          <div
            class="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/10 rounded-full blur-[60px] group-hover:bg-primary-500/20 transition-all duration-700"
          ></div>

          <header class="flex justify-between items-start mb-6">
            <div class="space-y-1">
              <h3
                class="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"
                ></span>
                Каталог холболт
              </h3>
              <p
                class="text-xl font-bold text-zinc-900 dark:text-white tracking-tight"
              >
                Хэвийн
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
            >
              <span class="material-symbols-rounded text-xl">database</span>
            </div>
          </header>

          <div class="space-y-3 mb-6">
            <div
              class="flex items-center justify-between text-[11px] font-bold"
            >
              <span class="text-zinc-500 uppercase tracking-tighter"
                >Нийт бараа</span
              >
              <span class="text-zinc-900 dark:text-zinc-100">{{
                data?.data?.productCount || "0"
              }}</span>
            </div>
          </div>

          <UButton
            block
            size="lg"
            color="primary"
            @click="syncFromSheets"
            :loading="syncing"
          >
            <span class="material-symbols-rounded text-lg mr-2">sync_alt</span>
            Каталог шинэчлэх
          </UButton>
        </UCard>

        <!-- Operational Shortcuts -->
        <UCard :ui="{ body: { padding: 'p-6' } }">
          <h3
            class="font-black text-xs uppercase tracking-widest text-zinc-900 dark:text-white mb-4 flex items-center"
          >
            <div
              class="w-10 h-10 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 flex items-center justify-center mr-3"
            >
              <span
                class="material-symbols-rounded text-xl text-zinc-600 dark:text-white"
                >bolt</span
              >
            </div>
            Хурдан үйлдэл
          </h3>
          <div class="grid grid-cols-1 gap-2">
            <UButton
              to="/inbox"
              variant="soft"
              color="primary"
              class="justify-start h-12 px-4 rounded-xl group"
            >
              <span
                class="material-symbols-rounded text-lg mr-3 group-hover:scale-110 transition-transform"
                >chat</span
              >
              <span class="text-[11px] font-black uppercase tracking-widest"
                >Чат нээх</span
              >
            </UButton>

            <UButton
              to="/orders"
              variant="soft"
              color="gray"
              class="justify-start h-12 px-4 rounded-xl group"
            >
              <span
                class="material-symbols-rounded text-lg mr-3 group-hover:scale-110 transition-transform"
                >add_shopping_cart</span
              >
              <span class="text-[11px] font-black uppercase tracking-widest"
                >Захиалга харах</span
              >
            </UButton>

            <UButton
              to="/settings"
              variant="soft"
              color="gray"
              class="justify-start h-12 px-4 rounded-xl group"
            >
              <span
                class="material-symbols-rounded text-lg mr-3 group-hover:scale-110 transition-transform"
                >settings</span
              >
              <span class="text-[11px] font-black uppercase tracking-widest"
                >Тохиргоо</span
              >
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const { user, token } = useAuth();
const { selectedStoreId, currentStore } = useStore();

const isFullyConfigured = computed(() => {
  const hasProducts = parseInt(data.value?.data?.productCount || "0") > 0;
  return (
    currentStore.value?.facebookPageId &&
    currentStore.value?.googleSheetId &&
    hasProducts
  );
});

const hasProducts = computed(
  () => parseInt(data.value?.data?.productCount || "0") > 0,
);

const rangeOptions = [
  { label: "Өнөөдөр", value: "today" },
  { label: "Өчигдөр", value: "yesterday" },
  { label: "Сүүлийн 7 хоног", value: "last7" },
  { label: "Сүүлийн 30 хоног", value: "last30" },
  { label: "Энэ сар", value: "thisMonth" },
];

const selectedRange = ref(rangeOptions[0]); // Default to today

const dateRange = computed(() => {
  const now = new Date();
  const start = new Date();
  let end = new Date();

  switch (selectedRange.value.value) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "yesterday":
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case "last7":
      start.setDate(now.getDate() - 7);
      break;
    case "last30":
      start.setDate(now.getDate() - 30);
      break;
    case "thisMonth":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
  }

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
});

const { data, pending, error, refresh } = await useFetch(
  () => {
    const params = new URLSearchParams();
    if (selectedStoreId.value) params.append("storeId", selectedStoreId.value);
    if (dateRange.value.startDate)
      params.append("startDate", dateRange.value.startDate);
    if (dateRange.value.endDate)
      params.append("endDate", dateRange.value.endDate);

    return `${config.public.apiBase}/stats?${params.toString()}`;
  },
  {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    watch: [selectedStoreId, selectedRange],
  },
);

const stats = computed(
  () =>
    data.value?.data?.stats || [
      { label: "Нийт борлуулалт", value: "₮0", icon: "payments", trend: 0 },
      { label: "Захиалгын тоо", value: "0", icon: "receipt_long", trend: 0 },
      { label: "AI Баталгаажуулт", value: "0%", icon: "smart_toy", trend: 0 },
      { label: "Шинэ хэрэглэгч", value: "0", icon: "group", trend: 0 },
    ],
);

const recentOrders = computed(() => data.value?.data?.recentOrders || []);

const orderColumns = [
  { accessorKey: "customer", header: "Хэрэглэгч" },
  { accessorKey: "date", header: "Огноо" },
  { accessorKey: "items", header: "Бараа" },
  { accessorKey: "total", header: "Дүн" },
  { accessorKey: "delivery", header: "Хүргэлт" },
  { accessorKey: "status", header: "Төлөв" },
  { accessorKey: "actions", header: "Үйлдэл" },
];

const toast = useToast();
const approvingId = ref(null);
const syncing = ref(false);

const syncFromSheets = async () => {
  if (!selectedStoreId.value) {
    toast.add({
      title: "Мэдэгдэл",
      description: "Бараа шинэчлэхийн тулд эхлээд дэлгүүрээ сонгоно уу.",
      color: "amber",
    });
    return;
  }

  syncing.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/sync/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: { storeId: selectedStoreId.value },
    });

    if (response.success) {
      toast.add({
        title: "Шинэчлэлт дууслаа",
        description: `Барааны мэдээлэл Google Sheets-ээс амжилттай шинэчлэгдлээ.`,
        color: "green",
      });
      refresh();
    }
  } catch (error) {
    console.error("Sync failed:", error);
    toast.add({
      title: "Алдаа",
      description: error.data?.message || "Шинэчлэхэд алдаа гарлаа.",
      color: "red",
    });
  } finally {
    syncing.value = false;
  }
};

const approveOrder = async (id) => {
  approvingId.value = id;
  try {
    const response = await $fetch(
      `${config.public.apiBase}/orders/${id}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    );

    if (response.success) {
      toast.add({
        title: "Амжилттай",
        description: "Захиалга баталгаажиж, Google Sheets рүү илгээгдлэв.",
        color: "green",
      });
      refresh();
    }
  } catch (error) {
    console.error("Approval failed:", error);
    toast.add({
      title: "Алдаа",
      description: error.data?.message || "Баталгаажуулахад алдаа гарлаа.",
      color: "red",
    });
  } finally {
    approvingId.value = null;
  }
};

const checkingPaymentId = ref(null);

const checkPayment = async (id) => {
  checkingPaymentId.value = id;
  try {
    const response = await $fetch(
      `${config.public.apiBase}/orders/${id}/check-payment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    );

    if (response.success) {
      toast.add({
        title: "Төлбөр",
        description: response.message,
        color: "green",
      });
      refresh();
    } else {
      toast.add({
        title: "Төлөөгүй байна",
        description: response.message,
        color: "amber",
      });
    }
  } catch (error) {
    console.error("Payment check failed:", error);
    toast.add({
      title: "Алдаа",
      description: error.data?.message || "Төлбөр шалгахад алдаа гарлаа.",
      color: "red",
    });
  } finally {
    checkingPaymentId.value = null;
  }
};

const showSoonToast = (feature) => {
  toast.add({
    title: "Түр хугацаанд",
    description: `${feature} функц удахгүй орох болно. `,
    icon: "i-lucide-clock",
    color: "primary",
  });
};
</script>
