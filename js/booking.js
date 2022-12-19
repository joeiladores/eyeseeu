function handleBranchChange() {

  const branch = document.getElementById("selectBranch").value;
  const btnBranch = document.getElementById("displayBtnCalBranch");

  if (branch === "caloocan") {
    btnBranch.innerHTML =
      `
    <a href="" id="btnCalendly" width="150px" class="btn theme-color-light rounded-3 py-3 px-3 fw-2"
    onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticalcaloocan/consultation'});return false;"></i>&nbsp; Book an Appointment</a>
    `;
  }
  else if (branch === "iloilo") {

    btnBranch.innerHTML =
      `
    <a href="" id="btnCalendly" width="150px" class="btn theme-color-light rounded-3 py-3 px-3 fw-2"
    onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticaliloilo/consultation'});return false;"><i
        class="bi bi-calendar2-event"></i>&nbsp; Book an Appointment</a>
    `;
  }
  else if (branch === "gensan") {

    btnBranch.innerHTML =
      `
    <a href="" id="btnCalendly" width="150px" class="btn theme-color-light rounded-3 py-3 px-3 fw-2"
    onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticalgensan/consultation'});return false;"><i class="bi bi-calendar2-event"></i>&nbsp; Book an Appointment</a>
    `;
  }
  else {
    return;
  }

};



// Grand Central
{/* <a href="" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticalcaloocan/consultation'});return false;">Book A Consultation</a>  */ }


// Iloilo
{/* <a href="" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticaliloilo/consultation'});return false;">Book A Consultation</a> */ }


// Gensan
{/* <a href="" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticalgensan/consultation'});return false;">Book A Consultation</a> */ }
