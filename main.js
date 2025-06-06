const conversation = document.getElementById('conversation');
let selectedCostume = '';
let counterTimes = 0;
const lineBreak = document.createElement('br');
const TIMEOUT = 800;
let isRefImageLoaded = false;
let isUploadedImageLoaded = false;

window.addEventListener('load', event => {
  localStorage.removeItem('userPhoto');
  localStorage.removeItem('selectedCostume');
});

function showImageResults() {
  const messagePreImageLoad = document.createElement('div');
  const messagePreImageDone = document.createElement('div');
  const chatbotResponse = document.createElement('div');
  chatbotResponse.classList.add('message', 'chatbot', 'image-container');
  messagePreImageLoad.classList.add('message');
  messagePreImageDone.classList.add('message');

  if (counterTimes == 1) {
    messagePreImageLoad.textContent = 'No problem. One moment please.';
    messagePreImageDone.textContent = "I'm almost done. Ready?";
    conversation.appendChild(messagePreImageLoad);
    conversation.scrollTop = conversation.scrollHeight;

  } else if (counterTimes < textPostImageResult.length) {
    messagePreImageLoad.textContent = "I'm on it";
    messagePreImageDone.textContent = 'Oh damn! Look what I made you';
    conversation.appendChild(messagePreImageLoad);
    conversation.scrollTop = conversation.scrollHeight;

  } else {
    messagePreImageDone.textContent = 'Here you go';
  }

  setTimeout(function () {

    conversation.appendChild(messagePreImageDone);
    conversation.scrollTop = conversation.scrollHeight;

    setTimeout(function () {
      // create div for when pic didnt finish to upload

      isRefImageLoaded = false;
      isUploadedImageLoaded = false;

      const messageWhileLoading = document.createElement('div');
      messageWhileLoading.classList.add('loader');
      messageWhileLoading.textContent = 'Picture loading...';
      chatbotResponse.appendChild(messageWhileLoading);
      conversation.appendChild(chatbotResponse);
      conversation.scrollTop = conversation.scrollHeight;

      console.log('1');
      
      // Check if user photo exists in localStorage
      function waitForUserPhoto(retries = 10) {
        const data = localStorage.getItem('userPhoto');
        if (data) {
          continueProcessing(data);
        } else if (retries > 0) {
          setTimeout(() => waitForUserPhoto(retries - 1), 300); // Wait and try again
        } else {
          showError("Photo not found after waiting.");
        }
      }

      if (!userPhotoData) {
        chatbotResponse.removeChild(messageWhileLoading);
        const errorMsg = document.createElement('div');
        errorMsg.textContent = 'Photo not found. Please upload again.';
        errorMsg.classList.add('error-message');
        chatbotResponse.appendChild(errorMsg);
        
        const retryButton = document.createElement('button');
        retryButton.textContent = 'Upload photo again';
        retryButton.addEventListener('click', () => {
          conversation.removeChild(chatbotResponse);
          showUploadButton();
        });
        chatbotResponse.appendChild(retryButton);
        return;
      }
      
      // uploaded
      const imgElement = document.createElement('img');
      imgElement.classList.add('user-image-' + selectedCostume);
      imgElement.src = userPhotoData;

      // our image
      const refElement = document.createElement('img');
      refElement.classList.add('reference-image');
      refElement.src = 'img/' + selectedCostume + '.jpg';

      // Add error handlers for both images
      refElement.onerror = () => {
        console.error('Failed to load reference image');
        chatbotResponse.removeChild(messageWhileLoading);
        const errorMsg = document.createElement('div');
        errorMsg.textContent = 'Failed to load costume image. Please try again.';
        errorMsg.classList.add('error-message');
        chatbotResponse.appendChild(errorMsg);
        
        const retryButton = document.createElement('button');
        retryButton.textContent = 'Try again';
        retryButton.addEventListener('click', () => {
          conversation.removeChild(chatbotResponse);
          showCostumeOptions();
        });
        chatbotResponse.appendChild(retryButton);
      };

      imgElement.onerror = () => {
        console.error('Failed to load user image');
        chatbotResponse.removeChild(messageWhileLoading);
        const errorMsg = document.createElement('div');
        errorMsg.textContent = 'Failed to process your photo. Please upload again.';
        errorMsg.classList.add('error-message');
        chatbotResponse.appendChild(errorMsg);
        
        const retryButton = document.createElement('button');
        retryButton.textContent = 'Upload photo again';
        retryButton.addEventListener('click', () => {
          conversation.removeChild(chatbotResponse);
          showUploadButton();
        });
        chatbotResponse.appendChild(retryButton);
      };

      refElement.onload  = () => {
        console.log('2 refElement true')
        isRefImageLoaded = true;
        showReallyTheResults(refElement,imgElement,messageWhileLoading,chatbotResponse);
      }

      imgElement.onload  = () => {
        console.log('2 imgElement true')
        isUploadedImageLoaded = true;
        showReallyTheResults(refElement,imgElement,messageWhileLoading,chatbotResponse);
      }

    }, TIMEOUT+TIMEOUT);
  }, TIMEOUT);
}

