<template>
  <div class="space-y-6">
    <!-- Top Header & Breadcrumbs -->
    <header
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div class="space-y-1">
        <div
          class="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-widest"
        >
          <ULink to="/orders" class="hover:text-primary-500 transition-colors"
            >Захиалга</ULink
          >
          <span class="material-symbols-rounded text-xs">chevron_right</span>
          <span class="text-zinc-900 dark:text-white">Дэлгэрэнгүй</span>
        </div>
        <h1
          class="text-2xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-3"
        >
          ID: #{{ id.slice(-6).toUpperCase() }}
          <UBadge
            size="sm"
            variant="subtle"
            :color="order?.status === 'completed' ? 'success' : 'warning'"
            class="font-black uppercase tracking-tighter"
          >
            {{
              order?.status === "completed" ? "Баталгаажсан" : "Хүлээгдэж буй"
            }}
          </UBadge>
        </h1>
      </div>
      <div class="flex gap-3">
        <UButton
          v-if="order?.status === 'pending'"
          color="primary"
          variant="solid"
          class="font-black px-6 rounded-full shadow-lg shadow-primary-500/20"
          :loading="approving"
          @click="approveOrder"
        >
          <span class="material-symbols-rounded text-lg mr-2"
            >check_circle</span
          >
          Баталгаажуулах
        </UButton>
        <UButton
          variant="outline"
          color="gray"
          class="font-bold rounded-full"
          @click="refresh"
        >
          <span class="material-symbols-rounded text-lg">refresh</span>
        </UButton>
      </div>
    </header>

    <div
      v-if="pending"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]"
    >
      <UCard class="lg:col-span-4 animate-pulse" />
      <UCard class="lg:col-span-5 animate-pulse" />
      <UCard class="lg:col-span-3 animate-pulse" />
    </div>

    <div
      v-else-if="order"
      class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
    >
      <!-- 1. LEFT COLUMN: Order Items & Financials -->
      <div class="lg:col-span-4 space-y-6">
        <UCard :ui="{ header: { padding: 'p-4' }, body: { padding: 'p-0' } }">
          <template #header>
            <h3
              class="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"
            >
              <span class="material-symbols-rounded text-sm">receipt_long</span>
              Барааны жагсаалт
            </h3>
          </template>

          <div class="divide-y divide-zinc-100 dark:divide-zinc-800">
            <div
              v-for="(item, idx) in order.items"
              :key="idx"
              class="p-4 flex justify-between items-start group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div class="space-y-0.5">
                <p class="text-sm font-bold text-zinc-900 dark:text-white">
                  {{ item.itemName }}
                </p>
                <p
                  class="text-[10px] font-black text-zinc-400 uppercase tracking-tighter"
                >
                  ₮{{ item.price?.toLocaleString() }} × {{ item.quantity }}
                </p>
              </div>
              <p class="text-sm font-black text-zinc-900 dark:text-white">
                ₮{{ (item.price * item.quantity).toLocaleString() }}
              </p>
            </div>
          </div>

          <div
            class="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-b-xl border-t border-zinc-100 dark:border-zinc-800 space-y-2"
          >
            <div
              class="flex justify-between text-[11px] font-bold text-zinc-500"
            >
              <span>Нийт дүн</span>
              <span>₮{{ order.totalAmount?.toLocaleString() }}</span>
            </div>
            <div
              class="flex justify-between text-lg font-black text-zinc-900 dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-700"
            >
              <span>Төлөх дүн</span>
              <span class="text-primary-500"
                >₮{{ order.totalAmount?.toLocaleString() }}</span
              >
            </div>
          </div>
        </UCard>

        <!-- Payment Info Card -->
        <UCard
          :ui="{ body: { padding: 'p-5' } }"
          class="bg-primary-500/2 border-primary-500/10"
        >
          <h3
            class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2"
          >
            <span class="material-symbols-rounded text-sm">payments</span>
            Төлбөр
          </h3>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center border border-zinc-100 dark:border-zinc-700"
              >
                <img
                  v-if="order.paymentMethod === 'qpay'"
                  src="https://qpay.mn/logo.png"
                  class="w-6 h-6 grayscale opacity-50"
                />
                <span v-else class="material-symbols-rounded text-zinc-400"
                  >account_balance</span
                >
              </div>
              <div>
                <p
                  class="text-xs font-black text-zinc-900 dark:text-white uppercase"
                >
                  {{ order.paymentMethod || "Бэлнээр" }}
                </p>
                <p
                  class="text-[10px] font-bold"
                  :class="
                    order.paymentStatus === 'paid'
                      ? 'text-emerald-500'
                      : 'text-amber-500'
                  "
                >
                  {{
                    order.paymentStatus === "paid"
                      ? "Төлөгдсөн"
                      : "Төлбөр хүлээгдэж буй"
                  }}
                </p>
              </div>
            </div>
            <UButton
              v-if="
                order.paymentStatus !== 'paid' && order.paymentMethod === 'qpay'
              "
              size="xs"
              variant="soft"
              color="blue"
              class="font-black"
              :loading="checkingPayment"
              @click="checkPayment"
              >Шалгах</UButton
            >
          </div>

          <div
            v-if="order.paymentDetails?.qrCode"
            class="flex flex-col items-center p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700"
          >
            <img :src="order.paymentDetails.qrCode" class="w-40 h-40 mb-3" />
            <p
              class="text-[9px] font-black text-zinc-400 uppercase text-center leading-relaxed"
            >
              Инвойс ID: {{ order.paymentDetails.invoiceId }}<br />
              QPay QR кодоор төлбөр шалгах
            </p>
          </div>
        </UCard>
      </div>

      <!-- 2. MIDDLE COLUMN: Contextual Chat -->
      <div class="lg:col-span-5 h-[700px] flex flex-col">
        <UCard
          class="flex-1 overflow-hidden"
          :ui="{ body: { padding: 'p-0 h-full flex flex-col' } }"
        >
          <template #header>
            <div class="flex justify-between items-center -m-1">
              <h3
                class="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"
              >
                <span class="material-symbols-rounded text-sm">forum</span>
                Чатны түүх
              </h3>
              <UBadge
                v-if="order.conversation?.currentIntent"
                size="xs"
                color="primary"
                variant="soft"
                class="font-black text-[9px] uppercase"
              >
                {{ order.conversation.currentIntent }}
              </UBadge>
            </div>
          </template>

          <div
            ref="messageContainer"
            class="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/30 dark:bg-zinc-950/20 custom-scrollbar"
          >
            <div
              v-if="!order.conversation?.messages?.length"
              class="h-full flex flex-col items-center justify-center opacity-30"
            >
              <span class="material-symbols-rounded text-4xl mb-2"
                >speaker_notes_off</span
              >
              <p class="text-xs font-bold">Мессеж олдсонгүй</p>
            </div>

            <div
              v-for="(msg, i) in order.conversation?.messages"
              :key="i"
              class="flex flex-col"
              :class="[msg.sender === 'customer' ? 'items-start' : 'items-end']"
            >
              <div
                class="max-w-[85%] px-3 py-2 rounded-2xl text-[13px] font-medium shadow-sm transition-all"
                :class="[
                  msg.sender === 'customer'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tl-none border border-zinc-100 dark:border-zinc-700'
                    : 'bg-primary-500 text-white rounded-tr-none',
                ]"
              >
                {{ msg.text }}
              </div>
              <span
                class="text-[8px] font-bold text-zinc-400 mt-1 uppercase tracking-tighter px-1"
              >
                {{ formatDate(msg.timestamp) }}
              </span>
            </div>
          </div>

          <footer class="p-4 border-t border-zinc-100 dark:border-zinc-800">
            <div class="flex gap-2">
              <UInput
                v-model="adminMessage"
                placeholder="Хариу бичих..."
                class="flex-1"
                variant="none"
                :ui="{
                  wrapper: 'bg-zinc-100 dark:bg-zinc-800 rounded-xl px-2',
                }"
                @keydown.enter="sendAdminMessage"
              />
              <UButton
                color="primary"
                icon="material-symbols:send"
                class="rounded-xl shadow-lg shadow-primary-500/10"
                :loading="sending"
                @click="sendAdminMessage"
              />
            </div>
          </footer>
        </UCard>
      </div>

      <!-- 3. RIGHT COLUMN: Logistics & Identity -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Customer Details -->
        <UCard :ui="{ body: { padding: 'p-5' } }">
          <h3
            class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2"
          >
            <span class="material-symbols-rounded text-sm">person</span>
            Хэрэглэгч
          </h3>
          <div class="flex items-center gap-4 mb-6">
            <UAvatar
              :src="order.customer?.avatar"
              :alt="order.customer?.name"
              :text="order.customer?.name?.substring(0, 2)"
              size="lg"
              class="ring-4 ring-primary-500/10"
            />
            <div class="min-w-0">
              <p
                class="text-base font-black text-zinc-900 dark:text-white truncate"
              >
                {{ order.customer?.name }}
              </p>
              <p
                class="text-[10px] font-bold text-zinc-500 truncate uppercase tracking-tighter"
              >
                ID: {{ order.customer?.facebookId }}
              </p>
            </div>
          </div>

          <div
            class="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800"
          >
            <div class="flex items-center gap-3">
              <span class="material-symbols-rounded text-lg text-zinc-400"
                >call</span
              >
              <p class="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                {{ order.phoneNumber || "---" }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span class="material-symbols-rounded text-lg text-zinc-400"
                >location_on</span
              >
              <p
                class="text-xs font-bold text-zinc-700 dark:text-zinc-300 leading-relaxed"
              >
                {{ order.address || "Хаяг тодорхойгүй" }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- AI Extraction Insight -->
        <UCard
          :ui="{ body: { padding: 'p-5' } }"
          class="border-amber-500/20 bg-amber-500/1"
        >
          <h3
            class="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600/60 mb-4 flex items-center gap-2"
          >
            <span class="material-symbols-rounded text-sm">psychology</span>
            AI Insights
          </h3>
          <div class="space-y-3">
            <div
              class="flex justify-between items-center text-[11px] font-bold"
            >
              <span class="text-zinc-500">Нарийвчлал</span>
              <span
                :class="
                  order.aiExtraction?.confidence > 0.8
                    ? 'text-emerald-500'
                    : 'text-amber-500'
                "
              >
                {{ (order.aiExtraction?.confidence * 100).toFixed(1) }}%
              </span>
            </div>
            <div
              class="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden"
            >
              <div
                class="h-full bg-amber-500 rounded-full transition-all duration-1000"
                :style="{ width: `${order.aiExtraction?.confidence * 100}%` }"
              ></div>
            </div>
            <p
              v-if="order.aiExtraction?.needsReview"
              class="text-[10px] font-bold text-amber-600 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg flex items-start gap-2"
            >
              <span class="material-symbols-rounded text-sm shrink-0"
                >warning</span
              >
              Админы хяналт шаардлагатай: Хаяг эсвэл дугаар бүрэн бус байх
              магадлалтай.
            </p>
          </div>
        </UCard>

        <!-- Store Context -->
        <div class="px-5">
          <p
            class="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"
          >
            <span class="material-symbols-rounded text-xs">store</span>
            {{ order.store?.name }}
          </p>
          <p class="text-[9px] text-zinc-500 font-bold mt-1">
            Огноо: {{ formatDate(order.createdAt) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const id = route.params.id;
const config = useRuntimeConfig();
const { token } = useAuth();
const toast = useToast();

const adminMessage = ref("");
const sending = ref(false);
const approving = ref(false);
const checkingPayment = ref(false);
const messageContainer = ref(null);

// Fetch order details
const { data, pending, refresh } = await useFetch(
  `${config.public.apiBase}/orders/${id}`,
  {
    headers: { Authorization: `Bearer ${token.value}` },
  },
);

const order = computed(() => data.value?.data);

const sendAdminMessage = async () => {
  if (
    !adminMessage.value.trim() ||
    sending.value ||
    !order.value?.conversation?._id
  )
    return;

  sending.value = true;
  try {
    const res = await $fetch(
      `${config.public.apiBase}/conversations/${order.value.conversation._id}/message`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: { text: adminMessage.value },
      },
    );

    if (res.success) {
      adminMessage.value = "";
      await refresh();
      nextTick(() => scrollToBottom());
    }
  } catch (err) {
    toast.add({ title: "Алдаа", description: err.data?.message, color: "red" });
  } finally {
    sending.value = false;
  }
};

const approveOrder = async () => {
  approving.value = true;
  try {
    const res = await $fetch(`${config.public.apiBase}/orders/${id}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token.value}` },
    });
    if (res.success) {
      toast.add({
        title: "Амжилттай",
        description: "Захиалга баталгаажлаа",
        color: "green",
      });
      refresh();
    }
  } catch (err) {
    toast.add({ title: "Алдаа", description: err.data?.message, color: "red" });
  } finally {
    approving.value = null;
  }
};

const checkPayment = async () => {
  checkingPayment.value = true;
  try {
    const res = await $fetch(
      `${config.public.apiBase}/orders/${id}/check-payment`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
      },
    );
    if (res.success) {
      toast.add({ title: "Төлбөр", description: res.message, color: "green" });
      refresh();
    } else {
      toast.add({
        title: "Сонордуулга",
        description: res.message,
        color: "amber",
      });
    }
  } catch (err) {
    toast.add({ title: "Алдаа", description: err.data?.message, color: "red" });
  } finally {
    checkingPayment.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("mn-MN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

onMounted(() => {
  if (order.value) nextTick(() => scrollToBottom());
});

watch(order, (newVal) => {
  if (newVal) nextTick(() => scrollToBottom());
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e4e4e7;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #27272a;
}
</style>
