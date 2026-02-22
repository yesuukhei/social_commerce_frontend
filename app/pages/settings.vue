<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-32">
    <!-- ============================================================
         ONBOARDING: Welcome Screen (shown only when user has NO store)
         ============================================================ -->
    <div
      v-if="isOnboarding"
      class="min-h-[80vh] flex items-center justify-center"
    >
      <div class="w-full max-w-sm space-y-8 text-center">
        <!-- Icon -->
        <div class="flex justify-center">
          <div
            class="w-24 h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
          >
            <img
              src="/facebook.png"
              alt="Facebook"
              class="w-14 h-14 object-contain"
            />
          </div>
        </div>

        <!-- Heading -->
        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">
            Facebook хуудас холбох
          </h1>
          <p class="text-sm text-zinc-500 leading-relaxed">
            Өөрийн Facebook хуудастай холбосноор AI туслах ажиллаж эхэлнэ.
          </p>
        </div>

        <!-- CTA: Connect Button -->
        <div v-if="availablePages.length === 0" class="space-y-3">
          <UButton
            size="lg"
            color="primary"
            class="w-full font-semibold"
            @click="startFacebookFlow()"
            :loading="fbLoading"
            id="onboarding-connect-facebook-btn"
          >
            Хуудас холбох
          </UButton>
        </div>

        <!-- Page Picker -->
        <div v-else class="space-y-3 text-left">
          <p
            class="text-xs font-semibold text-zinc-400 uppercase tracking-wider text-center"
          >
            Хуудсаа сонгоно уу
          </p>
          <div class="space-y-1">
            <button
              v-for="page in availablePages"
              :key="page.id"
              class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left group"
              @click="connectPage(page)"
            >
              <UAvatar
                :src="page.picture?.data?.url"
                :alt="page.name"
                size="sm"
              />
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-semibold text-zinc-900 dark:text-white truncate"
                >
                  {{ page.name }}
                </p>
                <p class="text-xs text-zinc-400 truncate">
                  {{ page.category }}
                </p>
              </div>
              <UIcon
                name="i-heroicons-chevron-right"
                class="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 shrink-0"
              />
            </button>
          </div>
          <button
            class="w-full text-xs text-zinc-400 hover:text-zinc-600 py-2 transition-colors"
            @click="availablePages = []"
          >
            Буцах
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================
         SETTINGS: Standard view for existing users
         ============================================================ -->
    <template v-else>
      <header class="flex justify-between items-start">
        <div>
          <h1
            class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white"
          >
            {{ isWizardMode ? "Дэлгүүр тохируулах" : "Тохиргоо" }}
          </h1>
          <p class="text-zinc-500 mt-2 font-medium">
            {{
              isWizardMode
                ? `Алхам ${currentStep}: ${steps[currentStep - 1].label}`
                : "Системийн холболт болон AI-ийн зан араншинг тохируулах"
            }}
          </p>
        </div>
        <UButton
          v-if="isWizardMode"
          variant="ghost"
          color="gray"
          @click="isWizardMode = false"
        >
          Болих
        </UButton>
      </header>

      <!-- Wizard Stepper -->
      <div v-if="isWizardMode" class="relative">
        <div
          class="absolute top-5 left-0 w-full h-0.5 bg-zinc-100 dark:bg-zinc-800 -z-10"
        ></div>
        <div
          class="absolute top-5 left-0 h-0.5 bg-primary-500 transition-all duration-500 -z-10 shadow-[0_0_10px_rgba(var(--color-primary-500),0.3)]"
          :style="{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }"
        ></div>

        <div class="flex justify-between items-center">
          <div
            v-for="s in steps"
            :key="s.n"
            class="flex flex-col items-center gap-2"
            @click="currentStep >= s.n ? (currentStep = s.n) : null"
            :class="{ 'cursor-pointer': currentStep >= s.n }"
          >
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 font-black text-sm"
              :class="[
                currentStep === s.n
                  ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20 scale-110'
                  : currentStep > s.n
                    ? 'bg-primary-500/10 text-primary-500'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400',
              ]"
            >
              <UIcon
                v-if="currentStep > s.n"
                name="i-heroicons-check"
                class="w-5 h-5"
              />
              <span v-else>{{ s.n }}</span>
            </div>
            <span
              class="text-[10px] font-black uppercase tracking-widest transition-colors duration-500"
              :class="
                currentStep >= s.n
                  ? 'text-zinc-900 dark:text-white'
                  : 'text-zinc-400'
              "
            >
              {{ s.label }}
            </span>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Step 1: Social & Basics -->
        <div v-if="!isWizardMode || currentStep === 1" class="space-y-6">
          <!-- Facebook Connection -->
          <UCard
            :ui="{ header: { base: 'bg-zinc-50/50 dark:bg-zinc-800/50' } }"
          >
            <template #header>
              <h3
                class="font-black text-xs uppercase tracking-widest text-zinc-900 dark:text-white flex items-center"
              >
                <div
                  class="w-10 h-10 rounded-2xl flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 mr-3"
                >
                  <span class="material-symbols-rounded text-xl">facebook</span>
                </div>
                {{ facebookPageId ? "Холбогдсон хуудас" : "Facebook Холболт" }}
              </h3>
            </template>

            <div class="space-y-6">
              <!-- Case 1: Active Page and we want to see/change it -->
              <div
                v-if="facebookPageId && availablePages.length === 0"
                class="flex flex-col sm:flex-row items-center justify-between p-6 bg-primary-50/50 dark:bg-primary-950/10 rounded-3xl border border-primary-100/50 dark:border-primary-900/30 gap-6"
              >
                <div class="flex items-center gap-4 w-full">
                  <UAvatar
                    v-if="logoUrl"
                    :src="logoUrl"
                    size="xl"
                    class="ring-4 ring-white dark:ring-zinc-800 shadow-xl"
                  />
                  <div class="overflow-hidden grow">
                    <div class="flex items-center gap-2">
                      <p
                        class="text-lg font-black text-zinc-900 dark:text-white truncate"
                      >
                        {{ storeName }}
                      </p>
                      <UBadge color="primary" variant="subtle" size="xs"
                        >Идэвхтэй</UBadge
                      >
                    </div>
                    <div class="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <p
                        class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5"
                      >
                        <UIcon
                          name="i-brand-facebook"
                          class="w-3 h-3 text-blue-600"
                        />
                        Connected
                      </p>
                      <p
                        v-if="instagramBusinessId"
                        class="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-primary-500"
                      >
                        <UIcon name="i-brand-instagram" class="w-3 h-3" />
                        Instagram linked
                      </p>
                    </div>
                  </div>
                </div>
                <div class="space-y-3 shrink-0 w-full sm:w-auto">
                  <UButton
                    variant="soft"
                    color="neutral"
                    size="md"
                    class="w-full font-bold"
                    @click="startFacebookFlow"
                    :loading="fbLoading"
                  >
                    Хуудас солих
                  </UButton>
                  <p
                    class="text-[9px] text-zinc-400 max-w-[150px] leading-tight text-center sm:text-left italic"
                  >
                    * App 'Development' горимд байгаа үед зөвхөн Admin хуудсаа
                    харах боломжтой.
                  </p>
                </div>
              </div>

              <!-- Case 2: Showing the list of multiple connected pages -->
              <div v-else-if="availablePages.length > 0" class="space-y-4">
                <div class="flex items-center justify-between px-1">
                  <p
                    class="text-xs font-black text-zinc-400 uppercase tracking-widest"
                  >
                    Таны холбох боломжтой хуудсууд:
                  </p>
                  <UButton
                    v-if="facebookPageId"
                    variant="ghost"
                    color="gray"
                    size="xs"
                    @click="availablePages = []"
                    >Болих</UButton
                  >
                </div>
                <div class="grid grid-cols-1 gap-2">
                  <div
                    v-for="page in availablePages"
                    :key="page.id"
                    class="flex items-center justify-between p-4 rounded-3xl border transition-all cursor-pointer group"
                    :class="[
                      page.id === facebookPageId
                        ? 'border-primary-500 bg-primary-50/20 ring-1 ring-primary-500/20'
                        : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50',
                    ]"
                    @click="connectPage(page)"
                  >
                    <div class="flex items-center gap-3 shrink-0">
                      <div class="relative">
                        <UAvatar
                          :src="page.picture?.data?.url"
                          :alt="page.name"
                          size="md"
                        />
                        <div
                          v-if="page.id === facebookPageId"
                          class="absolute -right-1 -bottom-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900"
                        >
                          <UIcon
                            name="i-heroicons-check"
                            class="w-3 h-3 text-white"
                          />
                        </div>
                      </div>
                      <div class="overflow-hidden">
                        <p
                          class="text-sm font-black text-zinc-900 dark:text-white truncate"
                        >
                          {{ page.name }}
                        </p>
                        <p
                          class="text-[10px] text-zinc-500 uppercase font-bold tracking-tight"
                        >
                          {{ page.category }}
                        </p>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <UBadge
                        v-if="page.id === facebookPageId"
                        color="primary"
                        variant="subtle"
                        size="xs"
                        >Ашиглаж буй</UBadge
                      >
                      <UButton
                        v-else
                        variant="ghost"
                        color="primary"
                        size="sm"
                        class="opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                        >Сонгох</UButton
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Case 3: Initial State / Nothing connected -->
              <div
                v-else
                class="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[40px] text-center space-y-6"
              >
                <div class="relative">
                  <div
                    class="w-24 h-24 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center rotate-3"
                  >
                    <span
                      class="material-symbols-rounded text-5xl text-zinc-200 dark:text-zinc-800"
                      >account_tree</span
                    >
                  </div>
                  <div
                    class="absolute -right-2 -bottom-2 w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-700 -rotate-6"
                  >
                    <UIcon
                      name="i-brand-facebook"
                      class="w-8 h-8 text-blue-600"
                    />
                  </div>
                </div>
                <div class="space-y-2">
                  <p class="text-xl font-black text-zinc-900 dark:text-white">
                    Social Commerce-оо идэвхжүүлэх
                  </p>
                  <p
                    class="text-sm text-zinc-500 max-w-[340px] mx-auto leading-relaxed font-medium"
                  >
                    Та системд зөвшөөрөл өгснөөр өөрийн бүх хуудсуудаа нэг
                    дороос удирдах, AI туслахаа ажиллуулах боломжтой болно.
                  </p>
                </div>
                <div class="flex flex-col items-center gap-4">
                  <UButton
                    size="xl"
                    color="primary"
                    class="font-black px-12 h-14 rounded-2xl shadow-2xl shadow-primary-500/20 hover:scale-105 transition-transform"
                    @click="startFacebookFlow()"
                    :loading="fbLoading"
                  >
                    Facebook-тэй холбох
                  </UButton>
                  <div
                    v-if="!fbLoading"
                    class="pt-2 flex flex-col items-center gap-3 w-full"
                  >
                    <div
                      v-if="showFBGuide"
                      class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-3xl max-w-[400px] text-left animate-in fade-in slide-in-from-top-2"
                    >
                      <div class="flex items-start gap-3">
                        <UIcon
                          name="i-heroicons-information-circle"
                          class="w-6 h-6 text-amber-500 shrink-0 mt-0.5"
                        />
                        <div class="space-y-2">
                          <p
                            class="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-tighter"
                          >
                            Заавар:
                          </p>
                          <p
                            class="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium"
                          >
                            Facebook-ийн цонх нээгдэхэд заавал
                            <b
                              class="text-amber-900 dark:text-amber-100 underline decoration-amber-500/50"
                              >"Edit previous settings"</b
                            >
                            (эсвэл "Тохиргоог засах") холбоосыг дарж, шинээр
                            үүсгэсэн хуудсаа идэвхжүүлээрэй.
                          </p>
                          <UButton
                            size="xs"
                            color="amber"
                            variant="solid"
                            class="font-bold w-full rounded-xl mt-1"
                            @click="startFacebookFlow(true)"
                          >
                            Ойлголоо, үргэлжлүүлэх
                          </UButton>
                        </div>
                      </div>
                    </div>
                    <button
                      v-else
                      class="text-[10px] text-zinc-400 font-bold hover:text-primary-500 underline transition-colors"
                      @click="showFBGuide = true"
                    >
                      Шинэ хуудсаа олж харахгүй байна уу?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Step 2: Google Sheets & Mapping -->
        <div v-if="!isWizardMode || currentStep === 2" class="space-y-6">
          <UCard
            :ui="{ header: { base: 'bg-zinc-50/50 dark:bg-zinc-800/50' } }"
          >
            <template #header>
              <h3
                class="font-black text-xs uppercase tracking-widest text-zinc-900 dark:text-white flex items-center"
              >
                <div
                  class="w-10 h-10 rounded-2xl flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 mr-3"
                >
                  <span class="material-symbols-rounded text-xl"
                    >leaderboard</span
                  >
                </div>
                Google Sheets Холболт
              </h3>
            </template>
            <div class="space-y-8">
              <!-- Instructions & Guidance -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800"
              >
                <div class="space-y-4">
                  <h4
                    class="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full bg-primary-500"
                    ></span>
                    1. Эрх олгох
                  </h4>
                  <p class="text-xs text-zinc-500 font-medium leading-relaxed">
                    Манай үйлчилгээний хаягийг Google Sheets-дээ
                    <b>Editor</b> эрхээр нэмснээр AI бараа материалын мэдээллийг
                    унших боломжтой болно.
                  </p>
                  <div
                    class="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-2"
                  >
                    <code
                      class="flex-1 text-primary-600 font-bold text-[10px] truncate"
                      >sheets-writer@order-bot-487704.iam.gserviceaccount.com</code
                    >
                    <UButton
                      color="neutral"
                      variant="subtle"
                      size="xs"
                      @click="copyEmail"
                      >{{ copied ? "Хууллаа" : "Хуулах" }}</UButton
                    >
                  </div>
                </div>

                <div class="space-y-4">
                  <h4
                    class="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full bg-emerald-500"
                    ></span>
                    2. Стандарт баганууд
                  </h4>
                  <p class="text-xs text-zinc-500 font-medium leading-relaxed">
                    Таны файл доорх багануудтай заавал байх ёстой. Мөн нэмэлт
                    баганууд (Өнгө, Хэмжээ г.м) байж болно.
                  </p>
                  <div class="flex flex-wrap gap-1.5">
                    <UBadge
                      v-for="col in ['Нэр', 'Үнэ', 'Үлдэгдэл']"
                      :key="col"
                      variant="subtle"
                      color="neutral"
                      class="text-[9px] font-black uppercase tracking-tighter"
                      >{{ col }}</UBadge
                    >
                  </div>
                </div>
              </div>

              <!-- URL Input -->
              <div class="space-y-4">
                <label
                  class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400"
                  >Spreadsheet URL</label
                >
                <div class="flex flex-col sm:flex-row gap-3">
                  <UInput
                    v-model="sheetUrl"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    class="flex-1"
                    size="lg"
                    :ui="{ rounded: 'rounded-2xl' }"
                  />
                  <UButton
                    size="lg"
                    class="font-black px-8 rounded-2xl"
                    @click="testConnection"
                    :loading="loading"
                  >
                    Холболт шалгах
                  </UButton>
                </div>
              </div>

              <UAlert
                v-if="status"
                :title="status.title"
                :description="status.message"
                :color="status.success ? 'success' : 'error'"
                variant="subtle"
                class="rounded-3xl"
              />

              <!-- AI Mapping Results -->
              <div
                v-if="analysisResult"
                class="space-y-6 pt-6 border-t border-zinc-100 dark:border-zinc-800"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4
                      class="text-sm font-black text-zinc-900 dark:text-white"
                    >
                      Баганын холболт
                    </h4>
                    <p class="text-[11px] text-zinc-500 font-medium">
                      AI таны хүснэгтийн бүтцийг ийнхүү таамаглалаа. Нэмэлт
                      баганууд Бараа хуудсанд харагдана.
                    </p>
                  </div>
                  <UBadge
                    size="sm"
                    color="primary"
                    variant="subtle"
                    class="font-black"
                    >{{ (analysisResult.mapping.confidence * 100).toFixed(0) }}%
                    ANALYSIS</UBadge
                  >
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div
                    v-for="(col, key) in columnMapping"
                    :key="key"
                    class="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 transition-all hover:border-primary-500/30"
                  >
                    <p
                      class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3"
                    >
                      {{
                        key === "name"
                          ? "Барааны нэр"
                          : key === "price"
                            ? "Үнэ"
                            : key === "stock"
                              ? "Үлдэгдэл"
                              : ""
                      }}
                    </p>
                    <USelectMenu
                      v-model="columnMapping[key]"
                      :options="analysisResult.headers"
                      placeholder="Сонгох..."
                      size="sm"
                      class="w-full"
                      :ui="{ rounded: 'rounded-xl' }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Step 3: AI Soul & Rules -->
        <div v-if="!isWizardMode || currentStep === 3" class="space-y-6">
          <!-- Delivery Settings -->
          <UCard
            :ui="{ header: { base: 'bg-zinc-50/50 dark:bg-zinc-800/50' } }"
          >
            <template #header>
              <h3
                class="font-black text-xs uppercase tracking-widest text-zinc-900 dark:text-white flex items-center"
              >
                <div
                  class="w-10 h-10 rounded-2xl flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 mr-3"
                >
                  <span class="material-symbols-rounded text-xl"
                    >local_shipping</span
                  >
                </div>
                Хүргэлт & Очиж авах хаяг
              </h3>
            </template>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <p class="text-sm font-bold text-zinc-900 dark:text-white">
                    Хүргэлт хийх үү?
                  </p>
                  <p class="text-xs text-zinc-500">
                    AI хэрэглэгчээс хаяг нэхэх эсэхийг тодорхойлно.
                  </p>
                </div>
                <USwitch v-model="hasDelivery" />
              </div>

              <!-- Case 1: Delivery is enabled -->
              <div
                v-if="hasDelivery"
                class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800"
              >
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >Хүргэлтийн үнэ (₮)</label
                  >
                  <UInput
                    v-model="deliveryFee"
                    type="number"
                    placeholder="0"
                    size="lg"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >Хүргэлтийн хугацаа</label
                  >
                  <UInput
                    v-model="deliveryTime"
                    placeholder="24 цагийн дотор..."
                    size="lg"
                  />
                </div>
              </div>

              <!-- Case 2: Pickup only -->
              <div
                v-else
                class="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800"
              >
                <label
                  class="text-xs font-bold uppercase tracking-wider text-zinc-500"
                  >Очиж авах хаяг</label
                >
                <UTextarea
                  v-model="pickupAddress"
                  placeholder="Жишээ нь: Хүүхдийн ордны замын эсрэг талд..."
                  size="lg"
                />
              </div>
            </div>
          </UCard>

          <!-- Payment Settings -->
          <UCard
            :ui="{ header: { base: 'bg-zinc-50/50 dark:bg-zinc-800/50' } }"
          >
            <template #header>
              <h3
                class="font-black text-xs uppercase tracking-widest text-zinc-900 dark:text-white flex items-center"
              >
                <div
                  class="w-10 h-10 rounded-2xl flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 mr-3"
                >
                  <span class="material-symbols-rounded text-xl"
                    >account_balance</span
                  >
                </div>
                Төлбөр хүлээн авах
              </h3>
            </template>
            <div class="space-y-6">
              <div class="space-y-3">
                <label
                  class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                  >Төлбөрийн хэлбэр</label
                >
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <UButton
                    :variant="paymentMethod === 'manual' ? 'solid' : 'outline'"
                    color="primary"
                    class="flex flex-col items-start gap-1 p-4 h-auto text-left"
                    @click="paymentMethod = 'manual'"
                  >
                    <div class="flex items-center gap-2">
                      <UIcon
                        name="i-heroicons-building-library"
                        class="w-5 h-5"
                      />
                      <span class="font-bold text-sm">Дансаар</span>
                    </div>
                    <p class="text-[10px] opacity-70">
                      AI данс өгөөд, утга сануулна. (Гар ажиллагаатай)
                    </p>
                  </UButton>

                  <UButton
                    :variant="paymentMethod === 'cash' ? 'solid' : 'outline'"
                    color="primary"
                    class="flex flex-col items-start gap-1 p-4 h-auto text-left"
                    @click="paymentMethod = 'cash'"
                  >
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-rounded text-xl"
                        >payments</span
                      >
                      <span class="font-bold text-sm">Бэлнээр</span>
                    </div>
                    <p class="text-[10px] opacity-70">
                      Хүргэлт дээр эсвэл очиж авахдаа бэлнээр төлөх.
                    </p>
                  </UButton>
                </div>
                <p class="text-[10px] text-zinc-400 italic pt-2">
                  * QPay автомат төлбөрийн холболт удахгүй нэмэгдэнэ.
                </p>
              </div>

              <div
                v-if="paymentMethod === 'manual'"
                class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800"
              >
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >Банкны нэр</label
                  >
                  <UInput
                    v-model="paymentDetails.bankName"
                    placeholder="Хаан банк"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >Дансны дугаар</label
                  >
                  <UInput
                    v-model="paymentDetails.accountNumber"
                    placeholder="5000..."
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >Хүлээгчийн нэр</label
                  >
                  <UInput
                    v-model="paymentDetails.accountHolder"
                    placeholder="Бат..."
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                    >IBAN (Сонголтоор)</label
                  >
                  <UInput v-model="paymentDetails.iban" placeholder="MN..." />
                </div>
              </div>
            </div>
          </UCard>

          <!-- AI Personality -->
          <UCard
            :ui="{ header: { base: 'bg-zinc-50/50 dark:bg-zinc-800/50' } }"
          >
            <template #header>
              <h3
                class="font-black text-xs uppercase tracking-widest text-zinc-900 dark:text-white flex items-center"
              >
                <div
                  class="w-10 h-10 rounded-2xl flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 mr-3"
                >
                  <span class="material-symbols-rounded text-xl"
                    >smart_toy</span
                  >
                </div>
                AI Зан араншин & Дүрэм
              </h3>
            </template>
            <div class="space-y-6">
              <div class="space-y-3">
                <span
                  class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                  >Загвар ашиглах</span
                >
                <div class="flex flex-wrap gap-2">
                  <UButton
                    v-for="t in templates"
                    :key="t.name"
                    variant="subtle"
                    color="neutral"
                    size="xs"
                    @click="instructions = t.value"
                    >{{ t.name }}</UButton
                  >
                </div>
              </div>
              <div class="space-y-3 flex flex-col min-h-[300px]">
                <label
                  class="text-xs font-bold uppercase tracking-wider text-zinc-500"
                  >AI-д өгөх зааварчилгаа</label
                >
                <UTextarea
                  v-model="instructions"
                  placeholder="Чи бол найрсаг дэлгүүрийн туслах..."
                  class="grow"
                  :rows="10"
                  :ui="{ base: 'h-full resize-none' }"
                />
                <p class="text-[10px] text-zinc-400 italic">
                  Энд та хүргэлтийн үнэ, буцаалтын нөхцөл зэрэг AI-ийн мэдэх
                  ёстой бүх дүрмээ бичнэ.
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Navigation Footer -->
      <div
        class="fixed bottom-0 left-0 right-0 md:left-64 p-4 pb-6 sm:pb-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800 z-110 transition-all duration-300"
      >
        <div class="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <UButton
            v-if="isWizardMode && currentStep > 1"
            variant="ghost"
            color="gray"
            size="lg"
            class="font-black px-6"
            @click="currentStep--"
          >
            Буцах
          </UButton>
          <div v-else></div>

          <div class="flex items-center gap-3 grow sm:grow-0 justify-end">
            <UButton
              v-if="!isWizardMode"
              color="primary"
              size="xl"
              class="font-black px-10 h-14 rounded-2xl shadow-xl shadow-primary-500/20 grow sm:grow-0"
              @click="saveSettings"
              :loading="saving"
            >
              Хадгалах
            </UButton>

            <template v-else>
              <UButton
                v-if="currentStep < steps.length"
                color="primary"
                size="xl"
                class="font-black px-10 h-14 rounded-2xl shadow-xl shadow-primary-500/20 grow sm:grow-0"
                @click="currentStep++"
                :disabled="!canGoNext"
              >
                Дараах
                <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
              </UButton>
              <UButton
                v-else
                color="primary"
                size="xl"
                class="font-black px-12 h-14 rounded-2xl shadow-xl shadow-primary-500/20 ring-4 ring-primary-500/20 grow sm:grow-0"
                @click="saveSettings"
                :loading="saving"
              >
                Дуусгах
                <UIcon name="i-heroicons-check-badge" class="w-5 h-5 ml-2" />
              </UButton>
            </template>
          </div>
        </div>
      </div> </template
    ><!-- end v-else (settings view) -->
  </div>
