<script lang="ts">
  import { onMount } from "svelte";

  onMount(() => {
    console.info("onMount");
    return () => {
      console.info("onDestroy");
    };
  });
</script>

<div>Test</div>
