<script>
import { onMount } from 'svelte';
import { tweened } from 'svelte/motion';
import { fly, scale, slide } from 'svelte/transition';
//   Images from : https://www.dicebear.com/styles/notionists-neutral/#notionists-neutral
// hrs and min are for the clock hands - based on tweened store
// Source: https://github.com/SikandarJODD/motions/tree/master/src/lib/components/craft

let cards = [
  {
    name: 'Bhide',
    location: 'Mumbai, India',
    time: '01:45',
    difference: '+4 hours',
    img: 'https://api.dicebear.com/9.x/notionists-neutral/svg?seed=LN',
    hrs: 52,
    min: 268,
  },
  {
    name: 'Trinity',
    location: 'Berlin, Germany',
    time: '23:38',
    difference: '-3 hours',
    img: 'https://i.pinimg.com/564x/82/97/50/82975051be912461d3c7001302cc55e5.jpg',
    hrs: 349,
    min: 228,
  },
  {
    name: 'Morpheus',
    location: 'London, UK',
    time: '13:12',
    difference: 'No Change',
    img: 'https://api.dicebear.com/9.x/notionists-neutral/svg?seed=lucky',
    hrs: 36,
    min: 72,
  },
  {
    name: 'Pretty Oracle',
    location: 'San Franciso, USA',
    time: '19:12',
    difference: '-1 hours',
    img: 'https://api.dicebear.com/9.x/notionists-neutral/svg?seed=oracle',
    hrs: 216,
    min: 72,
  },
  {
    name: 'Neo',
    location: 'Toronto, Canada',
    time: '05:41',
    difference: '+6 hours',
    img: 'https://i.pinimg.com/564x/88/53/51/88535132322f5669a91b23e34d147dda.jpg',
    hrs: 170,
    min: 246,
  },
];
//   Clock Settings
let hrsbar = tweened(7, { duration: 100 });
let minutebar = tweened(90, { duration: 100 });
let secondbar = tweened(-41, { duration: 10 });

// Clock Text Settings
let hourText = 12;
let minuteText = 15;
onMount(() => {
  let interval = setInterval(() => {
    secondbar.update((val) => val + 6);
  }, 1000);
  return () => clearInterval(interval);
});
</script>

<div class="relative flex min-h-dvh w-full flex-col items-center justify-cente text-black mt-20">
  <div
    class="flex flex-col md:flex-row w-full md:max-w-2xl rounded-3xl shadow-sm border overflow-hidden"
  >
    <div class="w-full md:w-1/2 flex flex-col items-center bg-white">
      <div class="p-8 w-full flex items-center justify-start gap-2">
        <h2 class="text-2xl font-semibold">Team</h2>
        <p class="flex items-center justify-start gap-2">
          <span class="bg-green-500 w-2 h-2 block rounded-full"></span>
          <span class="text-xs text-gray-500">5 online</span>
        </p>
      </div>
      <div class="relative size-[280px] border-0 rounded-full">
        <div class="absolute size-full">
          <!-- Hour Hand -->
          <div
            class="hour-hand duration-300"
            style="transform: translateX(-50%) rotate({$hrsbar}deg);"
          ></div>
          <!-- Minute Hand -->
          <div
            class="minute-hand duration-300"
            style="transform: translateX(-50%) rotate({$minutebar}deg);"
          ></div>
          <!-- Second Hand -->
          <div
            class="second-hand duration-300"
            style="transform: translateX(-50%) rotate({$secondbar}deg);"
          ></div>
        </div>
        <div class="absolute size-full rotate-[4deg]">
          {#each { length: 60 } as item, i}
            <div
              class="dialline"
              style="transform: rotate({6 * i + 1}deg);"
            ></div>
          {/each}
        </div>
        {#key hourText}
          <div class="absolute left-1/2 -translate-x-1/2 bottom-12">
            <span class="text-2xl font-medium text-gray-500">{hourText}</span>
            <span class="text-2xl font-medium text-gray-500">:</span>
            <span
              class="text-2xl font-medium text-gray-500">{minuteText}</span
            >
          </div>
        {/key}
      </div>
    </div>
    <div
      class="w-full md:w-1/2 p-4 bg-slate-50/50 flex flex-col items-center justify-center gap-3"
    >
      {#each cards as card}
        <button
          on:mouseenter={() => {
            hrsbar.set(card.hrs);
            minutebar.set(card.min);
            let timeSplit = card.time.split(":");
            hourText = Number(timeSplit[0]);
            minuteText = Number(timeSplit[1]);
          }}
          on:mouseleave={() => {
            hrsbar.set(7);
            minutebar.set(90);

            hourText = 12;
            minuteText = 15;
          }}
          class="flex items-start gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-lg w-full group duration-300 transition-colors"
          ><div
            class="w-12 h-12 rounded-full flex items-center justify-center border-2 overflow-hidden"
          >
            <img
              src={card.img}
              alt="LN"
              class="w-full h-full object-cover bg-white group-hover:scale-110 duration-300 transition-transform ease-in-out"
            />
          </div>
          <div class="flex-1 flex flex-col items-start">
            <div class="text-md font-medium text-left">{card.name}</div>
            <div class="text-sm text-gray-500 text-left">{card.location}</div>
          </div>
          <div
            class="text-sm font-medium text-gray-500 flex flex-col items-end h-5 overflow-hidden"
          >
            <span
              class="block group-hover:-translate-y-5 duration-300 transition-transform ease-in-out"
              >{card.time}</span
            ><span
              class="group-hover:-translate-y-5 duration-300 transition-transform ease-in-out"
              style="color: {card.difference[0] === '+'
                ? 'green'
                : card.difference[0] === '-'
                  ? 'red'
                  : 'rgb(107, 114, 128)'};">{card.difference}</span
            >
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .second-hand {
    position: absolute;
    z-index: 7;
    width: 2px;
    height: 150px;
    background: #ff253d;
    top: 10px;
    left: 50%;
    /* transform: translate(-50%) rotate(-40deg); */
    border-radius: 30px;
    transform-origin: 50% 130px;
  }
  .minute-hand {
    position: absolute;
    z-index: 6;
    width: 6px;
    height: 140px;
    background: #5f5f5f;
    top: 18px;
    left: 50%;
    transform: translate(-50%);
    border-radius: 30px;
    transform-origin: 50% 120px;
  }
  .hour-hand {
    position: absolute;
    z-index: 5;
    width: 8px;
    height: 80px;
    background: #010101;
    top: 80px;
    transform-origin: 50% 60px;
    left: 50%;
    transform: translate(-50%);
    border-radius: 30px;
  }
  .dialline {
    position: absolute;
    z-index: 2;
    width: 2px;
    height: 15px;
    background: #f3f4f6;
    left: 50%;
    margin-left: -1px;
    transform-origin: 50% 140px;
  }

  .dialline:nth-of-type(5n) {
    width: 3px;
    border-radius: 30px;
    height: 30px;
    background: #d1d5db;
  }
</style>
