// -----------------------------
// Aparició suau de seccions
// -----------------------------

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(entries => {
    
    entries.forEach(entry => {

        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }

    });

}, {
    threshold: 0.15
});

sections.forEach(section => {
    section.classList.add("hidden");
    observer.observe(section);
});


// -----------------------------
// Missatge final del repte
// -----------------------------

const challengeBox = document.querySelector(".challenge");

if(challengeBox){

    challengeBox.addEventListener("click", () => {

        alert("Prepareu-vos! És hora de posar a prova la vostra catapulta!");

    });

}
