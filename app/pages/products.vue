<template>
  <div class="space-y-8">
    <header
      class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4"
    >
      <div>
        <h1
          class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white"
        >
          Бараа
        </h1>
        <p class="text-sm text-zinc-500 font-medium mt-2">
          Sheets-ээс уншиж авсан барааны мэдээлэл (Read-only)
        </p>
      </div>
      <div class="flex gap-3">
        <UButton
          variant="soft"
          color="neutral"
          icon="material-symbols:sync"
          :loading="syncing"
          @click="syncFromSheets"
        >
          Sheets-ээс шинэчлэх
        </UButton>
      </div>
    </header>

    <!-- Filters & Search -->
    <div
      class="flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
    >
      <div class="flex flex-col sm:flex-row flex-1 gap-3 sm:gap-4 w-full">
        <div class="w-full sm:w-96">
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass"
            placeholder="Барааны нэрээр хайх..."
            class="w-full"
          />
        </div>
        <div class="flex items-center justify-between sm:justify-start">
          <USwitch
            v-model="showInactive"
            label="Идэвхгүй барааг харах"
            :ui="{ container: 'flex-row-reverse gap-3' }"
          />
          <div
            class="sm:hidden text-[11px] text-zinc-400 font-bold uppercase tracking-wider"
          >
            Нийт: {{ products.length }}
          </div>
        </div>
      </div>
      <div class="hidden sm:block text-xs text-zinc-500 font-medium">
        <span>Нийт: {{ products.length }} бараа</span>
      </div>
    </div>

    <!-- Loading State -->
    <UCard
      v-if="pending && !products.length"
      :ui="{ body: { padding: 'p-0' } }"
    >
      <div class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="flex gap-4 items-center">
          <div
            class="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse"
          ></div>
          <div
            class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse flex-1"
          ></div>
          <div
            class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-24"
          ></div>
          <div
            class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-24"
          ></div>
        </div>
      </div>
    </UCard>

    <!-- Empty State -->
    <UCard v-else-if="!products.length" :ui="{ body: { padding: 'p-40' } }">
      <EmptyState
        icon="inventory"
        :title="search ? 'Ийм бараа олдсонгүй' : 'Бараа бүртгэгдээгүй байна'"
        :description="
          search
            ? 'Хайлтын утгаа шалгаад дахин оролдоно уу.'
            : 'Google Sheets-ээ холбож, барааны мэдээллээ татаж аваарай.'
        "
      >
        <template #action>
          <UButton
            v-if="!search"
            to="/settings"
            variant="outline"
            color="gray"
            class="font-semibold"
          >
            <span class="material-symbols-rounded text-lg mr-2">settings</span>
            Тохиргоо руу очих
          </UButton>
          <UButton v-else variant="ghost" color="gray" @click="search = ''">
            Хайлтыг цэвэрлэх
          </UButton>
        </template>
      </EmptyState>
    </UCard>

    <!-- Products Table -->
    <UCard v-else :ui="{ body: { padding: 'p-0' } }">
      <UTable :data="products" :columns="columns">
        <template #name-cell="{ row }">
          <div
            class="flex items-center gap-3 py-1"
            :class="{ 'opacity-50 grayscale': !row.original.isActive }"
          >
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 group-hover:dark:ring-zinc-500 overflow-hidden"
            >
              <img
                v-if="row.original.images?.[0]"
                :src="row.original.images[0]"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span
                v-else
                class="material-symbols-rounded text-xl text-zinc-400 dark:text-zinc-500 transition-transform duration-500 group-hover:scale-110"
                >image</span
              >
            </div>
            <div class="flex flex-col">
              <span
                class="font-bold text-zinc-900 dark:text-white leading-tight"
                >{{ row.original.name }}</span
              >
              <div class="flex items-center gap-2 mt-0.5">
                <span
                  class="text-[10px] uppercase font-black tracking-widest"
                  :class="
                    row.original.category
                      ? 'text-zinc-500'
                      : 'text-zinc-400 italic'
                  "
                >
                  {{ row.original.category || "хоосон" }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <template #price-cell="{ row }">
          <span
            class="font-black text-zinc-900 dark:text-white"
            :class="{
              'opacity-50': !row.original.isActive,
              'text-zinc-400 font-normal italic': !row.original.price,
            }"
          >
            {{
              row.original.price
                ? `₮${row.original.price.toLocaleString()}`
                : "хоосон"
            }}
          </span>
        </template>

        <template #stock-cell="{ row }">
          <div
            class="flex items-center gap-2"
            :class="{ 'opacity-50': !row.original.isActive }"
          >
            <UBadge
              v-if="row.original.stock"
              variant="subtle"
              class="font-bold"
            >
              {{ row.original.stock }}
            </UBadge>
          </div>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            size="xs"
            variant="subtle"
            :color="row.original.isActive ? 'primary' : 'neutral'"
          >
            {{ row.original.isActive ? "Идэвхтэй" : "Устгагдсан (Sheets)" }}
          </UBadge>
        </template>

        <!-- Dynamic Attribute Slots -->
        <template
          v-for="col in dynamicAttributeColumns"
          :key="col.key"
          #[`${col.accessorKey}-cell`]="{ row }"
        >
          <span
            v-if="row.original.attributes && row.original.attributes[col.key]"
            class="text-xs text-zinc-600 dark:text-zinc-400 font-medium"
          >
            {{ row.original.attributes[col.key] }}
          </span>
          <span v-else class="text-[10px] text-zinc-300 italic">хоосон</span>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const toast = useToast();
