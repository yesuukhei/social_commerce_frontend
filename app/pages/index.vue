<template>
  <div class="space-y-8">
    <WelcomeBanner
      name="Админ"
      description="Таны AI туслах өнөөдөр захиалгуудыг автоматаар боловсруулахад бэлэн байна. Системийн төлөв хэвийн, бүх холболтууд идэвхтэй байна."
    />

    <!-- Loading State -->
    <div
      v-if="pending"
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
            class="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full animate-pulse w-1/2"
          ></div>
          <div
            class="h-8 bg-neutral-100 dark:bg-neutral-800 rounded-full animate-pulse w-2/3"
          ></div>
          <div
            class="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full animate-pulse w-1/3"
          ></div>
        </div>
      </UCard>
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
          header: { base: 'bg-slate-50/50 dark:bg-slate-900/50' },
        }"
      >
        <template #header>
          <div class="flex justify-between items-center w-full min-w-0">
            <h3
              class="font-black text-[10px] sm:text-xs uppercase tracking-widest text-neutral-900 dark:text-white flex items-center min-w-0"
            >
              <div
                class="shrink-0 w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mr-3"
              >
                <span
                  class="material-symbols-rounded text-sm text-neutral-500 dark:text-neutral-400"
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
          description="Messenger чатбот идэвхжсэний дараа захиалгууд энд харагдана."
        />

        <UTable v-else :data="recentOrders" :columns="orderColumns">
          <template #id-cell="{ row }">
            <span class="font-mono text-xs text-slate-400">{{
              row.original.id
            }}</span>
          </template>
          <template #customer-cell="{ row }">
            <span class="font-semibold text-slate-700 dark:text-slate-200">{{
              row.original.customer
            }}</span>
          </template>
          <template #total-cell="{ row }">
            <span class="font-bold text-slate-900 dark:text-white"
              >₮{{ row.original.total }}</span
            >
          </template>
          <template #status-cell="{ row }">
            <UBadge
              size="xs"
              variant="subtle"
              :color="
                row.original.status === 'Хүргэгдсэн'
                  ? 'success'
                  : row.original.status === 'Хүлээгдэж байна'
                    ? 'warning'
                    : 'neutral'
              "
              class="font-semibold"
            >
              {{ row.original.status }}
            </UBadge>
          </template>
        </UTable>
      </UCard>

      <!-- Quick Actions -->
      <div class="space-y-6">
        <UCard :ui="{ body: { padding: 'p-6' } }">
          <!-- Premium Background Glow -->
          <div
            class="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/10 rounded-full blur-[60px] group-hover:bg-primary-500/20 transition-all duration-700"
          ></div>

          <header class="flex justify-between items-start mb-6">
            <div class="space-y-1">
              <h3
                class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 flex items-center"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 animate-pulse"
                ></span>
                AI Систем
              </h3>
              <p
                class="text-xl font-bold text-neutral-900 dark:text-white tracking-tight"
              >
                Хэвийн
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-primary-500 dark:text-primary-400 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300"
            >
              <span class="material-symbols-rounded">smart_toy</span>
            </div>
          </header>

          <div class="space-y-4 mb-8">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-rounded text-sm text-success-500"
                  >check_circle</span
                >
              </div>
              <div>
                <p
                  class="text-[11px] font-bold text-neutral-700 dark:text-neutral-300"
                >
                  Google Sheets Холболт
                </p>
                <p
                  class="text-[10px] text-neutral-500 uppercase font-black tracking-tighter"
                >
                  Амжилттай холбогдсон
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-rounded text-sm text-neutral-500"
                  >history</span
                >
              </div>
              <div>
                <p
                  class="text-[11px] font-bold text-neutral-700 dark:text-neutral-300"
                >
                  Синхрончлол
                </p>
                <p
                  class="text-[10px] text-neutral-500 uppercase font-black tracking-tighter"
                >
                  Сүүлд: 14 минутын өмнө
                </p>
              </div>
            </div>
          </div>

          <UButton
            block
            size="lg"
            color="primary"
            class="font-black !rounded-full py-4 shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30 transition-all active:scale-[0.98]"
          >
            <span
              class="material-symbols-rounded text-lg mr-2 group-hover:rotate-180 transition-transform duration-500"
              >sync</span
            >
            Бараа шинэчлэх
          </UButton>
        </UCard>

        <UCard :ui="{ body: { padding: 'p-6' } }">
          <h3
            class="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white mb-4 flex items-center"
          >
            <div
              class="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mr-3"
            >
              <span
                class="material-symbols-rounded text-sm text-neutral-500 dark:text-neutral-400"
                >bolt</span
              >
            </div>
            Хурдан холбоос
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <UButton
              variant="outline"
              color="gray"
              class="flex-col h-20 group relative overflow-hidden"
              @click="showSoonToast('Чат')"
            >
              <div
                class="absolute top-1 right-1 px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md text-[7px] font-black uppercase tracking-tighter text-neutral-400 group-hover:text-primary-500 transition-colors"
              >
                Тун удахгүй
              </div>
              <div
                class="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2 group-hover:bg-primary-500/10 transition-colors"
              >
                <span
                  class="material-symbols-rounded text-xl text-neutral-500 dark:text-neutral-400 group-hover:text-primary-500 group-hover:scale-110 transition-all"
                  >forum</span
                >
              </div>
              <span class="text-xs font-semibold">Чатаар</span>
            </UButton>
            <UButton
              variant="outline"
              color="gray"
              class="flex-col h-20 group relative overflow-hidden"
              @click="showSoonToast('Тайлан')"
            >
              <div
                class="absolute top-1 right-1 px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md text-[7px] font-black uppercase tracking-tighter text-neutral-400 group-hover:text-primary-500 transition-colors"
              >
                Тун удахгүй
              </div>
              <div
                class="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2 group-hover:bg-primary-500/10 transition-colors"
              >
                <span
                  class="material-symbols-rounded text-xl text-neutral-500 dark:text-neutral-400 group-hover:text-primary-500 group-hover:scale-110 transition-all"
                  >analytics</span
                >
              </div>
              <span class="text-xs font-semibold">Тайлан</span>
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const { data, pending, error, refresh } = await useFetch(
  `${config.public.apiBase}/stats`,
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
  { accessorKey: "id", header: "ID" },
  { accessorKey: "customer", header: "Хэрэглэгч" },
  { accessorKey: "items", header: "Бараа" },
  { accessorKey: "total", header: "Дүн" },
  { accessorKey: "status", header: "Төлөв" },
];

const toast = useToast();

const showSoonToast = (feature) => {
  toast.add({
    title: "Түр хугацаанд",
    description: `${feature} функц удахгүй орох болно. `,
    icon: "i-lucide-clock",
    color: "primary",
  });
};
</script>
