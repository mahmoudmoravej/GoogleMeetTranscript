import { ChromeMessage, Sender } from "../types";

type MessageResponse = (response?: any) => void;

const messagesFromReactAppListener = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  response: MessageResponse
) => {
  console.log("[content.js]. Message received", {
    message,
    sender,
  });

  if (
    sender.id === chrome.runtime.id &&
    message.from === Sender.React &&
    message.message === "Hello from React"
  ) {
    response("Hello from content.js");
  }

  if (
    sender.id === chrome.runtime.id &&
    message.from === Sender.React &&
    message.message === "delete logo"
  ) {
    const logo = document.getElementById("hplogo");
    logo?.parentElement?.removeChild(logo);
  }
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */

chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

var observer = new MutationObserver(function (mutations) {
  if (document.querySelector("[jsController=TEjq6e]")) {
    observer.disconnect();
    connectToTranslation();
  }
});

observer.observe(document, {
  attributes: false,
  childList: true,
  characterData: false,
  subtree: true,
});

function connectToTranslation() {
  window.prev = "";
  // const mah = document.createElement("div") as HTMLElement;
  // mah.id = "mahmoud";
  // mah.style = "color:white;f0nt-size;12pt;height:100px'";

  // if (!document.getElementById("mahmoud")) {
  //   element.innerHTML +=
  //     "<div style='color:white;f0nt-size;12px' id='mahmoud'></div>";
  // }
  const translatedElement = document.getElementById("mahmoud");

  let observer = new MutationObserver((mutations) => {
    const element = document.querySelector("[jsname=tgaKEf]") as HTMLElement;

    const speech = element?.innerText;

    const name = (
      document.getElementsByClassName("zs7s8d jxFHg")[0] as HTMLElement
    )?.innerText;

    const convoLine = name + " : " + speech;

    if (!convoLine.startsWith(window.prev)) {
      //flush prev
      // translate(window.prev).then((translated) => {
      //   console.log(translated);
      // });
    }

    translate(convoLine).then((translated) => {
      console.log(translated);
      // translatedElement.innerHTML = translated;
    });

    window.prev = convoLine;
  });
  observer.observe(document.querySelector("[jsController=TEjq6e]")!, {
    characterData: true,
    attributes: false,
    childList: true,
    subtree: true,
  });
}

function translate(text: string) {
  return fetch(
    "https://translation.googleapis.com/language/translate/v2?key=AIzaSyDf6XLgy4ma33uPlMkwGxrWg59VLDWTOr0&target=fa&source=en&q=" +
      encodeURI(text),
    { method: "POST" }
  )
    .then((response) => response.json())
    .then((data) => data.data.translations[0].translatedText as string);
}
//AIzaSyDf6XLgy4ma33uPlMkwGxrWg59VLDWTOr0

//translate.google.com/

//https://translate.google.com/?sl=en&tl=fa&text=hello&op=translate
