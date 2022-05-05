const emailRegex =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const phoneRegex =  /^[0-9 \\-\\+]{4,17}$/i

const formF = [{
  title: 'name',
  check: (value) => value === '',
  message: "Name can not be empty",
},{
  title: 'phone',
  check: (value) => !value.match(phoneRegex),
  message: "Please put a valid phone number!",
},{
  title: 'email',
  check: (value) => !value.match(emailRegex),
  message: "Please put a valid email address!",
},{
  title: 'message',
  check: (value) => value === '',
  message: "Message can not be empty",
},
]
formF.forEach(field => {
  document.forms["contact-form"][`contact-${field.title}`].addEventListener('input', (e) => {
    if (e.target.classList.contains('error')) {
      e.target.classList.remove('error')
      e.target.parentNode.removeChild(e.target.parentNode.querySelector('.err-msg'))
    }
  })
})
document.forms["contact-form"].addEventListener("submit", (e) => {
  let err = false;
  formF.forEach((field) => {
    const elem = e.target[`contact-${field.title}`]
    if (field.check(elem.value)) {
      err = true;
      elem.classList.add('error');
      const errMsg = document.createElement("p");
      errMsg.classList.add('err-msg');
      errMsg.innerText = field.message;
      elem.parentNode.appendChild(errMsg);
    }
  })
  if(err) {
    e.preventDefault()
  }
});
