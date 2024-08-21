document
  .getElementById("telegram-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const botToken = document.getElementById("bot_token").value;
    const chatId = document.getElementById("chat_id").value;
    const messageId = document.getElementById("message_id").value;
    const messageText = document.getElementById("message_text").value;
    const url = document.getElementById("url").value;
    const comment = document.getElementById("comment").value;
    const caption = document.getElementById("caption").value;
    const mediaFile = document.getElementById("media_file").files[0];

    let finalMessageText = messageText;
    if (url) {
      finalMessageText += `\n\nURL: ${url}`;
    }
    if (comment) {
      finalMessageText += `\n\nComment: ${comment}`;
    }

    if (mediaFile) {
      const mediaType = mediaFile.type.split("/")[0];
      let uploadUrl = `https://api.telegram.org/bot${botToken}/sendDocument`; // Default to document

      switch (mediaType) {
        case "image":
          uploadUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
          break;
        case "video":
          uploadUrl = `https://api.telegram.org/bot${botToken}/sendVideo`;
          break;
        case "audio":
          uploadUrl = `https://api.telegram.org/bot${botToken}/sendAudio`;
          break;
      }

      const formData = new FormData();
      formData.append("chat_id", chatId);
      if (messageId) {
        formData.append("reply_to_message_id", messageId);
      }
      formData.append("caption", caption);
      if (uploadUrl.includes("sendPhoto")) {
        formData.append("photo", mediaFile);
      } else if (uploadUrl.includes("sendVideo")) {
        formData.append("video", mediaFile);
      } else if (uploadUrl.includes("sendAudio")) {
        formData.append("audio", mediaFile);
      } else {
        formData.append("document", mediaFile);
      }

      fetch(uploadUrl, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            document.getElementById("response-message").textContent =
              "Media sent successfully!";
          } else {
            document.getElementById(
              "response-message"
            ).textContent = `Failed to send media: ${data.description}`;
          }
        })
        .catch((error) => {
          document.getElementById(
            "response-message"
          ).textContent = `Error: ${error}`;
        });
    } else {
      // Send a text message if no media file is provided
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        body: new URLSearchParams({
          chat_id: chatId,
          text: finalMessageText,
          reply_to_message_id: messageId || "",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            document.getElementById("response-message").textContent =
              "Message sent successfully!";
          } else {
            document.getElementById(
              "response-message"
            ).textContent = `Failed to send message: ${data.description}`;
          }
        })
        .catch((error) => {
          document.getElementById(
            "response-message"
          ).textContent = `Error: ${error}`;
        });
    }
  });