</template>

<script setup>
const { token } = useAuth();
const { selectedStoreId, stores, fetchStores, selectStore } = useStore();
const toast = useToast();
const route = useRoute();

const storeName = ref("");
const sheetUrl = ref("");
const instructions = ref("");
const facebookPageId = ref("");
const instagramBusinessId = ref("");
const logoUrl = ref("");
const fbLoading = ref(false);
const fbPagesModal = ref(false);
const loadingPages = ref(false);
const availablePages = ref([]);

const columnMapping = ref({
  name: "",
  price: "",
  stock: "",
  category: "",
});
const hasDelivery = ref(true);
const pickupAddress = ref("");
const deliveryFee = ref(0);
const deliveryTime = ref("");
const paymentDetails = ref({
  bankName: "",
  accountNumber: "",
  accountHolder: "",
  iban: "",
});
const paymentMethod = ref("manual");
const showFBGuide = ref(false);
const loading = ref(false);
const saving = ref(false);
const status = ref(null);
const analysisResult = ref(null);
const analyzing = ref(false);
const copied = ref(false);
const config = useRuntimeConfig();

// Onboarding: true when this is a brand-new user with no connected store yet
const isOnboarding = computed(() => stores.value.length === 0);

// Wizard State
const isWizardMode = ref(false);
const currentStep = ref(1);
const steps = [
  { n: 1, label: "Сошиал холболт", icon: "hub" },
  { n: 2, label: "Барааны сан", icon: "leaderboard" },
  { n: 3, label: "AI Тохиргоо", icon: "psychology" },
];

