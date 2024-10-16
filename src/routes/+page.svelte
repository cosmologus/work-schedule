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
    type: string; // "day", "night-start", "night-end", "rest"
  }

  const dayShift: Shift = { start: "07:00", end: "19:00", color: "lightblue" };
  const nightShift: Shift = { start: "19:00", end: "07:00", color: "lightgray" };

  let days: ShiftDay[] = [];
  let selectedMonth: number = new Date().getMonth(); // Default to the current month
  let selectedYear: number = new Date().getFullYear();
  let firstDayShift: number = 1; // Default to the 1st of the month for the first day shift

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper function to get the number of days in a month
  function daysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  // Helper function to calculate the starting day of the week for the given month and year
  // Adjust the result to make Monday = 0, Sunday = 6
  function getStartDay(month: number, year: number): number {
    const startDay = new Date(year, month, 1).getDay();
    return (startDay + 6) % 7;  // Shift so that Monday is 0 and Sunday is 6
  }

  // Generate the calendar layout, keeping the dates aligned but recalculating the shift pattern
  function generateCalendar(month: number, year: number): ShiftDay[] {
    const totalDays = daysInMonth(month, year);
    const calendarDays: ShiftDay[] = [];
    let currentDate = 1; // Start from the first day of the month
    let isPatternActive = false; // Activate the pattern once we reach the firstDayShift

    // Add empty cells before the first day to align the first day with the correct weekday
    const startDayOffset = getStartDay(month, year);
    for (let i = 0; i < startDayOffset; i++) {
      calendarDays.push({
        date: new Date(year, month, i),
        type: 'empty', // Empty day to fill space before the first day
      });
    }

    // Generate the calendar for the days of the month
    while (currentDate <= totalDays) {
      // Activate the shift pattern once we hit the selected firstDayShift
      if (currentDate >= firstDayShift) {
        isPatternActive = true;
      }

      if (isPatternActive) {
        // Day Shift (07:00 - 19:00)
        if (currentDate <= totalDays) {
          calendarDays.push({
            date: new Date(year, month, currentDate),
            shift: dayShift,
            type: 'day',
          });
          currentDate++;
        }

        // Rest for 24 hours (but night shift starts at 19:00 on the rest day)
        if (currentDate <= totalDays) {
          calendarDays.push({
            date: new Date(year, month, currentDate),
            shift: nightShift,
            type: 'night-start', // Night shift starts at 19:00
          });
          currentDate++;
        }

        // Night Shift ends at 07:00 on the next day
        if (currentDate <= totalDays) {
          calendarDays.push({
            date: new Date(year, month, currentDate),
            shift: nightShift,
            type: 'night-end', // Night shift ends at 07:00
          });
          currentDate++; // Move to the next day after the night shift
        }

        // Rest for exactly 24 hours before the next day shift
        if (currentDate <= totalDays) {
          calendarDays.push({
            date: new Date(year, month, currentDate),
            type: 'rest',
          });
          currentDate++; // Rest for one day
        }
      } else {
        // For days before the first shift day, just render them as normal days without shifts
        calendarDays.push({
          date: new Date(year, month, currentDate),
          type: 'rest',
        });
        currentDate++;
      }
    }

    return calendarDays;
  }

  // Recalculate the calendar whenever the month or first day shift changes
  function recalculateCalendar() {
    days = generateCalendar(selectedMonth, selectedYear);
  }

  // On component mount, generate the calendar for the current month
  onMount(() => {
    recalculateCalendar();
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

  .half-right {
    background-color: lightgray;
    height: 100%;
    width: 50%;
    position: absolute;
    right: 0;
    top: 0;
  }

  .half-left {
    background-color: lightgray;
    height: 100%;
    width: 50%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .shift-day {
    background-color: lightblue;
  }

  .rest {
    background-color: white;
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

  .time-right {
    right: 5px;
  }

  .time-left {
    left: 5px;
  }

  .day p {
  position: relative;
  z-index: 10; /* Ensure the date number is always in front of everything else */
  font-weight: bold; /* Optional: make the date bold for better visibility */
}
</style>

<!-- Month and First Day Shift Selectors -->
<div>
  <label for="month">Select Month:</label>
  <select id="month" bind:value={selectedMonth} on:change={recalculateCalendar}>
    {#each months as month, index}
      <option value={index} selected={selectedMonth === index}>{month}</option>
    {/each}
  </select>

  <label for="firstShiftDay">First Day Shift:</label>
  <input type="number" id="firstShiftDay" bind:value={firstDayShift} min="1" max="31" on:change={recalculateCalendar} />
</div>

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
    <div class="day {day.type === 'day' ? 'shift-day' : day.type === 'night-start' ? '' : day.type === 'night-end' ? '' : day.type === 'rest' ? 'rest' : 'empty'}">
      {#if day.type !== 'empty'}
        <p>{day.date.getDate()}</p>
      {/if}

      <!-- For night shift start -->
      {#if day.type === 'night-start'}
        <div class="half-cell">
          <div class="half-right"></div> <!-- Right half of the cell filled -->
          <div class="time-text time-right">19:00</div>
        </div>
      {/if}

      <!-- For night shift end -->
      {#if day.type === 'night-end'}
        <div class="half-cell">
          <div class="half-left"></div> <!-- Left half of the cell filled -->
          <div class="time-text time-left">07:00</div>
        </div>
      {/if}
    </div>
  {/each}
</div>
