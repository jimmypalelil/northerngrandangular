
const video = document.getElementById('video');


function getPermissions() {
  return new Promise((res, rej) => {
    navigator.mediaDevices.getUserMedia({video:true, audio:true})
      .then(stream => {
        res(stream);
      }).catch(err => {
        console.log(`Error: ${err}`);
    });
  });
}

getPermissions().then(stream => {
  video.srcObject = stream;

  video.play();
});