const templates = [
  {
    name: "Найрсаг",
    value:
      "Чи бол маш найрсаг, эелдэг онлайн дэлгүүрийн туслах юм. Хэрэглэгчдэд 'Баярлалаа', 'Маш их баярлалаа' гэх мэт үгсийг түгээмэл ашиглана.",
  },
  {
    name: "Мэргэжлийн",
    value:
      "Чи бол мэргэжлийн, товч тодорхой хариулдаг туслах юм. Мэдээллийг системтэйгээр, ойлгомжтой өгнө. Сүсэг бишрэл, сул үг ашиглахгүй.",
  },
  {
    name: "Залуулаг",
    value:
      "Чи бол эрч хүчтэй, залуулаг, орчин үеийн хэллэг ашигладаг (emoji ашиглана) туслах юм. Хэрэглэгчдийг 'Найз аа', 'Мэнд ээ' гэх мэтээр дуудаж болно.",
  },
];

// Load initial settings
const loadSettings = async () => {
  if (!selectedStoreId.value) return;

  try {
    const response = await $fetch(`${config.public.apiBase}/stores/settings`, {
      params: { storeId: selectedStoreId.value },
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    if (response.success) {
      storeName.value = response.data.name || "";
      sheetUrl.value = response.data.sheetUrl || "";
      instructions.value = response.data.customInstructions || "";
      facebookPageId.value = response.data.facebookPageId || "";
      instagramBusinessId.value = response.data.instagramBusinessId || "";
      if (response.data.columnMapping) {
        columnMapping.value = { ...response.data.columnMapping };
      }
      hasDelivery.value = response.data.hasDelivery ?? true;
      pickupAddress.value = response.data.pickupAddress || "";
      deliveryFee.value = response.data.deliveryFee || 0;
      deliveryTime.value = response.data.deliveryTime || "";
      if (response.data.paymentDetails) {
        paymentDetails.value = {
          bankName: response.data.paymentDetails.bankName || "",
          accountNumber: response.data.paymentDetails.accountNumber || "",
          accountHolder: response.data.paymentDetails.accountHolder || "",
          iban: response.data.paymentDetails.iban || "",
        };
      }
      paymentMethod.value = response.data.paymentMethod || "manual";
      analysisResult.value = null; // Reset analysis on new store load
      status.value = null;
    }
  } catch (error) {
    console.error("Failed to load settings:", error);
  }
};

const initFacebookSDK = () => {
  if (process.client) {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: config.public.facebookAppId,
        cookie: true,
        xfbml: true,
        version: "v19.0",
      });
    };
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }
};

