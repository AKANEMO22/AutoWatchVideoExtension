document.addEventListener('DOMContentLoaded', function() {
    const autoPlayBtn = document.getElementById('autoPlayBtn');
    const skipToEndBtn = document.getElementById('skipToEndBtn');
    const toggleLoopBtn = document.getElementById('toggleLoopBtn');
    const statusDiv = document.getElementById('status');

    let videoLooping = false; // Trạng thái lặp lại của video

    // Hàm gửi tin nhắn tới content script
    function sendMessageToContentScript(action, value = null) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, {action: action, value: value}, function(response) {
                    if (response && response.status) {
                        statusDiv.textContent = `Trạng thái: ${response.status}`;
                        if (action === 'toggleLoop' && response.status.includes('lặp lại')) {
                            videoLooping = response.status.includes('Bật');
                            toggleLoopBtn.textContent = videoLooping ? 'Tắt lặp lại' : 'Bật lặp lại';
                        }
                    } else {
                        statusDiv.textContent = 'Lỗi: Không nhận được phản hồi từ trang.';
                    }
                });
            } else {
                statusDiv.textContent = 'Không có tab đang hoạt động.';
            }
        });
    }

    autoPlayBtn.addEventListener('click', function() {
        sendMessageToContentScript('autoPlay');
    });

    skipToEndBtn.addEventListener('click', function() {
        sendMessageToContentScript('skipToEnd');
    });

    toggleLoopBtn.addEventListener('click', function() {
        sendMessageToContentScript('toggleLoop');
    });

    // Cập nhật trạng thái ban đầu của nút lặp lại khi popup được mở
    // (Có thể cần cải tiến để lấy trạng thái thực tế từ content script)
    sendMessageToContentScript('checkLoopStatus');
});
