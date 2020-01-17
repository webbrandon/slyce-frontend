let intro = document.getElementById('intro');
let cutPay = document.getElementById('cutPay');
let cutScreen = document.getElementById('cut');
let payScreen = document.getElementById('pay');
let headerMenu = document.getElementById('headerImage');
let introBtn = document.getElementById('beginBtn');
let cutLink = document.getElementById('cutLink');
let payLink = document.getElementById('payLink');
let payPie = document.getElementById('payPie');
let userSettings = document.getElementById('userSettings');

let backCutPay = document.getElementById('backCutPay');
let backCutPay2 = document.getElementById('backCutPay2');
let backPay = document.getElementById('backPay');

headerMenu.style.visibility = "hidden"

function turnOffAllViews() {
  cutPay.style.display = "none"
  cutScreen.style.display = "none"
  payScreen.style.display = "none"
  payPie.style.display = "none"
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

function claimItem(pieId,itemId,user) {
  let url = 'https://api.slyce.cloud/receipt/claim/' + pieId + '/' + itemId + '/' + user
  fetch(url, {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return true
}

function renderPie(data) {
  let pieItems = document.getElementById('pieItems')
  data.data.attributes.receiptLineItems.forEach((item, i) => {
    console.log(item)
    let row = document.createElement('tr')
    let input1 = document.createElement('input')
    let p2 = document.createElement('p')
    p2.classList.add('whiteFont')
    let p3 = document.createElement('p')
    p3.classList.add('whiteFont')
    let p4 = document.createElement('p')
    p4.classList.add('whiteFont')
    input1.classList.add('rowlink')
    input1.type = 'checkbox'
    if (item.claim) {
      input1.checked = true
    }
    if (item.paid) {
      input1.disabled = true
    } else {
      input1.onclick = function(){ claimItem(data.data.attributes.id,item.id,userId) }
    }
    p2.innerText = item.label
    p3.innerText = item.claim ? item.claim : "Unclaimed"
    p4.innerText = item.paid ? 'Paid' : "Unpaid"
    let col1 = document.createElement('td')
    let col2 = document.createElement('td')
    let col3 = document.createElement('td')
    let col4 = document.createElement('td')
    col1.appendChild(input1)
    col2.appendChild(p2)
    col3.appendChild(p3)
    col4.appendChild(p4)
    row.appendChild(col1)
    row.appendChild(col2)
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
