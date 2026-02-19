<template>
  <UCard
    class="h-36 flex flex-col justify-between"
    :ui="{ body: { padding: 'p-6' } }"
  >
    <div class="flex justify-between items-start">
      <span class="text-neutral-500 text-sm font-semibold">{{ label }}</span>
      <div
        class="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
      >
        <span
          class="material-symbols-rounded text-neutral-500 dark:text-neutral-400 text-xl"
          >{{ icon }}</span
        >
      </div>
    </div>
    <div class="mt-2 text-left">
      <div class="flex items-baseline space-x-2">
        <span
          class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white"
          >{{ value }}</span
        >
        <UBadge
          :color="trend > 0 ? 'success' : 'error'"
          size="sm"
          variant="subtle"
          class="font-bold rounded-full"
        >
          <template #leading>
            <span class="material-symbols-rounded text-[14px]!">
              {{ trend > 0 ? "trending_up" : "trending_down" }}
            </span>
          </template>
          {{ Math.abs(trend) }}%
        </UBadge>
      </div>
      <p class="text-sm text-neutral-400 font-medium mt-1">Нийт статистик</p>
    </div>
  </UCard>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
  icon: String,
  trend: Number,
});
</script>