const startFacebookFlow = (isRetry = false) => {
  if (!window.FB) {
    toast.add({
      title: "Алдаа",
      description: "Facebook SDK ачаалагдаагүй байна.",
      color: "red",
    });
    return;
  }

  fbLoading.value = true;
  showFBGuide.value = false; // Hide guide when flow starts

  const loginOptions = {
    scope:
      "pages_messaging,pages_show_list,pages_manage_metadata,public_profile",
  };

  // If retrying because a page is missing, force the settings dialog
  if (isRetry) {
    loginOptions.auth_type = "rerequest";
  }

  window.FB.login((loginRes) => {
    if (loginRes.authResponse) {
      fetchAvailablePages(loginRes.authResponse.accessToken);
    } else {
      fbLoading.value = false;
      toast.add({
        title: "Цуцаллаа",
        description: "Facebook нэвтрэлт цуцлагдлаа.",
        color: "amber",
      });
    }
  }, loginOptions);
};

const fetchAvailablePages = async (userToken) => {
  fbPagesModal.value = true;
  loadingPages.value = true;
  try {
    const res = await $fetch(`${config.public.apiBase}/stores/facebook/pages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token.value}` },
      body: { userAccessToken: userToken },
    });
    if (res.success) {
      availablePages.value = res.data;
    }
  } catch (err) {
    toast.add({
      title: "Алдаа",
      description: "Page-үүдийн жагсаалтыг авахад алдаа гарлаа.",
      color: "red",
    });
    fbPagesModal.value = false;
  } finally {
    loadingPages.value = false;
    fbLoading.value = false;
  }
};

