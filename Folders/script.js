document.addEventListener('DOMContentLoaded', () => {
    const folders = document.querySelectorAll('.folder');
    const contentContainer = document.getElementById('content');
    const body = document.body;
    const logo = document.querySelector('.logo');

    // Get the initial positions of the folders for animation
    const initialPositions = Array.from(folders).map(folder => {
        return { left: folder.offsetLeft, width: folder.offsetWidth };
    });

    folders.forEach((folder, index) => {
        folder.addEventListener('click', (e) => {
            e.preventDefault();

            // Prevent re-running the animation if a folder is already active
            if (body.classList.contains('open') && folder.classList.contains('active')) {
                return;
            }

            // If already open, clear existing content immediately upon new click
            if (body.classList.contains('open')) {
                contentContainer.innerHTML = '';
            }

            // Set fixed positions before adding the 'open' class to prevent jumping
            if (!body.classList.contains('open')) {
                folders.forEach((f, i) => {
                    f.style.left = `${initialPositions[i].left}px`;
                    f.style.width = `${initialPositions[i].width}px`;
                });
            }

            // Add 'open' class to trigger CSS transitions
            body.classList.add('open');
            
            // Handle which folders move up and which move down
            folders.forEach((f, i) => {
                f.classList.remove('active', 'move-up', 'move-down');
                if (i <= index) {
                    f.classList.add('move-up');
                } else {
                    f.classList.add('move-down');
                }
            });
            
            folder.classList.add('active');

            const url = folder.getAttribute('href');
            
            // Delay fetching content to match the 0.5s animation
            setTimeout(() => {
                fetch(url)
                    .then(response => {
                        if (!response.ok) throw new Error('Content not found.');
                        return response.text();
                    })
                    .then(html => {
                        contentContainer.innerHTML = html;
                    })
                    .catch(error => {
                        contentContainer.innerHTML = `<p style="text-align:center;">${error.message}</p>`;
                        console.error('Error fetching content:', error);
                    });
            }, 300); // 500ms = 0.5s delay
        });
    });

    // Add a way to return to the main page by clicking the logo
    logo.addEventListener('click', (e) => {
        if(body.classList.contains('open')) {
             e.preventDefault();
             body.classList.remove('open');
             contentContainer.innerHTML = '';
             folders.forEach(f => {
                f.classList.remove('active', 'move-up', 'move-down');
                // Reset inline styles used for positioning
                f.style.left = '';
                f.style.width = '';
             });
        }
    });
});



