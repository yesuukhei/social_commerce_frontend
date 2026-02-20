<template>
  <div class="space-y-8">
    <WelcomeBanner
      :name="user?.name"
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
          description="Messenger чатбот идэвхжсэний дараа захиалгууд энд харагдана."
        />

        <UTable v-else :data="recentOrders" :columns="orderColumns">
          <template #customer-cell="{ row }">
            <div class="flex items-center gap-3">
              <UAvatar
                :src="row.original.customer?.avatar"
                :alt="row.original.customer?.name"
                :text="row.original.customer?.name?.substring(0, 2) || 'Х'"
                size="sm"
              />
              <div class="flex flex-col">
                <span class="font-bold text-zinc-900 dark:text-white text-sm">{{
                  row.original.customer?.name || "Тодорхойгүй"
                }}</span>
                <span class="text-[10px] text-zinc-500 font-medium"
                  >FB: {{ row.original.customer?.facebookId || "---" }}</span
                >
              </div>
            </div>
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
            <span
              class="font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-md text-xs border border-green-200 dark:border-green-800"
              >₮{{ row.original.totalAmount?.toLocaleString() || 0 }}</span
            >
          </template>
          <template #status-cell="{ row }">
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <UBadge
                  size="xs"
                  variant="subtle"
                  :color="
                    row.original.status === 'completed' ||
                    row.original.status === 'confirmed'
                      ? 'success'
                      : row.original.status === 'pending'
                        ? 'warning'
                        : 'zinc'
                  "
                  class="font-semibold"
                >
                  {{ row.original.statusLabel }}
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
              <!-- Payment Status Badge (Small) -->
              <div class="flex items-center gap-1">
                <div
                  class="w-1 h-1 rounded-full"
                  :class="
                    row.original.paymentStatus === 'paid'
                      ? 'bg-success-500'
                      : 'bg-warning-500'
                  "
                ></div>
                <span
                  class="text-[9px] font-bold uppercase tracking-tighter text-zinc-500"
                >
                  {{
                    row.original.paymentStatus === "paid"
                      ? "Төлөгдсөн"
                      : "Төлбөр хүлээгдэж буй"
                  }}
                </span>
              </div>
            </div>
          </template>
          <template #actions-cell="{ row }">
            <div class="flex flex-col gap-2">
              <UButton
                v-if="
                  (row.original.status === 'pending' ||
                    row.original.status === 'confirmed') &&
                  row.original.paymentMethod === 'qpay' &&
                  row.original.paymentStatus !== 'paid'
                "
                size="xs"
                color="blue"
                variant="soft"
                class="font-black justify-center rounded-lg w-full"
                :loading="checkingPaymentId === row.original._id"
                @click="checkPayment(row.original._id)"
              >
                Төлбөр шалгах
              </UButton>
              <UButton
                v-if="
                  row.original.status === 'pending' ||
                  row.original.status === 'confirmed'
                "
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

      <!-- Quick Actions -->
      <div class="space-y-6">
        <UCard
          class="relative overflow-hidden"
          :ui="{ body: { padding: 'p-6' } }"
        >
          <!-- Premium Background Glow -->
          <div
            class="absolute -right-10 -top-10 w-40 h-40 bg-primary-500/10 rounded-full blur-[60px] group-hover:bg-primary-500/20 transition-all duration-700"
          ></div>

          <header class="flex justify-between items-start mb-6">
            <div class="space-y-1">
              <h3
                class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 flex items-center"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 animate-pulse"
                ></span>
                AI Систем
              </h3>
              <p
                class="text-xl font-bold text-zinc-900 dark:text-white tracking-tight"
              >
                Хэвийн
              </p>
            </div>
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 group-hover:dark:ring-zinc-500 text-primary-500 dark:text-primary-400 group-hover:bg-primary-500 group-hover:text-white"
            >
              <span
                class="material-symbols-rounded text-xl transition-transform duration-500 group-hover:scale-110"
                >smart_toy</span
              >
            </div>
          </header>

          <div class="space-y-4 mb-8">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-rounded text-sm text-success-500"
                  >check_circle</span
                >
              </div>
              <div>
                <p
                  class="text-[11px] font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Google Sheets Холболт
                </p>
                <p
                  class="text-[10px] text-zinc-500 uppercase font-black tracking-tighter"
                >
                  Амжилттай холбогдсон
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0"
              >
                <span class="material-symbols-rounded text-sm text-zinc-500"
                  >history</span
                >
              </div>
              <div>
                <p
                  class="text-[11px] font-bold text-zinc-700 dark:text-zinc-300"
                >
                  Синхрончлол
                </p>
                <p
                  class="text-[10px] text-zinc-500 uppercase font-black tracking-tighter"
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
            class="font-black text-xs uppercase tracking-widest text-zinc-900 dark:text-white mb-4 flex items-center"
          >
            <div
              class="w-10 h-10 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 flex items-center justify-center mr-3 transition-all duration-500 group-hover:dark:ring-zinc-500"
            >
              <span
                class="material-symbols-rounded text-xl text-zinc-600 dark:text-white transition-transform duration-500 group-hover:scale-110"
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
                class="absolute top-1 right-1 px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-[7px] font-black uppercase tracking-tighter text-zinc-400 group-hover:text-primary-500 transition-colors"
              >
                Тун удахгүй
              </div>
              <div
                class="w-10 h-10 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 flex items-center justify-center mb-2 group-hover:bg-primary-500/10 transition-all duration-500 group-hover:dark:ring-zinc-500"
              >
                <span
                  class="material-symbols-rounded text-xl text-zinc-500 dark:text-zinc-400 group-hover:text-primary-500 group-hover:scale-110 transition-all duration-500"
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
                class="absolute top-1 right-1 px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-[7px] font-black uppercase tracking-tighter text-zinc-400 group-hover:text-primary-500 transition-colors"
              >
                Тун удахгүй
              </div>
              <div
                class="w-10 h-10 rounded-2xl bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 flex items-center justify-center mb-2 group-hover:bg-primary-500/10 transition-all duration-500 group-hover:dark:ring-zinc-500"
              >
                <span
                  class="material-symbols-rounded text-xl text-zinc-500 dark:text-zinc-400 group-hover:text-primary-500 group-hover:scale-110 transition-all duration-500"
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
const { user } = useAuth();
const { token } = useAuth();
const { data, pending, error, refresh } = await useFetch(
  `${config.public.apiBase}/stats`,
  {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
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
  { accessorKey: "status", header: "Төлөв" },
  { accessorKey: "actions", header: "Үйлдэл" },
];

const toast = useToast();
const approvingId = ref(null);

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
