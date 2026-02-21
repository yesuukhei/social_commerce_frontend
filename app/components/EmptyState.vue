<template>
  <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div
      class="w-28 h-28 rounded-[40px] flex items-center justify-center mb-8 bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 transition-all duration-700 group-hover:dark:ring-zinc-500"
    >
      <span
        class="material-symbols-rounded text-6xl! text-zinc-400 dark:text-white/20 transition-transform duration-700 group-hover:scale-110"
        >{{ icon }}</span
      >
    </div>
    <h3 class="text-base font-bold text-zinc-900 dark:text-white mb-1">
      {{ title }}
    </h3>
    <p class="text-sm text-zinc-500 max-w-xs mb-6">{{ description }}</p>
    <slot name="action" />
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: "inbox" },
  title: { type: String, default: "Мэдээлэл алга" },
  description: {
    type: String,
    default: "Одоогоор энд харуулах мэдээлэл байхгүй байна.",
  },
});
</script>
