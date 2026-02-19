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
          <span class="font-bold text-zinc-900 dark:text-white">{{
            row.original.customer
          }}</span>
        </template>
        <template #date-cell="{ row }">
          <span class="text-[11px] text-zinc-500 font-medium">
            {{ formatDateTime(row.original.createdAt) }}
          </span>
        </template>
        <template #total-cell="{ row }">
          <span class="font-bold text-zinc-900 dark:text-white"
            >₮{{ row.original.total }}</span
          >
        </template>
        <template #status-cell="{ row }">
          <UBadge
            size="xs"
            variant="subtle"
            :color="getStatusColor(row.original.status)"
            class="font-semibold"
          >
            {{ row.original.statusLabel }}
          </UBadge>
        </template>
        <template #payment-cell="{ row }">
          <div class="flex flex-col gap-1">
            <UBadge
              size="xs"
              variant="subtle"
              :color="
                row.original.paymentStatus === 'paid' ? 'success' : 'warning'
              "
              class="font-semibold w-fit"
            >
              {{
                row.original.paymentStatus === "paid"
                  ? "Төлөгдсөн"
                  : "Төлөгдөөгүй"
              }}
            </UBadge>
            <span
              class="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter"
            >
              {{ row.original.paymentMethod === "qpay" ? "QPay" : "Бэлнээр" }}
            </span>
          </div>
        </template>
        <template #delivery-cell="{ row }">
          <div class="flex items-center gap-2">
            <span class="material-symbols-rounded text-sm text-zinc-400">
              {{ row.original.hasDelivery ? "local_shipping" : "store" }}
            </span>
            <span class="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
              {{ row.original.hasDelivery ? "Хүргэлт" : "Очиж авах" }}
            </span>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const { data, pending, error } = await useFetch(
  `${config.public.apiBase}/stats`,
);

const orders = computed(() => data.value?.data?.recentOrders || []);

const columns = [
  { accessorKey: "customer", header: "Хэрэглэгч" },
  { accessorKey: "date", header: "Огноо" },
  { accessorKey: "items", header: "Бараа" },
  { accessorKey: "total", header: "Дүн" },
  { accessorKey: "payment", header: "Төлбөр" },
  { accessorKey: "delivery", header: "Хүргэлт" },
  { accessorKey: "status", header: "Төлөв" },
];

const statusTranslations = {
  pending: "Хүлээгдэж байна",
  confirmed: "Баталгаажсан",
  processing: "Бэлтгэгдэж байна",
  shipped: "Хүргэлтэд гарсан",
  delivered: "Хүргэгдсэн",
  completed: "Дууссан",
  cancelled: "Цуцлагдсан",
};

const getStatusColor = (status) => {
  switch (status) {
    case "delivered":
    case "completed":
      return "success";
    case "confirmed":
    case "processing":
      return "primary";
    case "shipped":
      return "blue";
    case "pending":
      return "warning";
    case "cancelled":
      return "error";
    default:
      return "zinc";
  }
};
</script>
