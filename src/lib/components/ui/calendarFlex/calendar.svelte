<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import * as Calendar from "./index.js";
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
  import type { ButtonVariant } from "../button/button.svelte";
  import { getLocalTimeZone, isEqualMonth, today, type DateValue } from "@internationalized/date";
  import type { Snippet } from "svelte";
  import Button from "../button/button.svelte";

  let {
    ref = $bindable(null),
    value = $bindable(),
    placeholder = $bindable(),
    class: className,
    weekdayFormat = "short",
    buttonVariant = "ghost",
    captionLayout = "label",
    locale = "en-US",
    months: monthsProp,
    years,
    monthFormat: monthFormatProp,
    yearFormat = "numeric",
    day,
    disableDaysOutsideMonth = false,
    ...restProps
  }: WithoutChildrenOrChild<CalendarPrimitive.RootProps> & {
    buttonVariant?: ButtonVariant;
    captionLayout?: "dropdown" | "dropdown-months" | "dropdown-years" | "label";
    months?: CalendarPrimitive.MonthSelectProps["months"];
    years?: CalendarPrimitive.YearSelectProps["years"];
    monthFormat?: CalendarPrimitive.MonthSelectProps["monthFormat"];
    yearFormat?: CalendarPrimitive.YearSelectProps["yearFormat"];
    day?: Snippet<[{ day: DateValue; outsideMonth: boolean }]>;
  } = $props();

  const monthFormat = $derived.by(() => {
    if (monthFormatProp) return monthFormatProp;
    if (captionLayout.startsWith("dropdown")) return "short";
    return "long";
  });
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<CalendarPrimitive.Root
  bind:value={value as never}
  bind:ref
  bind:placeholder
  {weekdayFormat}
  {disableDaysOutsideMonth}
  class={cn(
    "h-full p-2 [--cell-radius:var(--radius-md)] bg-background group/calendar in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
    "flex flex-col",
    className,
  )}
  {locale}
  {monthFormat}
  {yearFormat}
  {...restProps}
>
  {#snippet children({ months, weekdays })}
    <Calendar.Months class="flex-1 flex flex-col">
      <Calendar.Nav class="pointer-events-none [&_*]:pointer-events-auto">
        <Calendar.PrevButton variant={buttonVariant} />
        <Calendar.NextButton variant={buttonVariant} />
      </Calendar.Nav>
      <div class="flex-1 flex flex-col overflow-hidden">
        {#each months as month, monthIndex (month)}
          <Calendar.Month class="flex-1 flex flex-col">
            <Calendar.Header>
              <Calendar.Caption
                {captionLayout}
                months={monthsProp}
                {monthFormat}
                {years}
                {yearFormat}
                month={month.value}
                bind:placeholder
                {locale}
                {monthIndex}
              />
              <Button
                variant="outline"
                class="h-10"
                onclick={() => {
                  placeholder = today(getLocalTimeZone());
                  value = today(getLocalTimeZone());
                }}>Today</Button
              >
            </Calendar.Header>
            <Calendar.Grid class="flex-1 flex flex-col">
              <Calendar.GridHead>
                <Calendar.GridRow class="select-none">
                  {#each weekdays as weekday, i (i)}
                    <Calendar.HeadCell>
                      {weekday.slice(0, 2)}
                    </Calendar.HeadCell>
                  {/each}
                </Calendar.GridRow>
              </Calendar.GridHead>
              <Calendar.GridBody class="flex-1 flex flex-col">
                {#each month.weeks as weekDates (weekDates)}
                  <Calendar.GridRow class="flex-1 flex">
                    {#each weekDates as date (date)}
                      <Calendar.Cell {date} month={month.value}>
                        {#if day}
                          {@render day({
                            day: date,
                            outsideMonth: !isEqualMonth(date, month.value),
                          })}
                        {:else}
                          <Calendar.Day />
                        {/if}
                      </Calendar.Cell>
                    {/each}
                  </Calendar.GridRow>
                {/each}
              </Calendar.GridBody>
            </Calendar.Grid>
          </Calendar.Month>
        {/each}
      </div>
    </Calendar.Months>
  {/snippet}
</CalendarPrimitive.Root>
