<script lang="ts">
  import { onMount } from 'svelte';

  // Define the structure of shifts and days
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

  // Define shifts: day shift and night shift
  const dayShift: Shift = { start: "07:00", end: "19:00", color: "lightblue" };
  const nightShift: Shift = { start: "19:00", end: "07:00", color: "lightgray" };

  // Calendar and shifts state
  let days: ShiftDay[] = [];
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  // Helper function to get the number of days in a month
  function daysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  // Generate work shifts based on the work schedule pattern
  function generateCalendar(month: number, year: number): ShiftDay[] {
    const totalDays = daysInMonth(month, year);
    const calendarDays: ShiftDay[] = [];
    let shiftPattern = ["day", "rest24", "night", "rest48"]; // Day, 24h rest, night, 48h rest
    let shiftIndex = 0;

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
        shiftIndex += 2; // Skip two days for 48-hour rest
      }

      calendarDays.push({
        date: new Date(year, month, i),
        shift: shift,
        type: shiftType,
      });
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
    text-align: center;
  }

  .shift-day {
    background-color: lightblue;
  }

  .shift-night {
    background-color: lightgray;
  }

  .rest {
    background-color: white;
  }

  .day-header {
    font-weight: bold;
    text-align: center;
  }

  @media (max-width: 600px) {
    .calendar {
      grid-template-columns: repeat(2, 1fr); /* Stack into two columns on smaller screens */
    }
  }

</style>

<!-- Calendar Layout -->
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
  {#each days as day (day.date)}
  <!-- Dynamically apply classes based on shift type -->
      <div class="day {day.type === 'day' ? 'shift-day' : day.type === 'night' ? 'shift-night' : 'rest'}">
      <p>{day.date.getDate()}</p>
      {#if day.shift}
        <p>{day.shift.start} - {day.shift.end}</p>
      {/if}
    </div>
  {/each}
</div>
