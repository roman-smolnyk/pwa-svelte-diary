<!-- src/lib/components/Calendar/Calendar.svelte -->
<script lang="ts">
  import CalendarDay from "$lib/components/ui/calendar/calendar-day.svelte";
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
  import DotIcon from "@lucide/svelte/icons/dot";

  let placeholder = $state<CalendarDate | undefined>(today(getLocalTimeZone()));
</script>

<div data-component="Calendar" class="flex-1 w-full h-full">
  <Calendar
    bind:placeholder
    bind:value={diaryStore.selectedDate}
    type="single"
    class="w-full h-full rounded-lg border"
    monthFormat="long"
    captionLayout="dropdown"
    disableDaysOutsideMonth={true}
    weekStartsOn={1}
  >
    {#snippet day({ day, outsideMonth })}
      {@const noteExists = diaryStore.noteDates.includes(day.toString())}
      <CalendarDay class="flex flex-col">
        {day.day}
        {#if !outsideMonth && noteExists}
          <div><DotIcon class="text-destructive size-4" /></div>
        {:else}
          <div class="size-4"></div>
        {/if}
      </CalendarDay>
    {/snippet}
  </Calendar>
</div>
