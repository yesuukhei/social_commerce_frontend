<template>
  <div class="space-y-4">
    <div
      v-if="!messages?.length"
      class="h-full flex flex-col items-center justify-center opacity-30 min-h-[200px]"
    >
      <span class="material-symbols-rounded text-4xl mb-2"
        >speaker_notes_off</span
      >
      <p class="text-xs font-bold">Мессеж олдсонгүй</p>
    </div>

    <div
      v-for="(msg, i) in messages"
      :key="i"
      class="flex flex-col group/msg"
      :class="[msg.sender === 'customer' ? 'items-start' : 'items-end']"
    >
      <div
        class="max-w-[85%] md:max-w-[70%] px-4 py-2.5 rounded-2xl md:rounded-[1.5rem] text-xs md:text-sm font-semibold transition-all duration-300"
        :class="[
          msg.sender === 'customer'
            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-100 dark:border-zinc-700 shadow-sm'
            : msg.sender === 'bot'
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-tr-none border border-zinc-200/50 dark:border-zinc-700/50 italic opacity-90'
              : 'bg-primary-500 text-white rounded-tr-none shadow-lg shadow-primary-500/20',
        ]"
      >
        {{ msg.text }}
      </div>
      <div class="flex items-center gap-1.5 mt-1 px-1">
        <span
          class="text-[8px] font-black text-zinc-400 uppercase tracking-tighter"
        >
          {{ formatDateTime(msg.timestamp) }}
        </span>
        <span
          v-if="msg.sender === 'bot'"
          class="text-[8px] font-black text-primary-500 uppercase tracking-tighter"
          >AI</span
        >
        <span
          v-if="msg.sender === 'admin'"
          class="text-[8px] font-black text-zinc-500 uppercase tracking-tighter"
          >Admin</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
});

const formatDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const months = [
    "1-р сарын",
    "2-р сарын",
    "3-р сарын",
    "4-р сарын",
    "5-р сарын",
    "6-р сарын",
    "7-р сарын",
    "8-р сарын",
    "9-р сарын",
    "10-р сарын",
    "11-р сарын",
    "12-р сарын",
  ];
  const month = months[d.getMonth()];
  const day = d.getDate();
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${month} ${day}, ${time}`;
};
</script>
