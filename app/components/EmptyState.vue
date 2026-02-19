<template>
  <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div
      class="w-64 h-64 rounded-4xl bg-neutral-100 dark:bg-neutral-800/50 flex items-center justify-center mb-8"
    >
      <span class="material-symbols-rounded !text-8xl text-neutral-400/80">{{
        icon
      }}</span>
    </div>
    <h3 class="text-base font-bold text-slate-900 dark:text-white mb-1">
      {{ title }}
    </h3>
    <p class="text-sm text-slate-500 max-w-xs mb-6">{{ description }}</p>
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
