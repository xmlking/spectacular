<script lang="ts">
import { langs } from '@spectacular/smart';
import { onMount } from 'svelte';

// TODO https://github.com/herebefrogs/dictafone.app/tree/main/src/routes
// https://github.com/jhubbardsf/svelte-speech-recognition/tree/master?tab=readme-ov-file

// if ('SpeechSynthesisUtterance' in window) {
//   // Your browser support for Speech Synthesis.
// } else {
//   //Your browser does not support for Speech Synthesis.
// }

// if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
//   showInfo('info_start');
// } else {
//   showInfo('info_upgrade');
// }

// onMount(() => {
//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   var recognition = new SpeechRecognition();
//   // recognition.lang = 'th-TH'
//   //recognition.interimResults = false
//   recognition.interimResults = true; // เมื่อเรากำลังพูดอยู่ API ก็จะส่งข้อความที่มันวิเคราะห์ได้ ณ ขณะนั้นเป็น result แม้เรายังพูดไม่จบประโยค
//   //recognition.maxAlternatives = 1
//   recognition.continuous = true; // ต่อเนื่องไปเรื่อยๆ
//   recognition.onspeechend = function () {
//     // recognition.stop(); // เมื่อพูดจบ ให้ปิดการบันทึกเสียง
//   };
//   var final_transcript = '';
//   var start_timestamp;

//   recognition.onstart = () => {
//     //start_img.src = 'images/mic-animate.gif';
//     showInfo('info_speak_now');
//     record_button.style.display = 'inline-block';
//   };
//   recognition.onend = () => {
//     //start_img.src = 'images/mic.gif';
//     showInfo('info_finish');
//     //console.log('Speech recognition service disconnected');
//     start_button.style.display = 'inline-block';
//     record_button.style.display = 'none';
//   };

//   recognition.onerror = (event) => {
//     if (event.error === 'no-speech') {
//       //start_img.src = 'images/mic.gif';
//       showInfo('info_no_speech');
//     }
//     if (event.error === 'audio-capture') {
//       //start_img.src = 'images/mic.gif';
//       showInfo('info_no_microphone');
//     }
//     if (event.error === 'not-allowed') {
//       if (event.timeStamp - start_timestamp < 100) {
//         showInfo('info_blocked');
//       } else {
//         showInfo('info_denied');
//       }
//     }
//   };

//   recognition.onresult = (event) => {
//     var interim_transcript = '';
//     if (typeof event.results === 'undefined') {
//       recognition.onend = null;
//       recognition.stop();
//       showInfo('info_upgrade');
//       return;
//     }

//     for (var i = event.resultIndex; i < event.results.length; ++i) {
//       var speechRecognitionAlternative = event.results[i][0];
//       text_msg = speechRecognitionAlternative.transcript;
//       console.log(text_msg, ' ,confidence:', speechRecognitionAlternative.confidence);
//       if (event.results[i].isFinal) {
//         //final_transcript += event.results[i][0].transcript + '&nbsp';
//         final_transcript += text_msg + '&nbsp';
//       } else {
//         //interim_transcript +=  event.results[i][0].transcript;
//         interim_transcript += text_msg;
//       }
//       final_span.innerHTML = linebreak(final_transcript);
//       interim_span.innerHTML = linebreak(interim_transcript);
//     }
//   };

//   var two_line = /\n\n/g;
//   var one_line = /\n/g;
//   function linebreak(s) {
//     return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
//   }

//   function startButton(event) {
//     final_transcript = '';
//     recognition.lang = select_dialect.value;
//     //recognition.lang = 'th-TH'
//     recognition.start(); // เริ่มบันทึกเสียง
//     //ignore_onend = false;
//     final_span.innerHTML = '';
//     interim_span.innerHTML = '';
//     //start_img.src = 'images/mic-slash.gif';
//     showInfo('info_allow');
//     //showButtons('none');
//     start_button.style.display = 'none';
//     record_button.style.display = 'inline-block';
//     start_timestamp = event.timeStamp;
//   }

//   function stopButton(event) {
//     recognition.stop();
//     showInfo('info_stop');
//   }

//   for (let i = 0; i < langs.length; i++) {
//     select_language.options[i] = new Option(langs[i][0], i);
//   }
//   // Set default language / dialect.
//   select_language.selectedIndex = 10;
//   updateCountry();
//   select_dialect.selectedIndex = 11;
//   showInfo('info_start');

