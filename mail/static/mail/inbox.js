document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').onsubmit = () =>{
    const recipients = document.querySelector('#compose-recipients');
    const subject = document.querySelector('#compose-subject');
    const body = document.querySelector('#compose-body');

    fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients.value,
        subject: subject.value,
        body: body.value
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });
  return false;
  }

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1) + ' test'}</h3>`;
  const div1 = document.createElement('div');
  div1.id = 'sent-emails';
  document.querySelector('#emails-view').appendChild(div1);
  let email_name = 'inbox';
  if(mailbox.localeCompare('inbox') === 0){
    email_name = 'inbox';
  }
  else if(mailbox.localeCompare('sent') === 0){
    email_name = 'sent';
  }
  else{
    email_name = 'archive';
  }
  fetch(`/emails/${email_name}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);

    if(email_name.localeCompare('sent') === 0){
      const n = document.querySelector('#sent-emails');
      emails.forEach((item, i) => {
        const a = document.createElement('div');
        a.innerHTML = item.body;
        a.innerHTML = `<p class="fc"><span class="a1">${item.recipients}</span><span class="a2">${item.subject}</span><span class="a3">${item.timestamp}</span></p>`;
        n.appendChild(a);
      });

    }

    // ... do something else with emails ...
  });
  }