const connectPage = async (page) => {
  const wasOnboarding = isOnboarding.value; // Capture before connecting
  try {
    const res = await $fetch(
      `${config.public.apiBase}/stores/facebook/connect`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: {
          pageId: page.id,
          pageAccessToken: page.access_token,
          pageName: page.name,
          logoUrl: page.picture?.data?.url,
          instagramBusinessId: page.instagram_business_account?.id,
        },
      },
    );
    if (res.success) {
      facebookPageId.value = page.id;
      instagramBusinessId.value = page.instagram_business_account?.id || "";
      logoUrl.value = page.picture?.data?.url || "";
      storeName.value = page.name;
      fbPagesModal.value = false;
      await fetchStores();

      // Select the newly created/connected store
      if (res.data?._id) {
        selectStore(res.data._id, false);
      }

      if (wasOnboarding) {
        // First-time user: show a welcome toast then go to dashboard
        toast.add({
          title: "🎉 Тавтай морил!",
          description: `"${page.name}" дэлгүүр амжилттай үүслээ. Таны AI ажиллахад бэлэн боллоо.`,
          color: "green",
        });
        await navigateTo("/");
      } else {
        toast.add({
          title: "Амжилттай",
          description: `"${page.name}" хуудас холбогдлоо.`,
          color: "green",
        });
      }
    }
  } catch (err) {
    toast.add({
      title: "Алдаа",
      description: "Холбоход алдаа гарлаа.",
      color: "red",
    });
  }
};

