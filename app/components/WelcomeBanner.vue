<template>
  <UCard class="bg-zinc-200 dark:bg-zinc-700">
  
    <div
      class="relative flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-10"
    >
      <div class="space-y-6 text-left">
        <!-- Status & Greeting Duo -->
        <div class="space-y-2">
          <div
            class="flex items-center space-x-2 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <span class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"
              ></span>
            </span>
            <span>{{ statusText }}</span>
          </div>

          <h1
            class="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight"
          >
            {{ title }}
            <span class="text-primary-600 dark:text-primary-400"
              >{{ name }}!</span
            >
            👋
          </h1>
        </div>

        <!-- Action Area -->
        <div v-if="actionTo" class="flex items-center">
          <UButton
            :to="actionTo"
            variant="ghost"
            color="neutral"
            class="group/btn !rounded-full px-0 hover:bg-transparent font-bold text-sm text-zinc-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <span
              v-if="actionIcon"
              class="material-symbols-rounded mr-2 group-hover/btn:rotate-12 transition-transform"
              >{{ actionIcon }}</span
            >
            {{ actionLabel }}
            <span
              class="material-symbols-rounded ml-1 text-xs opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all font-black"
              >arrow_forward</span
            >
          </UButton>
        </div>
      </div>

      <!-- Compact Hero Bot -->
      <div
        class="flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 mx-auto md:mx-0"
      >
        <img
          :src="currentGif"
          alt="AI Assistant"
          class="w-full h-full object-contain select-none pointer-events-none drop-shadow-2xl"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  title: { type: String, default: "Сайн байна уу," },
  name: { type: String, default: "Админ" },
  statusText: { type: String, default: "Систем идэвхтэй байна" },
  actionLabel: { type: String, default: "Тохиргоо" },
  actionTo: { type: String, default: "/settings" },
  actionIcon: { type: String, default: "settings_spark" },
  confidence: { type: Number, default: 100 },
});

const happyGifs = [
  "/giphy (1).gif",
  "/giphy (2).gif",
  "/giphy (3).gif",
  "/giphy (4).gif",
  "/giphy (5).gif",
  "/giphy.gif",
];

const selectedHappyGif = ref(happyGifs[0]);

onMounted(() => {
  const randomIndex = Math.floor(Math.random() * happyGifs.length);
  selectedHappyGif.value = happyGifs[randomIndex];
});

const currentGif = computed(() => {
  if (props.confidence >= 80) return selectedHappyGif.value;
  if (props.confidence >= 40) return "/giphy-thinking.gif";
  return "/giphy-confused.gif";
});
</script>
