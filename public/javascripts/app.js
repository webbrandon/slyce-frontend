let photoFile
let constraints = { video: { width:1080, height:1920 }, audio: false };
let track = null;

const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraRetake = document.querySelector("#camera--retake"),
    cameraSave = document.querySelector("#camera--save"),
    cameraTrigger = document.querySelector("#camera--trigger"),
    cloudUpload = document.querySelector("#cloud--upload"),
    cameraEscape = document.querySelector("#camera--escape"),
    headerSelector = document.querySelector("#header"),
    coverSelector = document.querySelector("#main"),
    cam = document.querySelector("#camera"),
    intro = document.getElementById('intro'),
    cutPay = document.getElementById('cutPay'),
    payScreen = document.getElementById('pay'),
    headerMenu = document.getElementById('headerImage'),
    introBtn = document.getElementById('beginBtn'),
    cutLink = document.getElementById('cutLink'),
    payLink = document.getElementById('payLink'),
    payPie = document.getElementById('payPie'),
    payments = document.getElementById('payments'),
    userSettings = document.getElementById('userSettings'),
    selectPayment = document.getElementById('selectPayment'),
    backCutPay = document.getElementById('backCutPay'),
    backCutPay2 = document.getElementById('backCutPay2'),
    backPay = document.getElementById('backPay'),
    backPayments = document.getElementById('backPayPie')

function turnOffAllViews() {
  cam.style.display = 'none'
  cutPay.style.display = "none"
  payScreen.style.display = "none"
  payPie.style.display = "none"
  payments.style.display = "none"
}


// Access the device camera and stream to cameraView
function cameraStart() {
  cam.style.display = 'block'
  headerSelector.style.display = 'none'
  coverSelector.style.display = 'none'
  cameraView.style.display = 'block'
  cameraSensor.style.display = 'block'
  cameraTrigger.style.display = 'block'
  navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(stream) {
          track = stream.getTracks()[0];
          cameraView.srcObject = stream;
      })
      .catch(function(error) {
          console.error("Oops. Something is broken.", error);
      });
}

function cameraStop() {
  cameraView.style.display = 'none'
  cameraSensor.style.display = 'none'
  cameraTrigger.style.display = 'none'
  track.stop();
  cam.style.display = 'none'
  headerSelector.style.display = 'block'
  coverSelector.style.display = 'block'
}

function getReceits() {
  let pies = document.getElementById('pies')
  pies.innerHTML = ''
  turnOffAllViews()
  payScreen.style.display = "inline-block"
  fetch('https://api.slyce.cloud/receipt', {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data)
      renderReceipts(data)
    })
    .catch(err => {
      //getReceits()
    })
}

function loadPie(id) {
  let pieItems = document.getElementById('pieItems')
  pieItems.innerHTML = ''
  turnOffAllViews()
  payPie.style.display = "inline-block"
  fetch('https://api.slyce.cloud/receipt/' + id, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      renderPie(data)
    })
    .catch(err => {
      //getReceits()
    })
}