function showReallyTheResults(refImage, uploadedImage, messageWhileLoading, chatbotResponse) {
  // Add a timeout to prevent infinite waiting
  const loadingTimeout = setTimeout(() => {
    if (!isRefImageLoaded || !isUploadedImageLoaded) {
      if (messageWhileLoading.parentNode) {
        chatbotResponse.removeChild(messageWhileLoading);
      }
      const errorMsg = document.createElement('div');
      errorMsg.textContent = 'Upload failed. Please try again.';
      errorMsg.classList.add('error-message');
      chatbotResponse.appendChild(errorMsg);
      
      // Add a retry button
      const retryButton = document.createElement('button');
      retryButton.textContent = 'Try again';
      retryButton.addEventListener('click', () => {
        conversation.removeChild(chatbotResponse);
        showCostumeOptions();
      });
      chatbotResponse.appendChild(retryButton);
    }
  }, 10000); // 10 second timeout
  
  if (isRefImageLoaded && isUploadedImageLoaded) {
    clearTimeout(loadingTimeout);
    chatbotResponse.appendChild(refImage);
    chatbotResponse.appendChild(uploadedImage);
    if (messageWhileLoading.parentNode) {
      chatbotResponse.removeChild(messageWhileLoading);
    }
    conversation.scrollTop = conversation.scrollHeight;
    setTimeout(function() {
      showCostumeOptions();
    }, TIMEOUT);
  }
}

