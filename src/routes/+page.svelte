<script lang="ts">
  import { onMount } from 'svelte';

  interface Shift {
    start: string;
    end: string;
    color: string;
  }

  interface ShiftDay {
    date: Date;
    shift?: Shift;
    type: string; // "day", "night", or "rest"
  }

  const dayShift: Shift = { start: "07:00", end: "19:00", color: "lightblue" };
  const nightShift: Shift = { start: "19:00", end: "07:00", color: "lightgray" };

  let days: ShiftDay[] = [];
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  function daysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  function getStartDay(month: number, year: number): number {
    const startDay = new Date(year, month, 1).getDay();
    return (startDay + 6) % 7; // Adjust for Monday start
  }

  function generateCalendar(month: number, year: number): ShiftDay[] {
    const totalDays = daysInMonth(month, year);
    const startDayOffset = getStartDay(month, year);
    const calendarDays: ShiftDay[] = [];

    let shiftPattern = ["day", "rest24", "night", "rest48"];
    let shiftIndex = 0;

    for (let i = 0; i < startDayOffset; i++) {
      calendarDays.push({
        date: new Date(year, month, i),
        type: "empty",
      });
    }

    for (let i = 1; i <= totalDays; i++) {
      let shiftType = shiftPattern[shiftIndex % shiftPattern.length];
      let shift: Shift | undefined = undefined;

      if (shiftType === "day") {
        shift = dayShift;
        shiftIndex++;
      } else if (shiftType === "night") {
        shift = nightShift;
        shiftIndex++;
      } else if (shiftType === "rest24") {
        shiftIndex++;
      } else if (shiftType === "rest48") {
        shiftIndex += 2;
      }

      calendarDays.push({
        date: new Date(year, month, i),
        shift: shift,
        type: shiftType,
      });
    }

    return calendarDays;
  }

  onMount(() => {
    days = generateCalendar(currentMonth, currentYear);
  });
</script>

<style>
  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    margin: 20px;
  }

  .day {
    padding: 10px;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100px; /* Control height of day cell */
    position: relative;
  }

  .half-cell {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
  }

  /* Half filled background colors */
  .half-right {
    background: linear-gradient(to left, lightgray 50%, transparent 50%);
  }

  .half-left {
    background: linear-gradient(to right, lightgray 50%, transparent 50%);
  }

  /* Shift-day for normal day shifts */
  .shift-day {
    background-color: lightblue;
  }

  /* Rest day style */
  .rest {
    background-color: white;
  }

  .empty {
    background-color: transparent;
  }

  .day-header {
    font-weight: bold;
    text-align: center;
  }

  .right-align {
    text-align: right;
    padding-right: 5px;
  }

  .left-align {
    text-align: left;
    padding-left: 5px;
  }

  .time-text {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
  }

  /* Position time text on the right */
  .time-right {
    right: 5px;
  }

  /* Position time text on the left */
  .time-left {
    left: 5px;
  }
</style>

<div class="calendar">
  <!-- Weekday Headers -->
  <div class="day-header">Mon</div>
  <div class="day-header">Tue</div>
  <div class="day-header">Wed</div>
  <div class="day-header">Thu</div>
  <div class="day-header">Fri</div>
  <div class="day-header">Sat</div>
  <div class="day-header">Sun</div>

  <!-- Generate Calendar Days -->
  {#each days as day, index (day.date)}
    <div class="day {day.type === 'day' ? 'shift-day' : day.type === 'night' ? '' : day.type === 'rest' ? 'rest' : 'empty'}">
      <p>{day.date.getDate()}</p>

      <!-- For night shift -->
      {#if day.type === 'night'}
        <!-- Night Shift Start (19:00) on the starting day -->
        <div class="half-cell half-right">
          <div class="time-text time-right">19:00</div>
        </div>
      {/if}
    </div>

    <!-- If the current day is a night shift, show 07:00 on the next day -->
    {#if day.type === 'night' && days[index + 1]}
      <div class="day {days[index + 1].type === 'rest' ? 'rest' : ''}">
        <p>{days[index + 1].date.getDate()}</p>
        <!-- Night Shift End (07:00) on the next day -->
        <div class="half-cell half-left">
          <div class="time-text time-left">07:00</div>
        </div>
      </div>
    {/if}
  {/each}
</div>