function claimItem(pieId,itemId,user,currentPayer) {
  let claimLabel = document.getElementById("claim-" + itemId)
  let claimInput = document.getElementById("check-" + itemId)
  if (user == currentPayer || currentPayer.length == 0) {
    let url = 'https://api.slyce.cloud/receipt/claim/' + pieId + '/' + itemId + '/' + user
    fetch(url, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (claimLabel.innerText == user) {
      claimLabel.checked = false
      claimLabel.innerText = 'Unclaimed'
    } else {
      claimLabel.innerText = user
    }
    return true
  } else {
    intMsg(pieId,itemId,user,currentPayer)
  }
}

function renderPie(data) {
  let pieItems = document.getElementById('pieItems')
  let taxCharge = document.getElementById('taxCharge')
  let additionalCharge = document.getElementById('additionalCharge')
  pieId = data.data.attributes.id
  taxCharge.innerText = data.data.attributes.taxes.toFixed(2) + '% Tax'
  //additionalCharge.innerText = data.data.attributes.taxes.toFixed(2) + '% Added Payment'
  data.data.attributes.receipt_items.forEach((item, i) => {
    console.log(item)
    let row = document.createElement('tr')
    let input1 = document.createElement('input')
    let p2 = document.createElement('p')
    p2.classList.add('whiteFont')
    let p = document.createElement('p')
    p.classList.add('whiteFont')
    let p3 = document.createElement('p')
    p3.classList.add('whiteFont')
    p3.id = "claim-" + item.id
    let p4 = document.createElement('p')
    p4.classList.add('whiteFont')
    input1.classList.add('rowlink')
    input1.id = "check-" + item.id
    input1.type = 'checkbox'
    if (item.claim) {
      input1.checked = true
    }
    if (item.paid) {
      input1.disabled = true
    } else {
      let itemPayer = item.claim ? item.claim : ''
      console.log(itemPayer)
      input1.onclick = function(){ claimItem(data.data.attributes.id,item.id,userId,itemPayer) }
    }
    p2.innerText = item.label
    p.innerText = '$' + item.price.toFixed(2)
    p3.innerText = item.claim ? item.claim : "Unclaimed"
    p4.innerText = item.paid ? 'Paid' : "Unpaid"
    let col1 = document.createElement('td')
    let col2 = document.createElement('td')
    let colp = document.createElement('td')
    let col3 = document.createElement('td')
    let col4 = document.createElement('td')
    col1.appendChild(input1)
    col2.appendChild(p2)
    colp.appendChild(p)
    col3.appendChild(p3)
    col4.appendChild(p4)
    row.appendChild(col1)
    row.appendChild(col2)
    row.appendChild(colp)
    row.appendChild(col3)
    row.appendChild(col4)
    pieItems.appendChild(row)
  });

}

function renderReceipts(data) {
  let pies = document.getElementById('pies')
  data.data.attributes.forEach((item, i) => {
    let row = document.createElement('tr')
    let a1 = document.createElement('a')
    let p2 = document.createElement('p')
    p2.classList.add('whiteFont')
    let p3 = document.createElement('p')
    p3.classList.add('whiteFont')
    a1.innerText = "#" + String(item.id)
    a1.classList.add('rowlink')
    a1.onclick = function(){loadPie(item.id)}
    let created = new Date(item.created)
    p2.innerText = created.toLocaleDateString()
    p3.innerText = item.creator
    let col1 = document.createElement('td')
    let col2 = document.createElement('td')
    let col3 = document.createElement('td')
    col1.appendChild(a1)
    col2.appendChild(p2)
    col3.appendChild(p3)
    row.appendChild(col1)
    row.appendChild(col2)
    row.appendChild(col3)
    pies.appendChild(row)
  });

}

function dataURLtoBlob(dataURL) {
  let array, binary, i
  binary = atob(dataURL.split(',')[1])
  array = []
  i = 0
  while (i < binary.length) {
    array.push(binary.charCodeAt(i))
    i++
  }
  return new Blob([new Uint8Array(array)], {
    type: 'image/jpg'
  })
}

function sendFile(uploadUrl) {
  fetch(uploadUrl.destination, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      body: photoFile,
      headers: {
        'Content-Type': 'image/jpeg'
      }
    })
    .then(response => {
      sendPie(uploadUrl.s3path)
    })
    .catch(err => {
      console.log(err)
    })
}

function uploadPhoto() {
  let filename = Math.random().toString(36).substr(2, 9) + '.jpg'
  let url = 'https://api.slyce.cloud/receipt/storage/' + userId + '/' + filename
  return fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      return response.json()
    })
    .then(data => {
      return sendFile(data.data.attributes)
    })
    .catch(error => {
      console.error(error);
    })
}

function sendPie(url) {
  fetch('https://api.slyce.cloud/receipt', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data:{attributes:{creator:userId,receipt_image:url}}})
    })
    .then(response => {
      return response.json()
    })
    .then(data => {
      let pieId = data.data.attributes.id
      loadPie(pieId)
    })
    .catch(err => {
      //getReceits()
    })
}

function overridePayer(pieId,itemId,user) {
  clearMsg()
  let claimLabel = document.getElementById("claim-" + itemId)
  let claimInput = document.getElementById("check-" + itemId)
  let url = 'https://api.slyce.cloud/receipt/claim/' + pieId + '/' + itemId + '/' + user
  fetch(url, {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    claimLabel.innerText = user
    claimInput.selected = true
  })
  .catch(err => {

  })
}

// Halt user Control till message is answered.
function intMsg ( pieId,itemId,user,currentPayer ) {
  clearMsg( )
	let claimOverride = document.getElementById('claimOverride')
	let halt = document.getElementById('haltMsg').style
  halt.display = 'inline-block'
  claimOverride.onclick = function(){ overridePayer(pieId,itemId,user) }
  document.getElementById('userPaying').innerText = currentPayer + ' '
}

function clearMsg( ) {
    document.getElementById('haltMsg').style.display = 'none'
}

function goCutPay() {
  cutPay.style.display = "inline-block"
  payments.style.display = "none"
  pieId = undefined
}

function payWith( method ) {
  fetch('https://api.slyce.cloud/receipt/pay/' + pieId + '/' + userId + '/' + method, {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      turnOffAllViews()
      goCutPay()
    })
    .catch(err => {

    })
}