function showCostumeOptions() {
  const messageOkUpload = document.createElement('div');
  const messageBeforeCotumes = document.createElement('div');
  messageBeforeCotumes.classList.add('message', 'chatbot');
  messageOkUpload.classList.add('message', 'chatbot');
  messageOkUpload.textContent = textPostImageResult[counterTimes];
 
  console.log('counter before: '+counterTimes)

  setTimeout( function () {
    if (counterTimes==0) {
      messageBeforeCotumes.textContent =
        'Now for the fun part. What costume do you want to wear?';
      counterTimes++;
      conversation.appendChild(messageOkUpload);
      conversation.scrollTop = conversation.scrollHeight;

    } else {
      if (counterTimes<textPostImageResult.length) {
        counterTimes++;
        conversation.appendChild(messageOkUpload);
        conversation.scrollTop = conversation.scrollHeight;

      }
      messageBeforeCotumes.textContent =
        'Try a different costume?';
    }
    console.log('counter after: '+counterTimes)

    setTimeout(function () {
      conversation.appendChild(messageBeforeCotumes);
      conversation.scrollTop = conversation.scrollHeight;

      const messageCotumesButtons = document.createElement('div');
      messageCotumesButtons.classList.add('message', 'chatbot', 'button-message');

      ////////////////////////// ADD LISTENERS //////////////////////////

      const chatLine1 = document.createElement('div');
      const chatLine2 = document.createElement('div');
      const chatLine3 = document.createElement('div');
      chatLine1.classList.add('line');
      chatLine2.classList.add('line');

      // HP
      const hpButton = document.createElement('button');
      hpButton.textContent = 'Harry Potter';
      hpButton.classList.add('line');
      hpButton.addEventListener('click', listenerHP);
      messageCotumesButtons.appendChild(hpButton);

      // Cowboy
      const cowboyButton = document.createElement('button');
      cowboyButton.textContent = 'Cowboy';
      cowboyButton.classList.add('line','button-more');
      cowboyButton.addEventListener('click', listenerCowboy);
      messageCotumesButtons.appendChild(cowboyButton);

      // Witch
      const witchButton = document.createElement('button');
      witchButton.textContent = 'Witch';
    witchButton.classList.add('button-more');
      witchButton.addEventListener('click', listenerWitch);
      messageCotumesButtons.appendChild(witchButton);

      // Wonder
      const wonderButton = document.createElement('button');
      wonderButton.textContent = 'Wonder woman';
      wonderButton.addEventListener('click', listenerWonder);
      messageCotumesButtons.appendChild(wonderButton);

      // Fairy
      const fairyButton = document.createElement('button');
      fairyButton.textContent = 'Fairy';
      fairyButton.classList.add('line','button-more');
      fairyButton.addEventListener('click', listenerFairy);
      messageCotumesButtons.appendChild(fairyButton);

      // Madhat
      const madhatButton = document.createElement('button');
      madhatButton.textContent = 'Mad hatter';
      madhatButton.classList.add('line','button-more');
      madhatButton.addEventListener('click', listenerMadhat);
      messageCotumesButtons.appendChild(madhatButton);

      // Pirate
      const pirateButton = document.createElement('button');
      pirateButton.textContent = 'Pirate';
      pirateButton.addEventListener('click', listenerPirate);
      messageCotumesButtons.appendChild(pirateButton);

      // Batman
      const batmanButton = document.createElement('button');
      batmanButton.textContent = 'Batman';
    batmanButton.classList.add('button-more');
      batmanButton.addEventListener('click', listenerBatman);
      messageCotumesButtons.appendChild(batmanButton);

      conversation.appendChild(messageCotumesButtons);
      conversation.scrollTop = conversation.scrollHeight;

      ////////////////////////// LISTEN FUNCTIONS //////////////////////////

      async function listenerBatman() {
        selectedCostume = 'batman';
        batmanButton.classList.add('clicked')
        removeListnersForCostumes();
        await showImageResults();
      };

      async function listenerCowboy() {
        cowboyButton.classList.add('clicked')
        selectedCostume = 'cowboy';
        removeListnersForCostumes();
        await showImageResults();
      }

      async function listenerFairy() {
        fairyButton.classList.add('clicked')
        selectedCostume = 'fairy';
        removeListnersForCostumes();
        await showImageResults();
      }

      async function listenerHP() {
        hpButton.classList.add('clicked')
        selectedCostume = 'hp';
        removeListnersForCostumes();
        await showImageResults();
      }

      async function listenerMadhat() {
        madhatButton.classList.add('clicked')
        selectedCostume = 'madhat';
        removeListnersForCostumes();
        await showImageResults();
      }

      async function listenerPirate() {
        pirateButton.classList.add('clicked')
        selectedCostume = 'pirate';
        removeListnersForCostumes();
        await showImageResults();
      }

      async function listenerWitch() {
        witchButton.classList.add('clicked')
        selectedCostume = 'witch';
        removeListnersForCostumes();
        await showImageResults();
      }

      async function listenerWonder() {
        wonderButton.classList.add('clicked')
        selectedCostume = 'wonder';
        removeListnersForCostumes();
        await showImageResults();
      }

      function removeListnersForCostumes() {
        batmanButton.removeEventListener('click', listenerBatman);
        cowboyButton.removeEventListener('click', listenerCowboy);
        fairyButton.removeEventListener('click', listenerFairy);
        hpButton.removeEventListener('click', listenerHP);
        madhatButton.removeEventListener('click', listenerMadhat);
        pirateButton.removeEventListener('click', listenerPirate);
        witchButton.removeEventListener('click', listenerWitch);
        wonderButton.removeEventListener('click', listenerWonder);
      }
    }, TIMEOUT);
  }, TIMEOUT); // Beginning

}

