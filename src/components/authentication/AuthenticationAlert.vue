<template>
<div class="text-white text-center font-bold p-4 rounded mb-4" 
        :class="variant">
            {{ message }}
    </div>
</template>

<script>
export default {
  name: 'AuthenticationAlert',
  props: {
    message: String,
    variant: String
  }
};
</script>
