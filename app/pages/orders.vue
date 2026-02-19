<template>
  <div class="space-y-8">
    <header
      class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4"
    >
      <div>
        <h1
          class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white"
        >
          Захиалга
        </h1>
        <p class="text-sm text-neutral-500 mt-2">
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
            class="h-4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse w-16"
          ></div>
          <div
            class="h-4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse w-24"
          ></div>
          <div
            class="h-4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse flex-1"
          ></div>
          <div
            class="h-4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse w-20"
          ></div>
          <div
            class="h-6 bg-neutral-100 dark:bg-neutral-800 rounded-full animate-pulse w-24"
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
        <template #id-cell="{ row }">
          <span class="font-mono text-xs text-neutral-400"
            >#{{ row.original.id }}</span
          >
        </template>
        <template #customer-cell="{ row }">
          <span class="font-semibold text-neutral-700 dark:text-neutral-200">{{
            row.original.customer
          }}</span>
        </template>
        <template #total-cell="{ row }">
          <span class="font-bold text-neutral-900 dark:text-white"
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
            {{ row.original.status }}
          </UBadge>
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
  { accessorKey: "id", header: "ID" },
  { accessorKey: "customer", header: "Хэрэглэгч" },
  { accessorKey: "items", header: "Бараа" },
  { accessorKey: "total", header: "Дүн" },
  { accessorKey: "status", header: "Төлөв" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Хүргэгдсэн":
      return "success";
    case "Баталгаажсан":
      return "primary";
    case "Хүлээгдэж байна":
      return "warning";
    default:
      return "neutral";
  }
};
</script>
