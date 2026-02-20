<template>
  <div class="space-y-8">
    <header
      class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4"
    >
      <div>
        <h1
          class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white"
        >
          Захиалга
        </h1>
        <p class="text-sm text-zinc-500 font-medium mt-2">
          Бүх цаг үеийн захиалгын түүх
        </p>
      </div>
      <div class="flex gap-3">
        <UButton variant="outline" color="gray" class="font-semibold">
          <span class="material-symbols-rounded text-lg mr-2">filter_list</span>
          Шүүлтүүр
        </UButton>
        <UButton variant="outline" color="gray" class="font-semibold">
          <span class="material-symbols-rounded text-lg mr-2">download</span>
          Экспорт
        </UButton>
      </div>
    </header>

    <!-- Loading State -->
    <UCard v-if="pending" :ui="{ body: { padding: 'p-0' } }">
      <div class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="flex gap-4 items-center">
          <div
            class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-16"
          ></div>
          <div
            class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-24"
          ></div>
          <div
            class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse flex-1"
          ></div>
          <div
            class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-20"
          ></div>
          <div
            class="h-6 bg-zinc-100 dark:bg-zinc-800 rounded-full animate-pulse w-24"
          ></div>
        </div>
      </div>
    </UCard>

    <!-- Empty State -->
    <UCard v-else-if="!orders.length" :ui="{ body: { padding: 'p-0' } }">
      <EmptyState
        icon="shopping_cart"
        title="Захиалга бүртгэгдээгүй"
        description="Хэрэглэгчид Messenger-ээр захиалга өгөхөд энд автоматаар бүртгэгдэнэ."
      >
        <template #action>
          <UButton
            to="/settings"
            variant="outline"
            color="gray"
            class="font-semibold"
          >
            <span class="material-symbols-rounded text-lg mr-2">settings</span>
            Тохиргоо руу очих
          </UButton>
        </template>
      </EmptyState>
    </UCard>

    <!-- Orders Table -->
    <UCard v-else :ui="{ body: { padding: 'p-0' } }">
      <UTable :data="orders" :columns="columns">
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
              <span class="text-[10px] text-zinc-500 font-medium"
                >FB: {{ row.original.customer?.facebookId || "---" }}</span
              >
            </div>
          </ULink>
        </template>
        <template #date-cell="{ row }">
          <span class="text-[11px] text-zinc-500 font-medium flex items-center">
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
          <span class="font-bold px-2 py-1 rounded-md text-xs"
            >₮{{ row.original.totalAmount?.toLocaleString() || 0 }}</span
          >
        </template>
        <template #status-cell="{ row }">
          <UBadge
            size="xs"
            variant="subtle"
            :color="row.original.status === 'completed' ? 'success' : 'warning'"
            class="font-semibold"
          >
            {{
              row.original.status === "completed"
                ? "Баталгаажсан"
                : "Хүлээгдэж байна"
            }}
          </UBadge>
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
              class="text-[10px] text-zinc-500 dark:text-zinc-400 max-w-[160px] truncate leading-tight"
            >
              {{ row.original.address }}
            </span>
            <span
              v-else-if="
                !row.original.hasDelivery && row.original.pickupAddress
              "
              class="text-[10px] text-zinc-500 dark:text-zinc-400 max-w-[160px] truncate leading-tight"
            >
              {{ row.original.pickupAddress }}
            </span>
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
              v-if="
                row.original.status === 'pending' &&
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
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const { token } = useAuth();
const { selectedStoreId } = useStore();

const { data, pending, error, refresh } = await useFetch(
  () => {
    let url = `${config.public.apiBase}/orders`;
    if (selectedStoreId.value) {
      url += `?storeId=${selectedStoreId.value}`;
    }
    return url;
  },
  {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    watch: [selectedStoreId],
  },
);

const orders = computed(() => data.value?.orders || []);

const columns = [
  { accessorKey: "customer", header: "Хэрэглэгч" },
  { accessorKey: "date", header: "Огноо" },
  { accessorKey: "items", header: "Бараа" },
  { accessorKey: "total", header: "Дүн" },
  { accessorKey: "delivery", header: "Хүргэлт" },
  { accessorKey: "status", header: "Төлөв" },
  { accessorKey: "actions", header: "Үйлдэл" },
];

const toast = useToast();
const checkingPaymentId = ref(null);
const approvingId = ref(null);

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
        description: "Захиалга баталгаажиж, Google Sheets рүү илгээгдлээ.",
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
</script>