function showUploadButton() {
  // Create pre-upload message
  const messageUploadImage = document.createElement('div');
  messageUploadImage.classList.add('message', 'chatbot');
  const messageUploadP1 = document.createElement('p');
  const messageUploadP2 = document.createElement('p');
  const messageUploadP3 = document.createElement('p');
  messageUploadP1.textContent = 'So first things first - please upload a photo of your face.';                                
  messageUploadP2.textContent = 'For better results, face forward the camera and capture only your face.';
  messageUploadP3.textContent = "And don't worry, we don't save your photos.";
  messageUploadImage.appendChild(messageUploadP1);
  messageUploadImage.appendChild(messageUploadP2)
  messageUploadImage.appendChild(messageUploadP3);
  conversation.appendChild(messageUploadImage);
  conversation.scrollTop = conversation.scrollHeight;

  // Create button message
  const messageUploadButton = document.createElement('div');
  messageUploadButton.classList.add('message', 'chatbot','button-message');
  const uploadButton = document.createElement('button');
  uploadButton.textContent = 'Upload photo';
  uploadButton.addEventListener('click', function handleFileUpload() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      // Add capture attribute for mobile camera with timeout handling
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        fileInput.setAttribute('capture', 'environment');
      }
      
      // Add timeout for file selection to prevent hanging
      let fileSelectionTimeout;
      const handleFileSelectWithTimeout = function(event) {
        clearTimeout(fileSelectionTimeout);
        handleFileSelect(event);
      };
      
      fileInput.addEventListener('change', handleFileSelectWithTimeout);
      
      // Set timeout to detect if camera is hanging
      fileSelectionTimeout = setTimeout(() => {
        console.log('File selection timeout - camera may have failed');
        // Don't show error immediately as user might still be using camera
      }, 30000); // 30 second timeout
      fileInput.click();

      // Add image compression before setting to localStorage
      function handleFileSelect(event) {
        console.log('File selected, processing...');
        const file = event.target.files[0];
        
        // Handle case where user cancels camera/file selection
        if (!file) {
          console.log('No file selected - user may have cancelled');
          return;
        }
        
        if (file && file.type.match('image.*')) {
          // Show loading indicator
          const loadingMessage = document.createElement('div');
          loadingMessage.classList.add('message', 'chatbot');
          loadingMessage.textContent = 'Processing photo...';
          conversation.appendChild(loadingMessage);
          conversation.scrollTop = conversation.scrollHeight;
          
          // Compress and resize image before storing
          compressImage(file, function(dataUrl) {
            console.log('Image compression completed');
            if (dataUrl) {
              localStorage.setItem('userPhoto', dataUrl);
              // Remove loading indicator
              if (loadingMessage.parentNode) {
                conversation.removeChild(loadingMessage);
              }
              uploadButton.removeEventListener('click', handleFileUpload);
              setTimeout(function() {
                showCostumeOptions();
              }, TIMEOUT);
            } else {
              // Handle compression error
              console.log('Image compression failed');
              if (loadingMessage.parentNode) {
                conversation.removeChild(loadingMessage);
              }
              const errorMessage = document.createElement('div');
              errorMessage.classList.add('message', 'chatbot');
              errorMessage.textContent = 'Failed to process the image. Please try again with a different photo.';
              conversation.appendChild(errorMessage);
              conversation.scrollTop = conversation.scrollHeight;
            }
          });
        } else {
          // Show error message if file isn't an image
          const errorMessage = document.createElement('div');
          errorMessage.classList.add('message', 'chatbot');
          errorMessage.textContent = 'There was an error. Please make sure you are selecting a photo and try again';
          conversation.appendChild(errorMessage);
          conversation.scrollTop = conversation.scrollHeight;
        }
      }
    console.log('end of showUploadButton');
});

  messageUploadButton.appendChild(uploadButton);
  conversation.appendChild(messageUploadButton);
  conversation.scrollTop = conversation.scrollHeight;
}

