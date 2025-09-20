const data = {
  "scripts": [
    {
      "type": "scripts",
      "title": "ewqe",
      "desc": "qwe",
      "tags": [
        "qweqw"
      ],
      "coverImage": "images/20250920_224910.png",
      "coverHue": 210,
      "url": "",
      "gallery": [
        {
          "img": "images/20250920_224917.png",
          "caption": ""
        },
        {
          "img": "images/20250920_224922.png",
          "caption": ""
        }
      ],
      "actionType": "copy",
      "primaryButtonText": "เปิดสคริปต์",
      "copyButtonText": "คัดลอก",
      "copyText": "eqw",
      "scriptText": "eqw",
      "id": "20250920_224924"
    }
  ],
  "runners": [
    {
      "type": "runners",
      "title": "dfg",
      "desc": "fdgdf",
      "tags": [
        "gdf"
      ],
      "coverImage": "images/20250920_222822.png",
      "coverHue": 210,
      "url": "",
      "gallery": [],
      "id": "20250920_222823"
    }
  ]
};

// Export data object
export default data;
export const scripts = data.scripts;
export const runners = data.runners;
export const allItems = [...scripts, ...runners];