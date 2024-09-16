<script setup lang="ts">

</script>

<template>
  <div class="flex fixed justify-between top-0 left-0 w-full h-16 bg-gray-700/80 backdrop-blur-md border-gray-700 border-b text-white px-4">
    <h1 class="flex-none text-2xl font-bold content-center"> GreenSpirit </h1>
    <nav class="flex-none content-center text-md font-bold">
      <slot/>
    </nav>
  </div>
</template>