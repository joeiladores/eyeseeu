
function handleClinicChange() {

  const clinic = document.getElementById("selectClinic").value;
  const btnClinic = document.getElementById("displayBtnCalClinic");

  if (clinic === "1") {
    btnClinic.innerHTML =
      `
    <a href="" id="btnCalendly" width="150px" class="btn theme-color-light rounded-3 py-3 px-3 fw-2"
    onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticalcaloocan/consultation'});return false;"></i>&nbsp; Book an Appointment</a>
    `;
  }
  else if (clinic === "2") {

    btnClinic.innerHTML =
      `
    <a href="" id="btnCalendly" width="150px" class="btn theme-color-light rounded-3 py-3 px-3 fw-2"
    onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticaliloilo/consultation'});return false;"><i
        class="bi bi-calendar2-event"></i>&nbsp; Book an Appointment</a>
    `;
  }
  else if (clinic === "3") {

    btnClinic.innerHTML =
      `
    <a href="" id="btnCalendly" width="150px" class="btn theme-color-light rounded-3 py-3 px-3 fw-2"
    onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticalgensan/consultation'});return false;"><i class="bi bi-calendar2-event"></i>&nbsp; Book an Appointment</a>
    `;
  }
  else {
    // return;
  }
  
};



// Grand Central
{/* <a href="" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticalcaloocan/consultation'});return false;">Book A Consultation</a>  */ }


// Iloilo
{/* <a href="" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticaliloilo/consultation'});return false;">Book A Consultation</a> */ }


// Gensan
{/* <a href="" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticalgensan/consultation'});return false;">Book A Consultation</a> */ }