const analyzeSheet = async () => {
  if (!sheetUrl.value) return;
  analyzing.value = true;
  try {
    const res = await $fetch(`${config.public.apiBase}/sync/analyze-sheet`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token.value}` },
      body: { sheetUrl: sheetUrl.value },
    });
    if (res.success) {
      analysisResult.value = res.data;
      columnMapping.value = { ...res.data.mapping.mapping };
    }
  } catch (error) {
    toast.add({
      title: "Алдаа",
      description: error.data?.message || "Шинжилхэд алдаа гарлаа.",
      color: "red",
    });
  } finally {
    analyzing.value = false;
  }
};

const saveSettings = async () => {
  if (!selectedStoreId.value) return;

  saving.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/stores/settings`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: {
        storeId: selectedStoreId.value,
        name: storeName.value,
        sheetUrl: sheetUrl.value,
        customInstructions: instructions.value,
        columnMapping: columnMapping.value,
        hasDelivery: hasDelivery.value,
        pickupAddress: pickupAddress.value,
        deliveryFee: deliveryFee.value,
        deliveryTime: deliveryTime.value,
        paymentDetails: paymentDetails.value,
        paymentMethod: paymentMethod.value,
      },
    });

    if (response.success) {
      toast.add({
        title: "Амжилттай",
        description: "Тохиргоог хадгаллаа.",
        color: "green",
      });
      await fetchStores();

      if (isWizardMode.value) {
        isWizardMode.value = false;
        // Redirect to dashboard or products after completion
        navigateTo("/products");
      }
    }
  } catch (error) {
    console.error("Save failed:", error);
    toast.add({
      title: "Алдаа",
      description: error.data?.message || "Хадгалахад алдаа гарлаа.",
      color: "red",
    });
  } finally {
    saving.value = false;
  }
};