//   function updateCountry() {
//     for (var i = select_dialect.options.length - 1; i >= 0; i--) {
//       select_dialect.remove(i);
//     }
//     var list = langs[select_language.selectedIndex];
//     for (var i = 1; i < list.length; i++) {
//       select_dialect.options.add(new Option(list[i][1], list[i][0]));
//     }
//     select_dialect.style.visibility = list[1].length === 1 ? 'hidden' : 'visible';
//   }

//   function showInfo(s) {
//     if (s) {
//        const info = document.getElementById("info1");
//       for (let child = info.firstChild; child; child = child.nextSibling) {
//         if (child.style) {
//           child.style.display = child.id === s ? "inline" : "none";
//         }
//       }
//       info.style.visibility = "visible";
//     } else {
//       info.style.visibility = "hidden";
//     }
//   }
// });
</script>

<div class="page-container">
  <div class="page-section">
    <header class="flex justify-between">
      <h1 class="h1">Speach TODO (W.I.P)</h1>
    </header>
<div class="marquee">
  <div id="info">
    <p id="info_support">Your browser supports for Speech Recognition.</p>
    <p id="info_start" style="display:none">
      Click on the microphone icon and begin speaking for as long as you like.
    </p>
    <p id="info_finish" style="display:none">
      Speech recognition service disconnected.
    </p>
    <p id="info_speak_now" style="display:none">
      ลองพูดอะไรมาก็ได้ (Speak now).
    </p>
    <p id="info_no_speech" style="display:none">
      No speech was detected. You may need to adjust your <a
        href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892"
        >microphone settings</a
      >.
    </p>
    <p id="info_no_microphone" style="display:none">
      No microphone was found. Ensure that a microphone is installed and that
      <a
        href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892"
      >
        microphone settings</a
      > are configured correctly.
    </p>
    <p id="info_allow" style="display:none">
      Click the "Allow" button above to enable your microphone.
    </p>
    <p id="info_denied" style="display:none">
      Permission to use microphone was denied.
    </p>
    <p id="info_blocked" style="display:none">
      Permission to use microphone is blocked. To change, go to
      chrome://settings/contentExceptions#media-stream
    </p>
    <p id="info_upgrade" style="display:none">
      Web Speech API is not supported by this browser. Upgrade to <a
        href="//www.google.com/chrome">Chrome</a
      > version 25 or later.
    </p>
  </div>

  <!--<h3 id = "warning">ลองพูดอะไรมาก็ได้</h3>-->
  <div id="results">
    <span class="final" id="final_span"></span>
    <span class="interim" id="interim_span"></span>
  </div>

  <div id="div_start">
    <select id="select_language" onchange="updateCountry()"></select>
    &nbsp;&nbsp; <select id="select_dialect"></select>

    &nbsp;&nbsp;<button id="start_button" onclick="startButton(event)">
      <img
        alt="Start"
        id="start_img"
        src="https://www.google.com/intl/en/chrome/assets/common/images/content/mic.gif"
      />
    </button>

    &nbsp;&nbsp;<button
      id="record_button"
      onclick="stopButton(event)"
      style="display:none"
    >
      <img
        alt="Stop"
        id="stop_img"
        src="https://www.google.com/intl/en/chrome/assets/common/images/content/mic-animate.gif"
      />
    </button>
  </div>
</div>

<div class="marquee">
  <div id="info1"><h3>Translate:</h3></div>
  <div id="div_translate"></div>
</div>

</div>
</div>

<style>
  #info {
    font-size: 20px;
  }
  #results {
    font-size: 14px;
    font-weight: bold;
    border: 1px solid #ddd;
    padding: 15px;
    text-align: left;
    min-height: 150px;
  }
  #div_translate {
    font-size: 14px;
    font-weight: bold;
    border: 1px solid #ddd;
    padding: 15px;
    text-align: left;
    min-height: 150px;
  }
  #div_start {
    text-align: center;
  }
  /*
	#start_button {
		border: 0;
		background-color:transparent;
		padding: 0;
    }*/

  .interim {
    color: gray;
  }
  .final {
    color: black;
    padding-right: 3px;
  }
  .marquee {
    margin: 20px auto;
  }
</style>
