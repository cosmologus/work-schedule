import { c as create_ssr_component, e as each } from "../../chunks/ssr.js";
import { e as escape } from "../../chunks/escape.js";
const css = {
  code: ".calendar.svelte-1i4xc8c.svelte-1i4xc8c{display:grid;grid-template-columns:repeat(7, 1fr);gap:5px;margin:20px}.day.svelte-1i4xc8c.svelte-1i4xc8c{padding:10px;border:1px solid #ccc;display:flex;flex-direction:column;justify-content:space-between;height:100px;position:relative}.half-right.svelte-1i4xc8c.svelte-1i4xc8c{background-color:lightgray;height:100%;width:50%;position:absolute;right:0;top:0}.half-left.svelte-1i4xc8c.svelte-1i4xc8c{background-color:lightgray;height:100%;width:50%;position:absolute;left:0;top:0}.shift-day.svelte-1i4xc8c.svelte-1i4xc8c{background-color:lightblue}.rest.svelte-1i4xc8c.svelte-1i4xc8c{background-color:white}.day-header.svelte-1i4xc8c.svelte-1i4xc8c{font-weight:bold;text-align:center}.month-group.svelte-1i4xc8c.svelte-1i4xc8c{margin-bottom:20px}.day.svelte-1i4xc8c p.svelte-1i4xc8c{position:relative;z-index:10;font-weight:bold}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { onMount } from \\"svelte\\";\\nconst dayShift = { start: \\"07:00\\", end: \\"19:00\\", color: \\"lightblue\\" };\\nconst nightShift = { start: \\"19:00\\", end: \\"07:00\\", color: \\"lightgray\\" };\\nlet days = [];\\nlet selectedMonth = 9;\\nlet selectedYear = (/* @__PURE__ */ new Date()).getFullYear();\\nlet firstDayShift = 16;\\nconst currentMonth = (/* @__PURE__ */ new Date()).getMonth();\\nconst months = [\\n  \\"January\\",\\n  \\"February\\",\\n  \\"March\\",\\n  \\"April\\",\\n  \\"May\\",\\n  \\"June\\",\\n  \\"July\\",\\n  \\"August\\",\\n  \\"September\\",\\n  \\"October\\",\\n  \\"November\\",\\n  \\"December\\"\\n];\\nfunction daysInMonth(month, year) {\\n  return new Date(year, month + 1, 0).getDate();\\n}\\nfunction getStartDay(month, year) {\\n  const startDay = new Date(year, month, 1).getDay();\\n  return (startDay + 6) % 7;\\n}\\nfunction generateCalendar(month, year) {\\n  const totalDays = daysInMonth(month, year);\\n  const calendarDays = [];\\n  const referenceDate = new Date(selectedYear, 9, 16);\\n  const currentMonthFirstDay = new Date(year, month, 1);\\n  const daysSinceFirstShift = Math.floor((currentMonthFirstDay.getTime() - referenceDate.getTime()) / (1e3 * 60 * 60 * 24));\\n  let patternOffset = (daysSinceFirstShift % 4 + 4) % 4;\\n  let currentDate = 1;\\n  const startDayOffset = getStartDay(month, year);\\n  for (let i = 0; i < startDayOffset; i++) {\\n    calendarDays.push({\\n      date: new Date(year, month, i),\\n      type: \\"empty\\"\\n      // Empty day to fill space before the first day\\n    });\\n  }\\n  while (currentDate <= totalDays) {\\n    switch (patternOffset) {\\n      case 0:\\n        if (currentDate <= totalDays) {\\n          calendarDays.push({\\n            date: new Date(year, month, currentDate),\\n            shift: dayShift,\\n            type: \\"day\\"\\n          });\\n          currentDate++;\\n        }\\n        break;\\n      case 1:\\n        if (currentDate <= totalDays) {\\n          calendarDays.push({\\n            date: new Date(year, month, currentDate),\\n            shift: nightShift,\\n            type: \\"night-start\\"\\n            // Night shift starts at 19:00\\n          });\\n          currentDate++;\\n        }\\n        break;\\n      case 2:\\n        if (currentDate <= totalDays) {\\n          calendarDays.push({\\n            date: new Date(year, month, currentDate),\\n            shift: nightShift,\\n            type: \\"night-end\\"\\n            // Night shift ends at 07:00\\n          });\\n          currentDate++;\\n        }\\n        break;\\n      case 3:\\n        if (currentDate <= totalDays) {\\n          calendarDays.push({\\n            date: new Date(year, month, currentDate),\\n            type: \\"rest\\"\\n          });\\n          currentDate++;\\n        }\\n        break;\\n    }\\n    patternOffset = (patternOffset + 1) % 4;\\n  }\\n  return calendarDays;\\n}\\nfunction recalculateCalendar() {\\n  days = generateCalendar(selectedMonth, selectedYear);\\n}\\nonMount(() => {\\n  recalculateCalendar();\\n});\\n<\/script>\\n\\n<style>\\n  .calendar {\\n    display: grid;\\n    grid-template-columns: repeat(7, 1fr);\\n    gap: 5px;\\n    margin: 20px;\\n  }\\n\\n  .day {\\n    padding: 10px;\\n    border: 1px solid #ccc;\\n    display: flex;\\n    flex-direction: column;\\n    justify-content: space-between;\\n    height: 100px; /* Control height of day cell */\\n    position: relative;\\n  }\\n\\n  .half-right {\\n    background-color: lightgray;\\n    height: 100%;\\n    width: 50%;\\n    position: absolute;\\n    right: 0;\\n    top: 0;\\n  }\\n\\n  .half-left {\\n    background-color: lightgray;\\n    height: 100%;\\n    width: 50%;\\n    position: absolute;\\n    left: 0;\\n    top: 0;\\n  }\\n\\n  .shift-day {\\n    background-color: lightblue;\\n  }\\n\\n  .rest {\\n    background-color: white;\\n  }\\n\\n  .day-header {\\n    font-weight: bold;\\n    text-align: center;\\n  }\\n\\n  .right-align {\\n    text-align: right;\\n    padding-right: 5px;\\n    z-index: 1; /* Ensure time text stays above background */\\n  }\\n\\n  .left-align {\\n    text-align: left;\\n    padding-left: 5px;\\n    z-index: 1; /* Ensure time text stays above background */\\n  }\\n\\n  .time-text {\\n    position: absolute;\\n    top: 0;\\n    bottom: 0;\\n    display: flex;\\n    align-items: center;\\n  }\\n\\n  .time-right {\\n    right: 5px;\\n  }\\n\\n  .time-left {\\n    left: 5px;\\n  }\\n\\n  .month-group {\\n    margin-bottom: 20px;\\n  }\\n\\n  .day p {\\n    position: relative;\\n    z-index: 10; /* Ensure the date number is always in front of everything else */\\n    font-weight: bold; /* Optional: make the date bold for better visibility */\\n  }\\n</style>\\n\\n<!-- Month and First Day Shift Selectors -->\\n<!-- <div>\\n  <label for=\\"month\\">Select Month:</label>\\n  <select id=\\"month\\" bind:value={selectedMonth} on:change={recalculateCalendar}>\\n    {#each months.slice(currentMonth, 12) as month, index}\\n      <option value={index + currentMonth}>{month} {selectedYear}</option>\\n    {/each}\\n    {#each months as month, index}\\n      <option value={index}>{month} {selectedYear + 1}</option>\\n    {/each}\\n  </select>\\n\\n  <label for=\\"firstShiftDay\\">First Day Shift:</label>\\n  <input type=\\"number\\" id=\\"firstShiftDay\\" bind:value={firstDayShift} min=\\"1\\" max=\\"31\\" on:change={recalculateCalendar} />\\n</div> -->\\n\\n<!-- Calendar Display -->\\n<div class=\\"month-group\\">\\n  <!-- Current Year months from now -->\\n  {#each months.slice(currentMonth, 12) as month, index}\\n    <div class=\\"day-header\\">{month} {selectedYear}</div>\\n    <div class=\\"calendar\\">\\n      {#each generateCalendar(index + currentMonth, selectedYear) as day}\\n        <div class=\\"day {day.type === 'day' ? 'shift-day' : day.type === 'night-start' ? '' : day.type === 'night-end' ? '' : day.type === 'rest' ? 'rest' : 'empty'}\\">\\n          {#if day.type !== 'empty'}\\n            <p>{day.date.getDate()}</p>\\n          {/if}\\n\\n          <!-- Night Shift visualization -->\\n          {#if day.type === 'night-start'}\\n            <div class=\\"half-cell\\">\\n              <div class=\\"half-right\\"></div>\\n            </div>\\n          {/if}\\n\\n          {#if day.type === 'night-end'}\\n            <div class=\\"half-cell\\">\\n              <div class=\\"half-left\\"></div>\\n            </div>\\n          {/if}\\n        </div>\\n      {/each}\\n    </div>\\n  {/each}\\n\\n  <!-- Next Year months -->\\n  {#each months as month, index}\\n    <div class=\\"day-header\\">{month} {selectedYear + 1}</div>\\n    <div class=\\"calendar\\">\\n      {#each generateCalendar(index, selectedYear + 1) as day}\\n        <div class=\\"day {day.type === 'day' ? 'shift-day' : day.type === 'night-start' ? '' : day.type === 'night-end' ? '' : day.type === 'rest' ? 'rest' : 'empty'}\\">\\n          {#if day.type !== 'empty'}\\n            <p>{day.date.getDate()}</p>\\n          {/if}\\n\\n          <!-- Night Shift visualization -->\\n          {#if day.type === 'night-start'}\\n            <div class=\\"half-cell\\">\\n              <div class=\\"half-right\\"></div>\\n            </div>\\n          {/if}\\n\\n          {#if day.type === 'night-end'}\\n            <div class=\\"half-cell\\">\\n              <div class=\\"half-left\\"></div>\\n            </div>\\n          {/if}\\n        </div>\\n      {/each}\\n    </div>\\n  {/each}\\n</div>\\n"],"names":[],"mappings":"AAsGE,uCAAU,CACR,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,OAAO,CAAC,CAAC,CAAC,GAAG,CAAC,CACrC,GAAG,CAAE,GAAG,CACR,MAAM,CAAE,IACV,CAEA,kCAAK,CACH,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,CACtB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,aAAa,CAC9B,MAAM,CAAE,KAAK,CACb,QAAQ,CAAE,QACZ,CAEA,yCAAY,CACV,gBAAgB,CAAE,SAAS,CAC3B,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,GAAG,CACV,QAAQ,CAAE,QAAQ,CAClB,KAAK,CAAE,CAAC,CACR,GAAG,CAAE,CACP,CAEA,wCAAW,CACT,gBAAgB,CAAE,SAAS,CAC3B,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,GAAG,CACV,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CACP,CAEA,wCAAW,CACT,gBAAgB,CAAE,SACpB,CAEA,mCAAM,CACJ,gBAAgB,CAAE,KACpB,CAEA,yCAAY,CACV,WAAW,CAAE,IAAI,CACjB,UAAU,CAAE,MACd,CA8BA,0CAAa,CACX,aAAa,CAAE,IACjB,CAEA,mBAAI,CAAC,gBAAE,CACL,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,EAAE,CACX,WAAW,CAAE,IACf"}`
};
function daysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}
function getStartDay(month, year) {
  const startDay = new Date(year, month, 1).getDay();
  return (startDay + 6) % 7;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const dayShift = {
    start: "07:00",
    end: "19:00",
    color: "lightblue"
  };
  const nightShift = {
    start: "19:00",
    end: "07:00",
    color: "lightgray"
  };
  let selectedYear = /* @__PURE__ */ (/* @__PURE__ */ new Date()).getFullYear();
  const currentMonth = /* @__PURE__ */ (/* @__PURE__ */ new Date()).getMonth();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  function generateCalendar(month, year) {
    const totalDays = daysInMonth(month, year);
    const calendarDays = [];
    const referenceDate = new Date(selectedYear, 9, 16);
    const currentMonthFirstDay = new Date(year, month, 1);
    const daysSinceFirstShift = Math.floor((currentMonthFirstDay.getTime() - referenceDate.getTime()) / (1e3 * 60 * 60 * 24));
    let patternOffset = (daysSinceFirstShift % 4 + 4) % 4;
    let currentDate = 1;
    const startDayOffset = getStartDay(month, year);
    for (let i = 0; i < startDayOffset; i++) {
      calendarDays.push({
        date: new Date(year, month, i),
        type: "empty"
      });
    }
    while (currentDate <= totalDays) {
      switch (patternOffset) {
        case 0:
          if (currentDate <= totalDays) {
            calendarDays.push({
              date: new Date(year, month, currentDate),
              shift: dayShift,
              type: "day"
            });
            currentDate++;
          }
          break;
        case 1:
          if (currentDate <= totalDays) {
            calendarDays.push({
              date: new Date(year, month, currentDate),
              shift: nightShift,
              type: "night-start"
            });
            currentDate++;
          }
          break;
        case 2:
          if (currentDate <= totalDays) {
            calendarDays.push({
              date: new Date(year, month, currentDate),
              shift: nightShift,
              type: "night-end"
            });
            currentDate++;
          }
          break;
        case 3:
          if (currentDate <= totalDays) {
            calendarDays.push({
              date: new Date(year, month, currentDate),
              type: "rest"
            });
            currentDate++;
          }
          break;
      }
      patternOffset = (patternOffset + 1) % 4;
    }
    return calendarDays;
  }
  $$result.css.add(css);
  return `   <div class="month-group svelte-1i4xc8c"> ${each(months.slice(currentMonth, 12), (month, index) => {
    return `<div class="day-header svelte-1i4xc8c">${escape(month)} ${escape(selectedYear)}</div> <div class="calendar svelte-1i4xc8c">${each(generateCalendar(index + currentMonth, selectedYear), (day) => {
      return `<div class="${"day " + escape(
        day.type === "day" ? "shift-day" : day.type === "night-start" ? "" : day.type === "night-end" ? "" : day.type === "rest" ? "rest" : "empty",
        true
      ) + " svelte-1i4xc8c"}">${day.type !== "empty" ? `<p class="svelte-1i4xc8c">${escape(day.date.getDate())}</p>` : ``}  ${day.type === "night-start" ? `<div class="half-cell" data-svelte-h="svelte-1uvij5p"><div class="half-right svelte-1i4xc8c"></div> </div>` : ``} ${day.type === "night-end" ? `<div class="half-cell" data-svelte-h="svelte-qikw8a"><div class="half-left svelte-1i4xc8c"></div> </div>` : ``} </div>`;
    })} </div>`;
  })}  ${each(months, (month, index) => {
    return `<div class="day-header svelte-1i4xc8c">${escape(month)} ${escape(selectedYear + 1)}</div> <div class="calendar svelte-1i4xc8c">${each(generateCalendar(index, selectedYear + 1), (day) => {
      return `<div class="${"day " + escape(
        day.type === "day" ? "shift-day" : day.type === "night-start" ? "" : day.type === "night-end" ? "" : day.type === "rest" ? "rest" : "empty",
        true
      ) + " svelte-1i4xc8c"}">${day.type !== "empty" ? `<p class="svelte-1i4xc8c">${escape(day.date.getDate())}</p>` : ``}  ${day.type === "night-start" ? `<div class="half-cell" data-svelte-h="svelte-1uvij5p"><div class="half-right svelte-1i4xc8c"></div> </div>` : ``} ${day.type === "night-end" ? `<div class="half-cell" data-svelte-h="svelte-qikw8a"><div class="half-left svelte-1i4xc8c"></div> </div>` : ``} </div>`;
    })} </div>`;
  })}</div>`;
});
export {
  Page as default
};
