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

  // Helper function to get the number of days in a month
  function daysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  // Generate work shifts based on the correct pattern: day shift, 24 hours rest, night shift, 48 hours rest
  function generateCalendar(month: number, year: number): ShiftDay[] {
    const totalDays = daysInMonth(month, year);
    const calendarDays: ShiftDay[] = [];
    let currentDate = 1; // Start from the first day of the month

    while (currentDate <= totalDays) {
      const currentDateObj = new Date(year, month, currentDate);

      // Day Shift
      if (currentDate <= totalDays) {
        calendarDays.push({
          date: new Date(year, month, currentDate),
          shift: dayShift,
          type: 'day',
        });
        currentDate++; // Move to the next day
      }

      // Rest for 24 hours
      if (currentDate <= totalDays) {
        calendarDays.push({
          date: new Date(year, month, currentDate),
          type: 'rest',
        });
        currentDate++; // Skip 1 day for rest
      }

      // Night Shift (19:00 on one day, 07:00 on the next)
      if (currentDate <= totalDays) {
        calendarDays.push({
          date: new Date(year, month, currentDate),
          shift: nightShift,
          type: 'night',
        });
        currentDate++; // Move to the next day for the night shift continuation
      }

      // Rest for 48 hours
      if (currentDate <= totalDays) {
        calendarDays.push({
          date: new Date(year, month, currentDate),
          type: 'rest',
        });
        currentDate++; // Skip 1 day for rest (first 24 hours)
      }
      if (currentDate <= totalDays) {
        calendarDays.push({
          date: new Date(year, month, currentDate),
          type: 'rest',
        });
        currentDate++; // Skip another day for rest (second 24 hours)
      }
    }

    return calendarDays;
  }

  // On component mount, generate the calendar for the current month
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

  /* Full-height, half-width grey background for right side */
  .half-right {
    background-color: lightgray;
    height: 100%;
    width: 50%;
    position: absolute;
    right: 0;
    top: 0;
  }

  /* Full-height, half-width grey background for left side */
  .half-left {
    background-color: lightgray;
    height: 100%;
    width: 50%;
    position: absolute;
    left: 0;
    top: 0;
  }

  /* Shift-day for normal day shifts */
  .shift-day {
    background-color: lightblue;
  }

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
    z-index: 1; /* Ensure time text stays above background */
  }

  .left-align {
    text-align: left;
    padding-left: 5px;
    z-index: 1; /* Ensure time text stays above background */
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
        <div class="half-cell">
          <div class="half-right"></div> <!-- Right half of the cell filled -->
          <div class="time-text time-right">19:00</div>
        </div>
      {/if}
    </div>

    <!-- If the current day is a night shift, show 07:00 on the next day -->
    {#if day.type === 'night' && days[index + 1]}
      <div class="day {days[index + 1].type === 'rest' ? 'rest' : ''}">
        <p>{days[index + 1].date.getDate()}</p>
        <!-- Night Shift End (07:00) on the next day -->
        <div class="half-cell">
          <div class="half-left"></div> <!-- Left half of the cell filled -->
          <div class="time-text time-left">07:00</div>
        </div>
      </div>
    {/if}
  {/each}
</div>
