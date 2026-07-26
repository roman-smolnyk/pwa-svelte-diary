<!-- src/lib/components/Common/Markdown.svelte -->
<script lang="ts">
  import SvelteMarkdown from "@humanspeak/svelte-markdown";

  let { text }: { text: string } = $props();

  let source = $derived.by(() => {
    return text.replace(/(?<=\n)(?![*-])\n/g, "<br/>");
  });
</script>

<div data-component="Markdown" class="css-markdown-render whitespace-pre-wrap">
  <SvelteMarkdown {source} />
</div>
