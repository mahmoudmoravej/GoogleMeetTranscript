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
  let prev: string = "";

  const escapeHTMLPolicy = window.trustedTypes?.createPolicy("forceInner", {
    createHTML: (to_escape: any) => to_escape
  })!;

  const node = document.createElement("div");
  document.body.appendChild(node);
  node.innerHTML = escapeHTMLPolicy.createHTML('<div style="width:400px;height:600px;background-color:white;position: absolute;top: 1px;left: 1px;z-index: 1000;direction:ltr;overflow:scroll"><div id="convo-active" style="font-weight:bold">Active</div><div id="convo-past">Body</div></div>') as unknown as string;

  const convoPast = document.getElementById("convo-past")!;
  const convoActive = document.getElementById("convo-active")!;

  let observer = new MutationObserver((mutations) => {
    mutations.forEach(mut => mut.removedNodes.forEach((node) => console.log(node.nodeValue)));
    const element = document.querySelector("[jsname=tgaKEf]") as HTMLElement;

    const speech = element?.innerText;

    const name = (
      document.getElementsByClassName("zs7s8d jxFHg")[0] as HTMLElement
    )?.innerText;

    let eol = false;

    const convoLine = name == undefined ? null : name + " : " + speech;

    if (!convoLine || !startWith(convoLine, prev)) {
      //flush prev
      eol = true;
    }

    // if (convoLine)
    //   translate(convoLine).then((translated) => {
    //     if (eol)
    //       convoPast.innerHTML = escapeHTMLPolicy.createHTML(prev + '<br/>') as unknown as string;

    //     convoActive.innerHTML = escapeHTMLPolicy.createHTML(translated) as unknown as string;
    //   });

    if (speech == '')
      convoPast.innerHTML = escapeHTMLPolicy.createHTML(convoPast.innerHTML + '<br/>' + '!!! GOOOOOOOZ!') as unknown as string;

    if (eol)
      convoPast.innerHTML = escapeHTMLPolicy.createHTML(prev + '<br/> <br/>' + convoPast.innerHTML) as unknown as string;

    if (convoLine) {
      convoActive.innerHTML = escapeHTMLPolicy.createHTML(convoLine) as unknown as string;
    }

    prev = convoLine ? convoLine : '';
  });
  observer.observe(document.querySelector("[jsController=TEjq6e]")!, {
    characterData: true,
    attributes: false,
    childList: true,
    subtree: true,
  });
}

function startWith(text: string, start: string) {
  const regex = /[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g;

  return text.replace(regex, "").toLowerCase().startsWith(start.replace(regex, "").toLowerCase());
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

// new MutationObserver((mutations) => {
//   mutations.forEach(mut => mut.removedNodes.forEach((node, key, parent) => console.log(node.textContent, key, parent)));
// }).observe(document.querySelector("[jsController=TEjq6e]")!, {
//   characterData: true,
//   attributes: false,
//   childList: true,
//   subtree: true,
// });

//TODO :
/**
 * 
 * seems the approach should be:
 * 1- find the removed items from top and add them to the transcript
 *    - Note that in one observation we may see couple of nodes has been removed, only the top ones are acceptable if they are in same order (i.e. 1,2,3)
 * 2- note that the <span> children are always changing. You can never say it is the latest version
 * 3- sometimes a word in a previous sentense is being correct
 * 4- so, not a perfect approach is here if we cannot access the API
 */