// Add this new function to compress images
function compressImage(file, callback) {
  console.log('Starting image compression for file:', file.name, 'Size:', file.size);
  try {
    const reader = new FileReader();
    reader.onload = function(event) {
      console.log('File read completed');
      try {
        const img = new Image();
        img.onload = function() {
          console.log('Image loaded, dimensions:', img.width, 'x', img.height);
          try {
            // Create canvas to resize image
            const canvas = document.createElement('canvas');
            // Determine size - limit to max 800px width/height
            let width = img.width;
            let height = img.height;
            const maxSize = 800;
            
            if (width > height && width > maxSize) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else if (height > maxSize) {
              width = (width / height) * maxSize;
              height = maxSize;
            }
            
            canvas.width = width;
            canvas.height = height;
            console.log('Canvas created, final size:', width, 'x', height);
            
            // Draw and compress image
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Get reduced-size data URL (0.8 quality)
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            console.log('Image compression successful, data URL length:', dataUrl.length);
            callback(dataUrl);
          } catch (error) {
            console.error('Canvas processing error:', error);
            callback(null);
          }
        };
        
        img.onerror = function(error) {
          console.error('Image load error:', error);
          callback(null);
        };
        
        img.src = event.target.result;
      } catch (error) {
        console.error('Image creation error:', error);
        callback(null);
      }
    };
    
    reader.onerror = function(error) {
      console.error('File read error:', error);
      callback(null);
    };
    
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Compression function error:', error);
    callback(null);
  }
}

function initPage() {
    const messageHello = document.createElement('div');
    messageHello.classList.add('message', 'chatbot');
    messageHello.textContent = 'Hello there';
    conversation.appendChild(messageHello);
    conversation.scrollTop = conversation.scrollHeight;

  setTimeout(function() {

    const messageWhoAmI = document.createElement('div');
    messageWhoAmI.classList.add('message', 'chatbot');
    const messageWhoAmI1 = document.createElement('p');
    const messageWhoAmI2 = document.createElement('p');
    messageWhoAmI1.textContent = "I'm AI-lloween";
    messageWhoAmI2.textContent = 'The spooky AI tool that dresses you up for Halloween.';
    messageWhoAmI.appendChild(messageWhoAmI1);
    messageWhoAmI.appendChild(messageWhoAmI2);
    conversation.appendChild(messageWhoAmI);
    conversation.scrollTop = conversation.scrollHeight;

    setTimeout(function () {

      const messageHowDoes = document.createElement('div');
      messageHowDoes.classList.add('message', 'chatbot');
      const messageHowDoes1 = document.createElement('p');
      const messageHowDoes2 = document.createElement('p');
      messageHowDoes1.textContent = 'How do I work?'
      messageHowDoes2.textContent = 'I infuse a photo of you with costume photos to create marvelous masterpieces.'
      messageHowDoes.appendChild(messageHowDoes1);
      messageHowDoes.appendChild(messageHowDoes2);
      conversation.appendChild(messageHowDoes);
      conversation.scrollTop = conversation.scrollHeight;

      setTimeout(  function () {
        showUploadButton();
      }, TIMEOUT);
    }, TIMEOUT);
  }, TIMEOUT);
}

// Code starts here
initPage();

const textPostImageResult = ['Great, the photo was uploaded successfully.',
  "HAHAHA!! Do you like it?? I can't believe you'd waste my time on you. You should've seen your face!!",
  "We're you expecting a different outcome?! HAHAHA!!", "Fool you once, shame on you. Fool you so many times... are you ok?",
  "Ah I get it, it's some sort of an addiction",
  "Are we becoming besties?",
  "Umm okay it's getting out of hand... I don't have time for this",
  "Listen, I'm turning auto-pilot on. Do whatever you want. See ya."];