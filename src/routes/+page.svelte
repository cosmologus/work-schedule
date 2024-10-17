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
  let selectedMonth: number = 9; // October is the 9th month (0-indexed)
  let selectedYear: number = new Date().getFullYear();
  let firstDayShift: number = 16; // Set first day shift to 16th of October

  const currentMonth: number = new Date().getMonth(); // Current month (0-indexed)
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

// Generate the calendar layout, keeping the dates aligned but continuing the shift pattern across months
function generateCalendar(month: number, year: number): ShiftDay[] {
  const totalDays = daysInMonth(month, year);
  const calendarDays: ShiftDay[] = [];
  
  // Calculate the number of days since the firstDayShift (16th of October) to continue the pattern
  const referenceDate = new Date(selectedYear, 9, 16); // 16th of October as reference start
  const currentMonthFirstDay = new Date(year, month, 1);
  const daysSinceFirstShift = Math.floor((currentMonthFirstDay.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
  let patternOffset = (daysSinceFirstShift % 4 + 4) % 4;  // Use modulo to calculate the correct shift phase
  
  let currentDate = 1;
  
  // Add empty cells before the first day to align the first day with the correct weekday
  const startDayOffset = getStartDay(month, year);
  for (let i = 0; i < startDayOffset; i++) {
    calendarDays.push({
      date: new Date(year, month, i),
      type: 'empty', // Empty day to fill space before the first day
    });
  }

  // Generate the calendar for the days of the month based on the shift pattern
  while (currentDate <= totalDays) {
    switch (patternOffset) {
      case 0: // Day shift
        if (currentDate <= totalDays) {
          calendarDays.push({
            date: new Date(year, month, currentDate),
            shift: dayShift,
            type: 'day',
          });
          currentDate++;
        }
        break;

      case 1: // Night shift start
        if (currentDate <= totalDays) {
          calendarDays.push({
            date: new Date(year, month, currentDate),
            shift: nightShift,
            type: 'night-start', // Night shift starts at 19:00
          });
          currentDate++;
        }
        break;

      case 2: // Night shift end
        if (currentDate <= totalDays) {
          calendarDays.push({
            date: new Date(year, month, currentDate),
            shift: nightShift,
            type: 'night-end', // Night shift ends at 07:00
          });
          currentDate++;
        }
        break;

      case 3: // Rest day
        if (currentDate <= totalDays) {
          calendarDays.push({
            date: new Date(year, month, currentDate),
            type: 'rest',
          });
          currentDate++;
        }
        break;
    }
    
    // Cycle through the shift pattern (0 = day, 1 = night-start, 2 = night-end, 3 = rest)
    patternOffset = (patternOffset + 1) % 4;
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

  .month-group {
    margin-bottom: 20px;
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
    {#each months.slice(currentMonth, 12) as month, index}
      <option value={index + currentMonth}>{month} {selectedYear}</option>
    {/each}
    {#each months as month, index}
      <option value={index}>{month} {selectedYear + 1}</option>
    {/each}
  </select>

  <label for="firstShiftDay">First Day Shift:</label>
  <input type="number" id="firstShiftDay" bind:value={firstDayShift} min="1" max="31" on:change={recalculateCalendar} />
</div>

<!-- Calendar Display -->
<div class="month-group">
  <!-- Current Year months from now -->
  {#each months.slice(currentMonth, 12) as month, index}
    <div class="day-header">{month} {selectedYear}</div>
    <div class="calendar">
      {#each generateCalendar(index + currentMonth, selectedYear) as day}
        <div class="day {day.type === 'day' ? 'shift-day' : day.type === 'night-start' ? '' : day.type === 'night-end' ? '' : day.type === 'rest' ? 'rest' : 'empty'}">
          {#if day.type !== 'empty'}
            <p>{day.date.getDate()}</p>
          {/if}

          <!-- Night Shift visualization -->
          {#if day.type === 'night-start'}
            <div class="half-cell">
              <div class="half-right"></div>
            </div>
          {/if}

          {#if day.type === 'night-end'}
            <div class="half-cell">
              <div class="half-left"></div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/each}

  <!-- Next Year months -->
  {#each months as month, index}
    <div class="day-header">{month} {selectedYear + 1}</div>
    <div class="calendar">
      {#each generateCalendar(index, selectedYear + 1) as day}
        <div class="day {day.type === 'day' ? 'shift-day' : day.type === 'night-start' ? '' : day.type === 'night-end' ? '' : day.type === 'rest' ? 'rest' : 'empty'}">
          {#if day.type !== 'empty'}
            <p>{day.date.getDate()}</p>
          {/if}

          <!-- Night Shift visualization -->
          {#if day.type === 'night-start'}
            <div class="half-cell">
              <div class="half-right"></div>
            </div>
          {/if}

          {#if day.type === 'night-end'}
            <div class="half-cell">
              <div class="half-left"></div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>
