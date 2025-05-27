const conversation = document.getElementById('conversation');
let selectedCostume = '';
let counterTimes = 0;
const lineBreak = document.createElement('br');
const TIMEOUT = 800;
let isRefImageLoaded = false;
let isUploadedImageLoaded = false;

window.addEventListener('load', event => {
  // Clear any existing data
  try {
    localStorage.removeItem('userPhoto');
    localStorage.removeItem('selectedCostume');
  } catch (e) {
    console.log('localStorage not available');
  }
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
      // Reset loading flags
      isRefImageLoaded = false;
      isUploadedImageLoaded = false;

      const messageWhileLoading = document.createElement('div');
      messageWhileLoading.classList.add('loader');
      messageWhileLoading.textContent = 'Picture loading...';
      chatbotResponse.appendChild(messageWhileLoading);
      conversation.appendChild(chatbotResponse);
      conversation.scrollTop = conversation.scrollHeight;

      console.log('Starting image load process');
      
      // Get user photo from localStorage
      const userPhotoData = localStorage.getItem('userPhoto');
      if (!userPhotoData) {
        showErrorAndRetry(chatbotResponse, messageWhileLoading, 'No photo found. Please try uploading again.');
        return;
      }

      // Create uploaded image element
      const imgElement = document.createElement('img');
      imgElement.classList.add('user-image-' + selectedCostume);
      imgElement.style.maxWidth = '100%'; // Prevent overflow
      
      // Create reference image element
      const refElement = document.createElement('img');
      refElement.classList.add('reference-image');
      refElement.src = 'img/' + selectedCostume + '.jpg';
      refElement.style.maxWidth = '100%'; // Prevent overflow

      // Add error handlers for both images
      refElement.onerror = () => {
        console.error('Reference image failed to load');
        showErrorAndRetry(chatbotResponse, messageWhileLoading, 'Costume image failed to load. Please try again.');
      };

      imgElement.onerror = () => {
        console.error('User image failed to load');
        showErrorAndRetry(chatbotResponse, messageWhileLoading, 'Your photo failed to load. Please try uploading again.');
      };

      // Set up load handlers
      refElement.onload = () => {
        console.log('Reference image loaded successfully');
        isRefImageLoaded = true;
        checkAndShowResults(refElement, imgElement, messageWhileLoading, chatbotResponse);
      };

      imgElement.onload = () => {
        console.log('User image loaded successfully');
        isUploadedImageLoaded = true;
        checkAndShowResults(refElement, imgElement, messageWhileLoading, chatbotResponse);
      };

      // Set the user image source last to trigger loading
      imgElement.src = userPhotoData;

    }, TIMEOUT + TIMEOUT);
  }, TIMEOUT);
}

function checkAndShowResults(refImage, uploadedImage, messageWhileLoading, chatbotResponse) {
  // Add a timeout to prevent infinite waiting
  const loadingTimeout = setTimeout(() => {
    if (!isRefImageLoaded || !isUploadedImageLoaded) {
      console.log('Loading timeout - ref:', isRefImageLoaded, 'uploaded:', isUploadedImageLoaded);
      showErrorAndRetry(chatbotResponse, messageWhileLoading, 'Images took too long to load. Please try again.');
    }
  }, 15000); // 15 second timeout (increased from 10)
  
  if (isRefImageLoaded && isUploadedImageLoaded) {
    clearTimeout(loadingTimeout);
    
    // Remove loading message first
    if (messageWhileLoading.parentNode) {
      chatbotResponse.removeChild(messageWhileLoading);
    }
    
    // Add images
    chatbotResponse.appendChild(refImage);
    chatbotResponse.appendChild(uploadedImage);
    
    conversation.scrollTop = conversation.scrollHeight;
    
    setTimeout(function() {
      showCostumeOptions();
    }, TIMEOUT);
  }
}