///////////////////////////////////////////////////////////////////////////////
// Events

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
  cameraSensor.width = 1080;
  cameraSensor.height = 1920;
  cameraOutput.style.display = 'inline-block';
  cameraSensor.style.display = 'inline';
  cameraSensor.getContext("2d").drawImage(cameraView, -480, 0, 1920, 1920);
  cameraOutput.src = cameraSensor.toDataURL("image/jpeg");
  photoFile = dataURLtoBlob(cameraSensor.toDataURL("image/jpeg"))
  cameraOutput.classList.add("taken");
  cameraRetake.style.display = 'inline-block';
  cameraSave.style.display = 'inline-block';
};

// Take a picture when cameraTrigger is tapped
cameraRetake.onclick = function() {
  cameraOutput.src = '//:0';
  cameraOutput.classList.remove("taken");
  cameraRetake.style.display = 'none';
  cameraSave.style.display = 'none';
  cameraOutput.style.display = 'none';
};

// Take a picture when cameraTrigger is tapped
cameraSave.onclick = function() {
  cameraOutput.src = '//:0';
  cameraOutput.classList.remove("taken");
  cameraRetake.style.display = 'none';
  cameraSave.style.display = 'none';
  cameraOutput.style.display = 'none';
  // uploadPhoto()
  // .then(response => {
  //   return response.json()
  // })
  // .then(data => {
  //   sendFile()
  cameraStop()
  uploadPhoto()
};

cloudUpload.addEventListener('click', (e) => {
  let input = document.createElement('input');
  input.type = 'file';
  input.onchange = e => {
    if (e.target.files.length > 0) {
      // getting a hold of the file reference
      photoFile = e.target.files[0];
      cameraStop()
      turnOffAllViews()
      uploadPhoto()
    }
  }
  input.click();
  e.preventDefault();
})

cameraEscape.addEventListener('click', (e) => {
  cameraStop()
  turnOffAllViews()
  cutPay.style.display = "inline-block"
  e.preventDefault();
})

userSettings.addEventListener('click', (e) => {
  turnOffAllViews()
  intro.style.display = "inline-block"
  headerMenu.style.visibility = "hidden"
  e.preventDefault();
})

introBtn.addEventListener('click', (e) => {
  let introError = document.getElementById('introError')
  userId = document.getElementById('userId').value.replace(' ', '_')
  if (userId == '') {
    introError.innerText = "Please enter a user name."
    e.preventDefault();
    return
  }

  introError.innerText = ""
  turnOffAllViews()
  intro.style.display = "none"
  cutPay.style.display = "inline-block"
  headerMenu.style.visibility = "visible"
  e.preventDefault();
})

cutLink.addEventListener('click', (e) => {
  turnOffAllViews()
  cameraStart()
  e.preventDefault();
})

payLink.addEventListener('click', (e) => {
  getReceits()
  e.preventDefault();
})

backCutPay.addEventListener('click', (e) => {
  turnOffAllViews()
  cutPay.style.display = "inline-block"
  e.preventDefault();
})

backPay.addEventListener('click', (e) => {
  turnOffAllViews()
  payScreen.style.display = "inline-block"
  e.preventDefault();
})

backPayments.addEventListener('click', (e) => {
  turnOffAllViews()
  payPie.style.display = "inline-block"
  e.preventDefault();
})

selectPayment.addEventListener('click', (e) => {
  turnOffAllViews()
  // let venmoPay = document.createElement('button')
  // venmoPay.type = 'button'
  // venmoPay.style = "height: 50px;width: 65%;margin: auto;margin-bottom: 20px;"
  // venmoPay.classList.add('btn','btn-secondary','btn-lrg')
  // venmoPay.onclick = function(){ payWith('venmo') }
  // venmoPay.innerText = 'Venmo'
  fetch('https://api.slyce.cloud/receipt/pay/' + pieId + '/' + userId, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data)
      let cost = data.data.attributes.cost
      let pieCost = document.getElementById('pieCost')
      let pieTax = document.getElementById('pieTax')
      let pieTotal = document.getElementById('pieTotal')
      pieCost.innerText = 'Cost: $' + cost.sub_total.toFixed(2)
      pieTax.innerText = 'Tax: $' + cost.tax.toFixed(2)
      pieTotal.innerText = '$' + cost.total.toFixed(2)
      payments.style.display = "inline-block"
    })
    .catch(err => {
    })
  e.preventDefault()
})

///////////////////////////////////////////////////////////////////////////////
// Run Once

turnOffAllViews()
headerMenu.style.visibility = "hidden"
