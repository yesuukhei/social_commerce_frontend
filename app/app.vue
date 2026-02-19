<script setup>
const { fetchUser, token } = useAuth();
if (token.value) {
  await fetchUser();
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UToaster />
  </div>
</template>
