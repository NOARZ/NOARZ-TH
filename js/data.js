const data = {
  "scripts": [
    {
      "type": "scripts",
      "title": "Blox Fruits zee hub",
      "desc": "สคริปต์ Blox Fruits มือถือ อัปเดตใหม่ล่าสุด มาพร้อม Rip Event ออโต้ ใช้งานได้ครบ จบในตัวเดียว | โปร Roblox มือถือ",
      "tags": [
        "Blox Fruits"
      ],
      "coverImage": "images/20250921_233210.png",
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
    },
    {
      "type": "scripts",
      "title": "Fish it! JinkX HUB",
      "desc": "สคริปต์ Fish it! 🎣 ออโต้ตกปลา+ขายทันที พร้อมทำเบ็ด Ghostfin และตกปลาอีเว้นท์ให้อัตโนมัติ",
      "tags": [
        "Fish it!"
      ],
      "coverImage": "images/20250921_151137.png",
      "coverHue": 210,
      "url": "",
      "gallery": [
        {
          "img": "images/20250921_151241.png",
          "caption": ""
        }
      ],
      "actionType": "copy",
      "primaryButtonText": "เปิดสคริปต์",
      "copyButtonText": "คัดลอก",
      "copyText": "loadstring(game:HttpGet(\"https://raw.githubusercontent.com/stormskmonkey/JinkX/refs/heads/main/Loader.lua\"))()",
      "scriptText": "loadstring(game:HttpGet(\"https://raw.githubusercontent.com/stormskmonkey/JinkX/refs/heads/main/Loader.lua\"))()",
      "id": "20250921_151243"
    },
    {
      "type": "scripts",
      "title": "99 Nights in Forest H4x HUB",
      "desc": "แจกฟรี! Script 99 Nights in Forest 🌙 Auto Chop, Auto Loot ทั้งแมพ, ตีมอน และปลูกต้นไม้รอบ Campfire เองได้ [ล่าสุด]",
      "tags": [
        "99 Nights in Forest"
      ],
      "coverImage": "images/20250921_151629.png",
      "coverHue": 210,
      "url": "",
      "gallery": [
        {
          "img": "images/20250921_151913.png",
          "caption": ""
        }
      ],
      "actionType": "copy",
      "primaryButtonText": "เปิดสคริปต์",
      "copyButtonText": "คัดลอก",
      "copyText": "loadstring(game:HttpGet(\"https://raw.githubusercontent.com/H4xScripts/Loader/refs/heads/main/loader.lua\", true))()",
      "scriptText": "loadstring(game:HttpGet(\"https://raw.githubusercontent.com/H4xScripts/Loader/refs/heads/main/loader.lua\", true))()",
      "id": "20250921_151914"
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
      "url": "https://cdn.gloopup.net/file/Delta-2.689.880.apk",
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