<!-- src/lib/components/Calendar/Calendar.svelte -->
<script lang="ts">
  import CalendarDay from "$lib/components/ui/calendar/calendar-day.svelte";
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import { CalendarDate, isWeekend, today, getLocalTimeZone } from "@internationalized/date";
  import DotIcon from "@lucide/svelte/icons/dot";
  import { Button } from "$lib/components/ui/button";

  // let value = $state<CalendarDate | undefined>(new CalendarDate(2026, 7, 23));
  let placeholder = $state<CalendarDate | undefined>(new CalendarDate(2026, 7, 23));

  function resetViewToToday() {
    placeholder = today(getLocalTimeZone());
  }
  $effect(() => {
    console.debug("placeholder", placeholder);
  });
</script>

<div data-component="Calendar" class="w-full h-full">
  <Calendar
    bind:placeholder
    type="single"
    class="w-full h-full rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(13)]"
    monthFormat="long"
    captionLayout="dropdown"
    disableDaysOutsideMonth={true}
    weekStartsOn={1}
  >
    {#snippet day({ day, outsideMonth })}
      {@const dayIsWeekend = isWeekend(day, "en-US")}
      <CalendarDay class="flex flex-col items-center">
        {day.day}
        {#if !outsideMonth && dayIsWeekend}
          <div><DotIcon class="text-destructive" /></div>
        {:else}
          <div class="size-5"></div>
        {/if}
      </CalendarDay>
    {/snippet}
  </Calendar>
</div>
