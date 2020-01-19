let intro = document.getElementById('intro');
let cutPay = document.getElementById('cutPay');
let cutScreen = document.getElementById('cut');
let payScreen = document.getElementById('pay');
let headerMenu = document.getElementById('headerImage');
let introBtn = document.getElementById('beginBtn');
let cutLink = document.getElementById('cutLink');
let payLink = document.getElementById('payLink');
let payPie = document.getElementById('payPie');
let payments = document.getElementById('payments');
let userSettings = document.getElementById('userSettings');

let selectPayment = document.getElementById('selectPayment');

let backCutPay = document.getElementById('backCutPay');
let backCutPay2 = document.getElementById('backCutPay2');
let backPay = document.getElementById('backPay');
let backPayments = document.getElementById('backPayPie');

headerMenu.style.visibility = "hidden"

function turnOffAllViews() {
  cutPay.style.display = "none"
  cutScreen.style.display = "none"
  payScreen.style.display = "none"
  payPie.style.display = "none"
  payments.style.display = "none"
}
turnOffAllViews()

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
  cutScreen.style.display = "inline-block"
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

backCutPay2.addEventListener('click', (e) => {
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
  data.data.attributes.receiptLineItems.forEach((item, i) => {
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

function uploadPhoto() {
  let filename = 'random.jpg'
  let url = 'https://api.slyce.cloud/receipt/storage/' + userId + '/' + filename
  fetch(url, {
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
      let uploadUrl = data.data.attributes.destination
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
