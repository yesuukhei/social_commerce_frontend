<template>
  <div class="space-y-8">
    <header
      class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4"
    >
      <div>
        <h1
          class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white"
        >
          Бараа
        </h1>
        <p class="text-sm text-neutral-500 mt-2">
          Sheets-ээс уншиж авсан барааны жагсаалт
        </p>
      </div>
      <UButton>
        <span class="material-symbols-rounded text-lg mr-2">add</span>
        Шинэ бараа нэмэх
      </UButton>
    </header>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <UCard v-for="i in 6" :key="i" :ui="{ body: { padding: 'p-0' } }">
        <div
          class="aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 animate-pulse"
        ></div>
        <div class="p-5 space-y-3">
          <div
            class="h-4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse w-3/4"
          ></div>
          <div
            class="h-3 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse w-1/2"
          ></div>
          <div
            class="h-5 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse w-1/3"
          ></div>
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <UCard v-else-if="!products.length">
      <EmptyState
        icon="package_2"
        title="Бараа бүртгэгдээгүй байна"
        description="Google Sheets-ээ холбож, барааны мэдээллээ татаж аваарай."
      >
        <template #action>
          <UButton variant="subtle" color="primary" class="rounded-full px-6">
            <span class="material-symbols-rounded text-lg mr-2">sync</span>
            Sheets-ээс татах
          </UButton>
        </template>
      </EmptyState>
    </UCard>

    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="product in products"
        :key="product._id"
        class="group cursor-pointer hover:ring-2 hover:ring-primary-500/20 transition-all"
        :ui="{ body: { padding: 'p-0' } }"
      >
        <div
          class="aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span
            v-else
            class="material-symbols-rounded text-5xl text-neutral-300 dark:text-neutral-600 group-hover:scale-110 transition-transform"
          >
            image
          </span>
        </div>
        <div class="p-5">
          <div class="flex justify-between items-start mb-1">
            <h4 class="font-bold text-slate-900 dark:text-white text-sm">
              {{ product.name }}
            </h4>
            <UBadge
              size="xs"
              variant="subtle"
              color="gray"
              class="font-semibold"
            >
              {{ product.category || "Ерөнхий" }}
            </UBadge>
          </div>
          <p class="text-xs text-slate-500 mb-4 line-clamp-2">
            {{ product.description || "Тайлбар оруулаагүй байна" }}
          </p>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold text-slate-900 dark:text-white">
              ₮{{ (product.price || 0).toLocaleString() }}
            </span>
            <UBadge
              size="xs"
              variant="subtle"
              :color="
                (product.stock || 0) > 5
                  ? 'emerald'
                  : (product.stock || 0) > 0
                    ? 'amber'
                    : 'rose'
              "
              class="font-semibold"
            >
              <span class="material-symbols-rounded text-xs mr-1"
                >inventory</span
              >
              Үлдэгдэл: {{ product.stock || 0 }}
            </UBadge>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const { data, pending, error } = await useFetch(
  `${config.public.apiBase}/products`,
);

const products = computed(() => data.value?.data || data.value?.products || []);
</script>
