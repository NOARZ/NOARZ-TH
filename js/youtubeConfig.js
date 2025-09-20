// YouTube link configuration
export class YouTubeConfig {
    constructor() {
        this.youtubeLink = document.getElementById('youtubeLink');
        this.initializeLink();
    }

    initializeLink() {
        // ตั้งค่าเริ่มต้นสำหรับลิงก์ YouTube
        this.setYouTubeLink('https://www.youtube.com/@NOARZ-u1t');
    }

    setYouTubeLink(url) {
        // ตรวจสอบว่า URL ถูกต้องหรือไม่
        try {
            new URL(url);
        } catch (e) {
            console.error('Invalid URL:', url);
            return;
        }

        if (this.youtubeLink) {
            this.youtubeLink.href = url;
            this.youtubeLink.title = `Visit our YouTube channel: ${url}`;
        }
    }
}