const testConnection = async () => {
  if (!sheetUrl.value) {
    status.value = {
      success: false,
      title: "Алдаа",
      message: "Spreadsheet URL-г оруулна уу",
    };
    return;
  }

  loading.value = true;
  status.value = null;

  try {
    const response = await $fetch(`${config.public.apiBase}/sync/verify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: { sheetUrl: sheetUrl.value },
    });

    if (response.success) {
      status.value = {
        success: true,
        title: "Амжилттай",
        message:
          "Google Sheets амжилттай холбогдож, AI таны хүснэгтийн бүтцийг шинжилж дууслаа. Доорх багануудыг шалгаад үргэлжлүүлнэ үү.",
      };

      // Senior UX: Auto-save the link if we have a store selected
      if (selectedStoreId.value) {
        try {
          await $fetch(`${config.public.apiBase}/stores/settings`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token.value}` },
            body: {
              storeId: selectedStoreId.value,
              sheetUrl: sheetUrl.value,
            },
          });
          console.log("Progress saved: Sheet URL persisted.");
        } catch (saveErr) {
          console.error("Auto-save failed:", saveErr);
        }
      }

      // Automatically analyze sheet structure after connection
      await analyzeSheet();
    }
  } catch (error) {
    console.error("Connection failed:", error);
    status.value = {
      success: false,
      title: "Холболт амжилтгүй",
      message:
        error.data?.message ||
        "Сервертэй холбогдоход алдаа гарлаа. Та эрхээ шалгана уу.",
    };
  } finally {
    loading.value = false;
  }
};

