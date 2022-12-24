function sendMail(){
    var params = {
        name: document.getElementById("name").value ,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
    };
    const serviceID = "service_de79sdh";
    const templeteID = "template_iwmwklw";
    
    emailjs.send(serviceID,templeteID,params)
    .then(
        (res) =>{
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value = "";
            console.log(res);
            alert("Your Message Sent Succesfully");
    
        }
    )
    .catch((err) => console.log(err));
}