// ====== 現有的 SOBU 頁面功能 (與聊天機器人無關的部分，但保留了因為它們是您原有的JS功能) ======
    function toggleMenu() {
      // 此功能需要nav-links和menu-toggle的HTML和CSS才能運作
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) navLinks.classList.toggle('active');
    }

    function scrollToNextSection() {
      // 此功能需要.showroom-remodel的HTML才能運作
      const showroomSection = document.querySelector('.showroom-remodel');
      if (showroomSection) {
        showroomSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // Dropdown menu logic
    document.addEventListener('DOMContentLoaded', () => {
      const dropdowns = document.querySelectorAll('.dropdown');

      dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');

        // 檢查元素是否存在，避免錯誤
        if (dropdownLink && dropdownMenu) {
          dropdownLink.addEventListener('mouseenter', () => {
            dropdownMenu.style.display = 'flex';
          });

          dropdown.addEventListener('mouseleave', () => {
            dropdownMenu.style.display = 'none';
          });

          dropdownLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
              e.preventDefault();
              dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
            }
          });
        }
      });

      const scrollTopBtn = document.getElementById('scrollTopBtn');
      if (scrollTopBtn) { // 檢查按鈕是否存在
        window.addEventListener('scroll', () => {
          if (window.scrollY > 200) {
            scrollTopBtn.style.display = 'block';
          } else {
            scrollTopBtn.style.display = 'none';
          }
        });
      }
    });


    // ====== Dify AI Chatbot 功能 ======

    // !!! 極度危險警告：DIFY API KEY 不應該直接暴露在前端程式碼中！
    // !!! 僅供本地開發和極度臨時的測試使用。
    // !!! 在任何公開環境中部署，請務必使用後端伺服器代理 API 請求。
    const DIFY_API_KEY = 'app-VjgZf6ka7t004V4nIwzbUvg3'; // <-- 您的 Dify API Key
    const DIFY_API_BASE_URL = 'https://api.dify.ai'; // Dify API 基礎 URL

    const chatbotContainer = document.getElementById('chatbotContainer');
    const openChatbotBtn = document.getElementById('openChatbotBtn');
    const closeChatbotBtn = document.getElementById('closeChatbotBtn');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    let conversationId = null; // 用於維持對話上下文
    let loadingMessageElement = null; // To store the "Responding..." message element
    let currentUserId = 'sobu_web_user_' + Date.now(); // Generate a unique user ID once per session

    // 開啟聊天機器人
    openChatbotBtn.addEventListener('click', () => {
      chatbotContainer.classList.add('active');
      openChatbotBtn.style.display = 'none'; // 隱藏氣泡按鈕
      chatInput.focus(); // 輸入框獲得焦點
    });

    // 關閉聊天機器人
    closeChatbotBtn.addEventListener('click', () => {
      chatbotContainer.classList.remove('active');
      openChatbotBtn.style.display = 'flex'; // 顯示氣泡按鈕
    });

    /**
     * 將純文字中的 Markdown 符號轉換為 HTML 標籤。
     * 目前支援：
     * - 換行符號 (\n) -> <br>
     * - 粗體 (**text** 或 __text__) -> <strong>text</strong>
     * - 列表 (開頭為 - 或 * 的行) -> <ul><li>...</li></ul> （簡單實現）
     *
     * @param {string} text 原始文字內容。
     * @returns {string} 轉換為 HTML 的內容。
     */
    function formatMessageText(text) {
      let formattedText = text;

      // 1. 將所有換行符號轉換為 <br>
      formattedText = formattedText.replace(/\n/g, '<br>');

      // 2. 將 **粗體** 或 __粗體__ 轉換為 <strong>
      formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedText = formattedText.replace(/__(.*?)__/g, '<strong>$1</strong>');

      // 3. 簡單處理列表 (Dify通常會輸出帶有 - 或 * 的列表)
      // 這個正則表達式會匹配行首的 <br>- 或 <br>*，然後將其替換為 </li><li>
      // 但這是一個非常基礎的實現，如果Dify輸出更複雜的巢狀列表，可能需要更複雜的解析器。
      // 建議Dify App的prompt引導AI輸出Markdown格式。
      const lines = formattedText.split('<br>');
      let inList = false;
      let processedLines = [];

      lines.forEach(line => {
        const trimmedLine = line.trim();
        // 檢查是否為列表項，但要確保不是純粹的 "-" 或 "*"
        if ((trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) && trimmedLine.length > 2) {
          if (!inList) {
            processedLines.push('<ul>');
            inList = true;
          }
          processedLines.push(`<li>${trimmedLine.substring(2).trim()}</li>`);
        } else {
          if (inList) {
            processedLines.push('</ul>');
            inList = false;
          }
          processedLines.push(line);
        }
      });

      if (inList) {
        processedLines.push('</ul>');
      }
      formattedText = processedLines.join('');


      return formattedText;
    }


    // 添加訊息到聊天視窗
    function addMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', `${sender}-message`);

      const avatarDiv = document.createElement('div');
      avatarDiv.classList.add('avatar');
      avatarDiv.textContent = sender === 'user' ? 'You' : 'AI'; // Or use an icon or image

      const paragraph = document.createElement('p');
      // 在這裡應用排版函數
      paragraph.innerHTML = formatMessageText(text);

      if (sender === 'user') {
        messageDiv.appendChild(paragraph);
        messageDiv.appendChild(avatarDiv);
      } else {
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(paragraph);
      }

      chatbotMessages.appendChild(messageDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // 自動滾動到底部
      return messageDiv; // Return the created message div
    }

    // 發送訊息到 Dify AI
    async function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      addMessage(message, 'user'); // 顯示使用者訊息
      chatInput.value = ''; // 清空輸入框

      // Display "Responding..." message directly in the chat
      loadingMessageElement = addMessage('回答中...', 'bot');

      sendMessageBtn.disabled = true; // 禁用發送按鈕
      chatInput.disabled = true; // 禁用輸入框

      try {
        const payload = {
          inputs: {},
          query: message,
          response_mode: 'blocking',
          user: currentUserId, // Use the persistent user ID
          conversation_id: conversationId, // Will be null for the first message or if reset
        };

        const response = await fetch(`${DIFY_API_BASE_URL}/v1/chat-messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DIFY_API_KEY}`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 400 && errorData.code === 'conversation_not_exists') {
            console.warn("Conversation ID invalid or expired. Starting a new conversation.");
            conversationId = null; // Clear invalid conversation ID
            throw new Error("會話已失效，請重新開始。"); // Provide a user-friendly error
          }
          throw new Error(errorData.message || 'Dify API 錯誤');
        }

        const data = await response.json();
        const aiReply = data.answer || data.text || '抱歉，我沒有收到有效的回答。';

        // Replace the "Responding..." message with the actual AI reply
        if (loadingMessageElement) {
          const paragraph = loadingMessageElement.querySelector('p');
          if (paragraph) {
            // 在這裡應用排版函數
            paragraph.innerHTML = formatMessageText(aiReply);
          }
          loadingMessageElement = null; // Clear the reference
        }

      } catch (error) {
        console.error('發送訊息失敗:', error);
        if (loadingMessageElement) {
          const paragraph = loadingMessageElement.querySelector('p');
          if (paragraph) {
            // 在這裡應用排版函數
            paragraph.innerHTML = formatMessageText(`抱歉，出了點問題：${error.message}`);
          }
          loadingMessageElement = null;
        }
      } finally {
        sendMessageBtn.disabled = false; // 啟用發送按鈕
        chatInput.disabled = false; // 啟用輸入框
        chatInput.focus(); // 輸入框重新獲得焦點
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
      }
    }

    // 監聽發送按鈕點擊
    sendMessageBtn.addEventListener('click', sendMessage);

    // 監聽輸入框的 Enter 鍵 (非 Shift + Enter)
    chatInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // 阻止默認換行行為
        sendMessage();
      }
    });

    // 自動調整輸入框高度
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = chatInput.scrollHeight + 'px';
    });