function showErrorAndRetry(chatbotResponse, messageWhileLoading, errorText) {
  // Remove loading message
  if (messageWhileLoading.parentNode) {
    chatbotResponse.removeChild(messageWhileLoading);
  }
  
  const errorMsg = document.createElement('div');
  errorMsg.textContent = errorText;
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

      // Create costume buttons
      const costumes = [
        { name: 'Harry Potter', key: 'hp', listener: 'listenerHP' },
        { name: 'Cowboy', key: 'cowboy', listener: 'listenerCowboy' },
        { name: 'Witch', key: 'witch', listener: 'listenerWitch' },
        { name: 'Wonder woman', key: 'wonder', listener: 'listenerWonder' },
        { name: 'Fairy', key: 'fairy', listener: 'listenerFairy' },
        { name: 'Mad hatter', key: 'madhat', listener: 'listenerMadhat' },
        { name: 'Pirate', key: 'pirate', listener: 'listenerPirate' },
        { name: 'Batman', key: 'batman', listener: 'listenerBatman' }
      ];

      const buttons = {};
      const listeners = {};

      costumes.forEach(costume => {
        const button = document.createElement('button');
        button.textContent = costume.name;
        
        // Add classes based on costume
        if (['Cowboy', 'Fairy', 'Mad hatter'].includes(costume.name)) {
          button.classList.add('line', 'button-more');
        } else if (['Harry Potter'].includes(costume.name)) {
          button.classList.add('line');
        } else if (['Witch', 'Batman'].includes(costume.name)) {
          button.classList.add('button-more');
        }

        // Create listener function
        listeners[costume.key] = async function() {
          button.classList.add('clicked');
          selectedCostume = costume.key;
          removeListnersForCostumes();
          await showImageResults();
        };

        button.addEventListener('click', listeners[costume.key]);
        buttons[costume.key] = button;
        messageCotumesButtons.appendChild(button);
      });

      conversation.appendChild(messageCotumesButtons);
      conversation.scrollTop = conversation.scrollHeight;

      function removeListnersForCostumes() {
        Object.keys(listeners).forEach(key => {
          buttons[key].removeEventListener('click', listeners[key]);
        });
      }
    }, TIMEOUT);
  }, TIMEOUT);
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
  
  let isProcessing = false; // Prevent multiple uploads
  
  uploadButton.addEventListener('click', function handleFileUpload() {
    if (isProcessing) return;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    // Better mobile support
    fileInput.setAttribute('capture', 'environment');
    
    fileInput.addEventListener('change', handleFileSelect);
    fileInput.click();

    function handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      if (!file.type.match('image.*')) {
        showErrorMessage('Please select a valid image file.');
        return;
      }
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showErrorMessage('Image is too large. Please select a smaller image (under 10MB).');
        return;
      }
      
      isProcessing = true;
      uploadButton.textContent = 'Processing...';
      uploadButton.disabled = true;
      
      // Show loading indicator
      const loadingMessage = document.createElement('div');
      loadingMessage.classList.add('message', 'chatbot');
      loadingMessage.textContent = 'Processing photo...';
      conversation.appendChild(loadingMessage);
      conversation.scrollTop = conversation.scrollHeight;
      
      // Compress and resize image before storing
      compressImage(file, function(dataUrl, error) {
        // Remove loading indicator
        if (loadingMessage.parentNode) {
          conversation.removeChild(loadingMessage);
        }
        
        if (error) {
          showErrorMessage('Failed to process image. Please try again.');
          resetUploadButton();
          return;
        }
        
        try {
          localStorage.setItem('userPhoto', dataUrl);
          uploadButton.removeEventListener('click', handleFileUpload);
          setTimeout(function() {
            showCostumeOptions();
          }, TIMEOUT);
        } catch (e) {
          showErrorMessage('Failed to save image. Please try again.');
          resetUploadButton();
        }
      });
    }
    
    function showErrorMessage(message) {
      const errorMessage = document.createElement('div');
      errorMessage.classList.add('message', 'chatbot');
      errorMessage.textContent = message;
      conversation.appendChild(errorMessage);
      conversation.scrollTop = conversation.scrollHeight;
    }
    
    function resetUploadButton() {
      isProcessing = false;
      uploadButton.textContent = 'Upload photo';
      uploadButton.disabled = false;
    }
  });

  messageUploadButton.appendChild(uploadButton);
  conversation.appendChild(messageUploadButton);
  conversation.scrollTop = conversation.scrollHeight;
}

// Improved image compression function
function compressImage(file, callback) {
  const reader = new FileReader();
  
  reader.onload = function(event) {
    const img = new Image();
    
    img.onload = function() {
      try {
        // Create canvas to resize image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Determine size - limit to max 800px width/height
        let { width, height } = img;
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
        
        // Draw image with proper orientation handling
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get compressed data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Check if compression was successful
        if (dataUrl.length < 50) {
          callback(null, 'Compression failed');
          return;
        }
        
        callback(dataUrl);
      } catch (error) {
        console.error('Canvas error:', error);
        callback(null, 'Image processing failed');
      }
    };
    
    img.onerror = function() {
      console.error('Image load error');
      callback(null, 'Image load failed');
    };
    
    img.src = event.target.result;
  };
  
  reader.onerror = function() {
    console.error('FileReader error');
    callback(null, 'File read failed');
  };
  
  reader.readAsDataURL(file);
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

      setTimeout(function () {
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