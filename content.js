(function() {
    console.log("Content script loaded for Auto Watch Video extension.");

    // Hàm tìm tất cả các thẻ video trên trang
    function getAllVideos() {
        return document.querySelectorAll('video');
    }

    // Hàm tự động phát video
    function autoPlayVideo() {
        const videos = getAllVideos();
        if (videos.length > 0) {
            videos.forEach(video => {
                if (video.paused) {
                    video.play().then(() => {
                        console.log("Video is playing.");
                    }).catch(error => {
                        console.error("Error playing video:", error);
                        // Thường là do trình duyệt chặn autoplay nếu không có tương tác người dùng
                        // Có thể hiển thị thông báo cho người dùng
                    });
                } else {
                    console.log("Video is already playing.");
                }
            });
            return "Đã cố gắng phát video.";
        } else {
            console.log("Không tìm thấy video nào trên trang.");
            return "Không tìm thấy video nào trên trang.";
        }
    }

    // Hàm tua nhanh video đến cuối
    function skipToEnd() {
        const videos = getAllVideos();
        if (videos.length > 0) {
            videos.forEach(video => {
                if (video.duration > 0 && !isNaN(video.duration)) {
                    video.currentTime = video.duration - 0.1; // Tua gần cuối để đảm bảo sự kiện 'ended' được kích hoạt
                    video.play(); // Đảm bảo video đang chạy để tua
                    console.log("Video skipped to end.");
                } else {
                    console.log("Video duration not available or video not loaded.");
                }
            });
            return "Đã tua nhanh video đến cuối.";
        } else {
            return "Không tìm thấy video nào trên trang.";
        }
    }

    // Hàm bật/tắt lặp lại video
    function toggleVideoLoop() {
        const videos = getAllVideos();
        if (videos.length > 0) {
            let status = "";
            videos.forEach(video => {
                video.loop = !video.loop; // Đảo ngược trạng thái lặp lại
                status = `Chế độ lặp lại: ${video.loop ? 'Bật' : 'Tắt'}`;
                console.log(`Video looping set to: ${video.loop}`);
            });
            return status;
        } else {
            return "Không tìm thấy video nào trên trang.";
        }
    }

    // Lắng nghe tin nhắn từ popup script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        let responseStatus = "";
        switch (request.action) {
            case 'autoPlay':
                responseStatus = autoPlayVideo();
                break;
            case 'skipToEnd':
                responseStatus = skipToEnd();
                break;
            case 'toggleLoop':
                responseStatus = toggleVideoLoop();
                break;
            case 'checkLoopStatus': // Để popup kiểm tra trạng thái lặp lại hiện tại
                const videos = getAllVideos();
                if (videos.length > 0) {
                    responseStatus = `Chế độ lặp lại: ${videos[0].loop ? 'Bật' : 'Tắt'}`;
                } else {
                    responseStatus = "Không tìm thấy video nào.";
                }
                break;
            default:
                responseStatus = "Hành động không xác định.";
        }
        sendResponse({status: responseStatus});
    });

    // Thêm một số logic bổ sung nếu cần:
    // Ví dụ: Tự động tua video khi nó kết thúc và loop được bật
    // (Đây là một cách khác để xử lý việc "xem hết" và lặp lại)
    document.addEventListener('DOMContentLoaded', () => {
        const videos = getAllVideos();
        videos.forEach(video => {
            video.addEventListener('ended', () => {
                if (video.loop) {
                    console.log("Video ended and is set to loop. Restarting...");
                    video.currentTime = 0;
                    video.play();
                }
            });
        });
    });

})();
