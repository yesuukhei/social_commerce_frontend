<script setup>
const { fetchUser, token, user } = useAuth();

// Токен байгаа боловч хэрэглэгч ачаалагдаагүй бол татна
if (token.value && !user.value) {
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
