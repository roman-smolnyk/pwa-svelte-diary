<!-- src/lib/components/Calendar/DiaryCalendar.svelte -->
<script lang="ts">
  import CalendarDay from "$lib/components/ui/calendarFlex/calendar-day.svelte";
  import Calendar from "$lib/components/ui/calendarFlex/calendar.svelte";
  import { appStore } from "$lib/store/appStore.svelte";
  import { diaryStore } from "$lib/store/diaryStore.svelte";
  import { CalendarDate, getLocalTimeZone, today, type DateValue } from "@internationalized/date";
  import DotIcon from "@lucide/svelte/icons/dot";

  let {
    value = $bindable(today(getLocalTimeZone())),
    onValueChange,
  }: { value: CalendarDate | undefined; onValueChange?: (v: DateValue | undefined) => void } = $props();

  let placeholder = $state<CalendarDate>(today(getLocalTimeZone()));

  const maxFutureDate = today(getLocalTimeZone()).add({ years: 50 });
</script>

<div data-component="DiaryCalendar" class="flex-1 w-full h-full">
  <Calendar
    bind:placeholder
    bind:value={diaryStore.selectedDate}
    {onValueChange}
    type="single"
    class="w-full h-full"
    monthFormat="long"
    captionLayout="dropdown"
    disableDaysOutsideMonth={true}
    weekStartsOn={Number(appStore.weekstart) as any}
    maxValue={maxFutureDate}
  >
    {#snippet day({ day, outsideMonth })}
      <CalendarDay class="flex flex-col">
        {day.day}
        {#if !outsideMonth && diaryStore.noteDates.has(day.toString())}
          <div><DotIcon class="text-destructive size-4" /></div>
        {:else}
          <div class="size-4"></div>
        {/if}
      </CalendarDay>
    {/snippet}
  </Calendar>
</div>