const copyEmail = () => {
  navigator.clipboard.writeText(
    "sheets-writer@order-bot-487704.iam.gserviceaccount.com",
  );
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};

watch(selectedStoreId, loadSettings);

watch(
  () => route.query.action,
  (action) => {
    if (action === "connect_facebook") {
      startFacebookFlow();
    }
  },
  { immediate: true },
);

watch(
  () => [route.query.onboarding, route.query.wizard],
  ([onboarding, wizard]) => {
    isWizardMode.value = onboarding === "true" || wizard === "true";
    if (isWizardMode.value) {
      currentStep.value = 1;
    }
  },
  { immediate: true },
);

const canGoNext = computed(() => {
  if (currentStep.value === 1) {
    return facebookPageId.value && facebookPageId.value !== "pending";
  }

  if (currentStep.value === 2) {
    const hasUrl = !!sheetUrl.value;
    const isAnalyzed = !!analysisResult.value;
    const hasCriticalMappings =
      columnMapping.value.name &&
      columnMapping.value.price &&
      columnMapping.value.stock;

    return hasUrl && isAnalyzed && hasCriticalMappings;
  }

  return true;
});

onMounted(() => {
  loadSettings();
  initFacebookSDK();
});
</script>

<style scoped>
.pb-32 {
  padding-bottom: 8rem;
}
</style>
