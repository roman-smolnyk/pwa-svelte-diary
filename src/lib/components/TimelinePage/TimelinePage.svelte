<!-- src/lib/components/TimelinePage/TimelinePage.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Empty from "$lib/components/ui/empty/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { appStore } from "$lib/store/appStore.svelte";
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import { fromDate, getLocalTimeZone, toCalendarDate, today, type CalendarDate } from "@internationalized/date";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import { onMount, untrack } from "svelte";
  import TimelineNote from "./TimelineNote.svelte";

  let observer: IntersectionObserver;
  let scrollableContainer = $state<HTMLElement | null>(null);
  let datePickerOpen = $state(false);
  let datePickerValue = $state<CalendarDate | undefined>();
  let visibleItems = $state(new Set());

  $effect(() => {
    if (!scrollableContainer) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const itemId = (entry.target.firstChild as HTMLElement)?.getAttribute("data-id");
          if (entry.isIntersecting) visibleItems.add(itemId);
          else visibleItems.delete(itemId);
        });
        visibleItems = new Set(visibleItems);
      },
      {
        root: scrollableContainer,
        threshold: 0.5,
      },
    );

    return () => observer.disconnect();
  });

  $effect(() => {
    if (visibleItems && diaryStore.notes) {
      untrack(() => {
        const visiableNotes = diaryStore.notes.filter((a) => visibleItems.has(a.id));
        visiableNotes.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
        const topNote = visiableNotes[0];
        if (topNote) {
          const calendarDate = toCalendarDate(fromDate(topNote.dateTime, getLocalTimeZone()));
          datePickerValue = calendarDate;
        }
      });
    }
  });

  onMount(() => {
    setTimeout(() => {
      const calendarDate = today(getLocalTimeZone());
      const targetDate = calendarDate.toDate(getLocalTimeZone());
      const closestNote = diaryStore.findNoteWithClosestDate(targetDate);
      console.debug("onMount:closestNote", closestNote?.dateTime.toLocaleString(), closestNote);
      if (closestNote) {
        scrollTo(closestNote.id);
      }
    }, 250);
  });

  function watchVisibility(node: HTMLElement) {
    $effect(() => {
      if (observer) {
        observer.observe(node);
        return () => observer.unobserve(node);
      }
    });
  }

  function scrollTo(id: string) {
    setTimeout(() => {
      const element = document.querySelector(`[data-component="TimelineNote"][data-id="${id}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  }
</script>

<div data-component="TimelinePage" class="flex-1 min-h-0 pt-5 flex flex-col">
  <div class="shrink-0 px-5 mb-4 flex flex-row items-center justify-center gap-2">
    <Popover.Root bind:open={datePickerOpen}>
      <Popover.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="outline" size="lg" class="min-w-35 h-10 justify-between">
            {datePickerValue ? datePickerValue.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        {/snippet}
      </Popover.Trigger>
      <Popover.Content class="w-auto overflow-hidden p-0" align="start">
        <Calendar
          type="single"
          bind:value={datePickerValue}
          captionLayout="dropdown"
          onValueChange={() => {
            if (!datePickerValue) return;
            datePickerOpen = false;
            const targetDate = datePickerValue.toDate(getLocalTimeZone());
            const closestNote = diaryStore.findNoteWithClosestDate(targetDate);
            if (closestNote) {
              scrollTo(closestNote.id);
            }
          }}
          weekStartsOn={Number(appStore.weekstart) as any}
          maxValue={appStore.maxFutureDate}
        />
      </Popover.Content>
    </Popover.Root>
    <Button
      variant="outline"
      // size="lg"
      class="h-10"
      onclick={() => {
        datePickerValue = today(getLocalTimeZone());
        const targetDate = datePickerValue.toDate(getLocalTimeZone());
        const closestNote = diaryStore.findNoteWithClosestDate(targetDate);
        if (closestNote) {
          scrollTo(closestNote.id);
        }
      }}
    >
      Today
    </Button>
  </div>

  <div bind:this={scrollableContainer} class="flex-1 min-h-0 px-5 pb-5 overflow-y-auto flex flex-col gap-4">
    {#each diaryStore.notes as note (note.id)}
      <div use:watchVisibility><TimelineNote {note} /></div>
    {:else}
      <Empty.Root>
        <Empty.Header>
          <Empty.Title>No Notes</Empty.Title>
          <Empty.Description>No notes found</Empty.Description>
        </Empty.Header>
      </Empty.Root>
    {/each}
  </div>
  <div class="shrink-0 min-h-13"></div>
</div>
