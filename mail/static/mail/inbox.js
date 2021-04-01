document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  console.log("see, i'm the reason");
  // By default, load the inbox
  load_mailbox('inbox');

});


function compose_email() {

  load_mailbox('archive');

  load_mailbox('sent');
  console.log(`first compose ${count_test}`);

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#test').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  //load_mailbox('inbox');

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
/* for testing
  let wait = 0;
  for(wait = 0; wait < 100000000; wait++){
    if (wait === 999){
      console.log('wait');
    }
  }
*/
  load_mailbox('sent');
  return false;
  }
}


let count_test = 0;

function load_mailbox(mailbox) {

  count_test++;
  console.log(`count_test ${count_test}`);
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#test').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  const div1 = document.createElement('div');
  div1.id = `${mailbox}-email`;
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
    console.log(emails);

    if(email_name.localeCompare('inbox') === 0){
      const n = document.querySelector(`#${mailbox}-email`);
      emails.forEach((item, i) => {
        const a = document.createElement('div');
        const b = item.id;
        a.innerHTML = item.body;
        a.innerHTML = `<a class="lookhere" data-id=${b} data-page="inbox"><p class="fc"><span class="a1">${item.sender}</span><span class="a2">${item.subject}</span><span class="a3">${item.timestamp}</span></p></a>`;
        n.appendChild(a);
        let is_read = `${item.read}`;
        console.log(is_read);
        if(is_read.localeCompare('true') == 0){
          a.style.background = 'gray';
          a.style.color = 'white';
        }
      });
    }
    else if(email_name.localeCompare('sent') === 0){
      const n = document.querySelector(`#${mailbox}-email`);
      emails.forEach((item, i) => {
        const a = document.createElement('div');
        const b = item.id;
        console.log(`data value ${b}`)
        a.innerHTML = item.body;
        a.innerHTML = `<a class="lookhere" data-id=${b} data-page="sent"><p class="fc"><span class="a1">${item.recipients}</span><span class="a2">${item.subject}</span><span class="a3">${item.timestamp}</span></p></a>`;
        n.appendChild(a);
      });
    }
    else{
      const n = document.querySelector(`#${mailbox}-email`);
      emails.forEach((item, i) => {
        const a = document.createElement('div');
        const b = item.id;
        a.innerHTML = item.body;
        a.innerHTML = `<a class="lookhere" data-id=${b} data-page="archive"><p class="fc"><span class="a1">${item.recipients}</span><span class="a2">${item.subject}</span><span class="a3">${item.timestamp}</span></p></a>`;
        n.appendChild(a);
        a.style.background = 'gray';
        a.style.color = 'white';
      });
    }

    // for test purposes
    let ab = document.querySelectorAll('.lookhere');
    console.log(`Hello`);
    console.log(`${ab} ${ab.length}`);
    console.log(`Hello`);
    // end of the test

    document.querySelectorAll('.lookhere').forEach(a => {
      a.onclick = () =>{
        fetch(`/emails/${a.dataset.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      });

        fetch(`/emails/${a.dataset.id}`)
        .then(response => response.json())
        .then(email => {

            console.log(email);

            document.querySelector('#test').style.display = 'block';
            console.log(`My id is ${a.dataset.id} My Page is ${a.dataset.page}`);
            const div1 = document.createElement('div');
            div1.id = `email-full-view`;
            document.querySelector('#test').appendChild(div1);
            document.querySelector('#emails-view').style.display = 'none';
            let is_it_inbox = '';
            let is_it_archive = '';
            if(a.dataset.page.localeCompare('inbox') == 0){
              is_it_inbox = '<a id="archiveme" class= "btn btn-sm btn-outline-primary">Archive</a>';
            }
            if(a.dataset.page.localeCompare('archive') == 0){
              is_it_archive = '<a id="unarchiveme" class= "btn btn-sm btn-outline-primary">Unarchive</a>';
            }
            document.querySelector('#email-full-view').innerHTML = `


            <a id="goback" class="btn btn-sm btn-outline-primary">Back</a>
            ${is_it_inbox}
            ${is_it_archive}
            <p><span class="bold">From:</span> ${email.sender}</p>
            <p><span class="bold">To:</span> ${email.recipients}</p>
            <p><span class="bold">Subject:</span> ${email.subject}</p>
            <p><span class="bold">Timestamp:</span> ${email.timestamp}</p>
            <a id="replyme" class="btn btn-sm btn-outline-primary">Reply</a>
            <hr>
            <p id="email-full-view-body">${email.body}</p>


            `;

            // reply to the mail
            document.querySelector('#replyme').onclick = () =>{
              console.log('clicked me');
              compose_email();
              document.querySelector('#compose-recipients').value = `${email.sender}`;
              let subject1 = '';
              let subject2 = `${email.subject}`.slice(0,3);
              console.log(`${subject2}`);
              if(subject2.localeCompare('Re:') == 0){
                subject1 = '';
              }
              else{
                subject1 = 'Re:';
              }
              document.querySelector('#compose-subject').value = `${subject1} ${email.subject}`;
              document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote

${email.body}

              `;
            }
            // archive mails
            if(mailbox.localeCompare('inbox') == 0){
            document.querySelector('#archiveme').onclick = () =>{
              fetch(`/emails/${a.dataset.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                  archived: true
              })
            });
            console.log('archived');
            //load_mailbox('sent');
            // I'm intentionally waiting here to have views.py update database before i load inbox
            /*
            let wait = 0;
            for(wait = 0; wait < 10000000; wait++){
              if (wait === 999){
                console.log('wait');
              }
            }*/
            load_mailbox('inbox');
            }
            }
            //unarchive mails
            if(mailbox.localeCompare('archive') == 0){
            document.querySelector('#unarchiveme').onclick = () =>{
              fetch(`/emails/${a.dataset.id}`, {
              method: 'PUT',
              body: JSON.stringify({
                  archived: false
              })
            });
            console.log('unarchived');
            //load_mailbox('sent');
            // I'm intentionally waiting here to have views.py update database before i load inbox
            /*
            let wait = 0;
            for(wait = 0; wait < 10000000; wait++){
              if (wait === 999){
                console.log('wait');
              }
            }*/
            load_mailbox('inbox');
            }
            }
            document.querySelector('#goback').onclick = () => {
              load_mailbox(`${a.dataset.page}`);
            }

        });

      }
    });

  });
  }
