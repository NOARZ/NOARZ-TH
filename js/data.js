const data = {
  "scripts": [
    {
      "type": "scripts",
      "title": "Blox Fruits zee hub",
      "desc": "สคริปต์ Blox Fruits มือถือ อัปเดตใหม่ล่าสุด มาพร้อม Rip Event ออโต้ ใช้งานได้ครบ จบในตัวเดียว | โปร Roblox มือถือ",
      "tags": [
        "Blox Fruits"
      ],
      "coverImage": "images/20250921_142115.png",
      "coverHue": 210,
      "url": "",
      "gallery": [
        {
          "img": "images/20250921_142106.png",
          "caption": ""
        }
      ],
      "actionType": "copy",
      "primaryButtonText": "เปิดสคริปต์",
      "copyButtonText": "คัดลอก",
      "copyText": "loadstring(game:HttpGet(\"https://zuwz.me/Ls-Zee-Hub\"))()",
      "scriptText": "loadstring(game:HttpGet(\"https://zuwz.me/Ls-Zee-Hub\"))()",
      "id": "20250921_142116"
    },
    {
      "type": "scripts",
      "title": "Grow A Garden Speed Hub",
      "desc": "แจกฟรี Script Grow A Garden อัปเดตใหม่ ออโต้ทำงาน Fall Event + Auto Buy ใช้ได้แม้ AFK [ไม่ต้องใช้คีย์]",
      "tags": [
        "Grow A Garden"
      ],
      "coverImage": "images/20250921_145736.png",
      "coverHue": 210,
      "url": "",
      "gallery": [
        {
          "img": "images/20250921_145933.png",
          "caption": ""
        }
      ],
      "actionType": "copy",
      "primaryButtonText": "เปิดสคริปต์",
      "copyButtonText": "คัดลอก",
      "copyText": "loadstring(game:HttpGet(\"https://raw.githubusercontent.com/AhmadV99/Speed-Hub-X/main/Speed%20Hub%20X.lua\", true))()",
      "scriptText": "loadstring(game:HttpGet(\"https://raw.githubusercontent.com/AhmadV99/Speed-Hub-X/main/Speed%20Hub%20X.lua\", true))()",
      "id": "20250921_145938"
    }
  ],
  "runners": [
    {
      "type": "runners",
      "title": "Delta Android Update!",
      "desc": "+ Updated to 2.689.880\n+ New Detections Bypassed, Still Undetected\n+ Memory Optimisations \n+ Improved \n    + `WebSocket.connect` Error Handling\n    + `getscriptclosure`\n    + `getsenv`\n+ Bug Fixes",
      "tags": [
        "Delta"
      ],
      "coverImage": "images/20250921_135623.png",
      "coverHue": 210,
      "url": "https://deltaexploits.gg/delta-executor-android",
      "gallery": [],
      "id": "20250921_135627"
    },
    {
      "type": "runners",
      "title": "✨ CODEX ANDROID! ✨",
      "desc": "[Changelog]\n+ Updated to the latest version of Roblox (2.689.880\n+ FIXED CRASHING\n+ STILL UD(UNDETECTED!!!!)",
      "tags": [
        "CODEX"
      ],
      "coverImage": "images/20250921_140913.png",
      "coverHue": 210,
      "url": "https://codex.lol/android",
      "gallery": [],
      "id": "20250921_140914"
    }
  ]
};

// Export data object
export default data;
export const scripts = data.scripts;
export const runners = data.runners;
export const allItems = [...scripts, ...runners];