const { token } = useAuth();
const search = ref("");
const debouncedSearch = ref("");
const showInactive = ref(false);
const syncing = ref(false);

// Debounce search
let timeout;
watch(search, (val) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    debouncedSearch.value = val;
  }, 500);
});

const { data, pending, refresh } = await useFetch(
  () => `${config.public.apiBase}/products`,
  {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    query: computed(() => ({
      search: debouncedSearch.value || undefined,
      isActive: showInactive.value ? "false" : "true",
    })),
    watch: [debouncedSearch, showInactive],
  },
);

const products = computed(() => data.value?.data || []);
const meta = computed(() => data.value?.meta || { headers: [], mapping: {} });

// Identify dynamic attribute columns for slot rendering
const dynamicAttributeColumns = computed(() => {
  const headers = meta.value.headers || [];
  const mapping = meta.value.mapping || {};
  const standardCols = [
    mapping.name || "Нэр",
    mapping.price || "Үнэ",
    mapping.stock || "Үлдэгдэл",
    mapping.category || "Төрөл",
    "AI Status",
  ];

  return headers
    .filter((h) => !standardCols.includes(h))
    .map((h) => ({
      key: h, // The header name from sheet
      accessorKey: `attr_${h}`,
      header: h,
    }));
});

// Full column definition for UTable
const columns = computed(() => {
  const mapping = meta.value.mapping || {};

  const cols = [
    { accessorKey: "name", header: mapping.name || "Бараа" },
    { accessorKey: "price", header: mapping.price || "Үнэ" },
    { accessorKey: "stock", header: mapping.stock || "Үлдэгдэл" },
    ...dynamicAttributeColumns.value,
    { accessorKey: "status", header: "Төлөв" },
  ];

  return cols;
});

const getStockColor = (stock) => {
  if (stock > 10) return "success";
  if (stock > 0) return "warning";
  return "error";
};

const syncFromSheets = async () => {
  syncing.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/sync/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (response.success) {
      const { successCount, deactivatedCount } = response.data;
      toast.add({
        title: "Шинэчлэлт дууслаа",
        description: `${successCount} бараа идэвхтэй байна. ${deactivatedCount} бараа Sheets-ээс устсан тул идэвхгүй боллоо.`,
        color: "green",
      });
      await refresh();
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
</script>
