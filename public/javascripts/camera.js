const player = document.getElementById('player');
const canvas = document.getElementById('canvas');
const syncText = document.getElementById('upload-syncing');
let context = canvas.getContext('2d');
let captureButton = document.getElementById('capture');
let file;
const constraints = {
  video: true,
};

canvas.style.display = "none"
// Attach the video stream to the video element and autoplay.
navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    player.srcObject = stream;
  });

let dataURLtoBlob;

dataURLtoBlob = function(dataURL) {
  let array, binary, i;
  binary = atob(dataURL.split(',')[1]);
  array = [];
  i = 0;
  while (i < binary.length) {
    array.push(binary.charCodeAt(i));
    i++;
  }
  return new Blob([new Uint8Array(array)], {
    type: 'image/jpg'
  });
};

captureButton.addEventListener('click', (e) => {
  // Draw the video frame to the canvas.
  player.srcObject.getVideoTracks().forEach(track => track.stop())
  player.style.display = "none"
  captureButton.style.display = "none"
  canvas.style.display = "inline-block"
  syncText.style.display = "inline-block"
  context.drawImage(player, 0, 0, canvas.width, canvas.height)
  file = dataURLtoBlob(canvas.toDataURL())
  
  e.preventDefault();
})
