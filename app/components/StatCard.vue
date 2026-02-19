<template>
  <UCard
    class="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 group border-zinc-200/60 dark:border-zinc-700 hover:dark:border-zinc-500"
    :ui="{ body: { padding: 'p-6' } }"
  >
    <div class="flex justify-between items-start mb-4">
      <span
        class="text-zinc-500 dark:text-zinc-400 text-[11px] font-black uppercase tracking-widest"
        >{{ label }}</span
      >
      <div
        class="w-10 h-10 rounded-2xl flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 group-hover:dark:ring-zinc-500 transition-all duration-500"
      >
        <span
          class="material-symbols-rounded text-xl text-zinc-600 dark:text-white transition-transform duration-500 group-hover:scale-110"
          >{{ icon }}</span
        >
      </div>
    </div>

    <div class="text-left">
      <div class="flex items-center gap-3">
        <span
          class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white"
          >{{ value }}</span
        >
        <UBadge
          v-if="trend !== undefined"
          :color="trend > 0 ? 'success' : trend < 0 ? 'error' : 'neutral'"
          size="sm"
          variant="subtle"
          class="font-extrabold rounded-full! px-2"
        >
          <template #leading v-if="trend !== 0">
            <span class="material-symbols-rounded text-[14px]! leading-none">
              {{ trend > 0 ? "trending_up" : "trending_down" }}
            </span>
          </template>
          {{ Math.abs(trend) }}%
        </UBadge>
      </div>
      <p
        class="text-[11px] text-zinc-400 dark:text-zinc-500 font-bold mt-2 flex items-center"
      >
        <span
          class="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mr-2"
        ></span>
        {{ description || "Нийт статистик" }}
      </p>
    </div>
  </UCard>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
  icon: String,
  trend: Number,
  color: String,
  description: String,
});
</script>
